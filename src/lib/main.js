// NOTE: See rivets issue 532
// Use rv-attr-* binder
rivets.binders['attr-*'] = function(el, value) {
  var attrToSet = this.type.substring(this.type.indexOf('-')+1)

  if(value) {
    el.setAttribute(attrToSet, value);
  } else {
    el.removeAttribute(attrToSet);
  }
};

// NOTE: By default unknown binders set an attribute. Which means a typo won't
// become an error.
rivets.binders['*'] = function() {
  console.warn("Unknown binder : " + this.type);
}

function toUrl (id, page) {
  return 'chrome-extension://' + id + '/' + page;
}

function addExtension () {
  var rawRow = {
    full_name: globalModel.manifest.name,
    id: globalModel.id,
    page: globalModel.manifest.chrome_url_overrides.newtab
  };
  var row = ext.createRow(rawRow);
  return extDb.insertOrReplace().into(ext).values([row]).exec()
    .then(function () {
      console.debug('New extension inserted into database');
      // change model
      // NOTE: use push since rivets watches Array.prototype methods instead of
      // the array; trying to do otherwise causes weird things to happen; see
      // https://github.com/mikeric/rivets/issues/497#issuecomment-114837422
      globalModel.model.push(rawRow);
    });
}

function openExtension (button) {
  var name = button.innerHTML;
  var ext = globalModel.model.filter(function (x) {
    return x.full_name === name;
  })[0];
  var id = ext.id, page = ext.page;

  window.open(toUrl(id, page));
}

function removeExtension(button) {
  var id = button.name;
  return extDb.delete().from(ext).where(ext.id.eq(id)).exec()
    .then(function () {
      console.debug('Ext', id, 'removed from database');
      // find index of deleted ext
      var index = globalModel.model.map(function (e) {
        return e.id;
      }).indexOf(id);
      globalModel.model.splice(index, 1);
    })
}

// toManifestUrl formatter - takes an id and returns url to that extension's
// manifest
rivets.formatters.toManifestUrl = function (id) {
  return toUrl(id, 'manifest.json');
}

rivets.binders.json = {
  bind: function (el) {
    console.log(this.observer.key.path);
    var adapter = rivets.adapters[this.observer.key.i];
    this.callback = function () {
      adapter.set(this.model, this.observer.key.path, JSON.parse(el.value));
    }.bind(this);
    el.addEventListener('input', this.callback);
  },
  unbind: function (el) {
    el.removeEventListener('input', this.callback);
  }
}

// Grab all registered extensions in bookmarks
BOOKMARKS_BAR = '1';
chrome.bookmarks.getSubTree(BOOKMARKS_BAR, function (bookmarks) {
  console.log(bookmarks);
  var model = bookmarks[0].children.filter(function (b) {
    return b.title === 'New Tabs';
  })[0].children.map(function (c) {
    var full_name = c.title;
    var url_regex = /chrome-extension:\/\/([a-z]{32})\/(.*)/;
    var arr = url_regex.exec(c.url);
    return {full_name: full_name, id: arr[1], page: arr[2]};
  });
  var template = document.querySelector('#ext_template');
  globalModel = {model: model}
  var view = rivets.bind(template, globalModel);
  window.addEventListener('unload', function () {
    globalView.unbind();
  });
});
