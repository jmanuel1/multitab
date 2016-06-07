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

rivets.components.extension = {
  template: function () {
    return '<button type="button" class="ext-opener">{ ext.full_name }</button>' +
      '<button type="button" class="ext-remover">Remove</button>';
  },

  initialize: function (el, data) {
    el.querySelector('.ext-opener').addEventListener('click', function () {
      chrome.tabs.getCurrent(function (tab) {
        chrome.tabs.update(tab.id, {
          url: toUrl(data.ext.id, data.ext.page)
        });
      });
    });

    el.querySelector('.ext-remover').addEventListener('click', function () {
      removeExtension(data.ext.id);
    });

    return {
      ext: data.ext
    };
  }
}

function removeExtension(id) {
  var index = globalModel.model.map(function (e) {
    return e.id;
  }).indexOf(id);
  chrome.bookmarks.remove(globalModel.model.splice(index, 1)[0].bookmark_id, function () {
    console.debug('Ext', id, 'removed from model and bookmarks');
  });
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

  var folder = bookmarks[0].children.filter(function (b) {
    return b.title === 'New Tabs';
  })[0];

  if (folder === undefined) { // ensure it exists
    chrome.bookmarks.create({
      parentId: BOOKMARKS_BAR,
      title: 'New Tabs'
    }, init);
    return;
  }

  init(folder);

  /*
    NOTE: folder is NOT watched for changes. If the contents of the folder
    change, Multitab must be reloaded. Justification: it's the new tab page,
    so it's being reloaded in every new tab anyways.
  */
});

function init(folder) {
  if (folder.children) {
    var model = folder.children.map(function (c) {
      var full_name = c.title;
      var url_regex = /chrome-extension:\/\/([a-z]{32})\/(.*)/;
      var arr = url_regex.exec(c.url);
      return {full_name: full_name, id: arr[1], page: arr[2], bookmark_id: c.id};
    });
    globalModel = {model: model}
  } else {
    globalModel = {model: []};
  }

  var template = document.querySelector('#ext_template');
  var view = rivets.bind(template, globalModel);
  window.addEventListener('unload', function () {
    view.unbind();
  });
}
