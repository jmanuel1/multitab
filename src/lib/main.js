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

function toggleManifestInput() {
  globalModel.showManifestInput = !globalModel.showManifestInput;
  if (globalModel.showManifestInput) {
    chrome.tabs.create({
      url: toUrl(JSON.parse(globalModel.ext).id, 'manifest.json'),
      active: false
    });
  }
}

extensionManager = {
  addExtension: function () {
    var ext = JSON.parse(globalModel.ext);
    chrome.bookmarks.create({
      'parentId': NEW_TABS_FOLDER.id,
      'title': ext.name,
      'url': toUrl(ext.id, globalModel.manifest.chrome_url_overrides.newtab)
    });
  }
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

rivets.components['extension-selector'] = {
  template: function () {
    return '<select></select>';
  },

  initialize: function (el, data) {
    chrome.management.getAll(function (extensions) {
      extensions.filter(function (ext) {
        return ext.type === 'extension';
      }).forEach(function (ext) {
        var opt = document.createElement('option');
        opt.text = ext.name;
        opt.value = JSON.stringify(ext);
        el.querySelector('select').add(opt);
      });
      el.querySelector('select').addEventListener('change', function () {
          var event = new Event('input');
          el.value = this.value;
          el.dispatchEvent(event);
      });
    });
    return {};
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
var BOOKMARKS_BAR = '1', NEW_TABS_FOLDER;
chrome.bookmarks.getSubTree(BOOKMARKS_BAR, function (bookmarks) {
  console.log(bookmarks);

  NEW_TABS_FOLDER = bookmarks[0].children.filter(function (b) {
    return b.title === 'New Tabs';
  })[0];

  if (NEW_TABS_FOLDER === undefined) { // ensure it exists
    chrome.bookmarks.create({
      parentId: BOOKMARKS_BAR,
      title: 'New Tabs'
    }, init);
    return;
  }

  init(NEW_TABS_FOLDER);

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

  globalModel.extensionManager = extensionManager;
  globalModel.toggleManifestInput = toggleManifestInput;

  var template = document.querySelector('#ext_template');
  var view = rivets.bind(template, globalModel);
  window.addEventListener('unload', function () {
    view.unbind();
  });
}
