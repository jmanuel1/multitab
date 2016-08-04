beforeEach(function () {
  // Chrome API spies
  window.chrome = {
    tabs: {
      getCurrent: function (callback) {
        var tab = {id: 'id'};
        callback(tab);
      },
      update: function (id, info) {},
      create: function (info) {}
    },
    management: {
      getAll: function (callback) {
        var exts = [
          {type: 'extension', name: 'extension-name'},
          {type: 'app', name: 'app-name'}
        ];
        callback(exts);
      }
    }
  };
  spyOn(chrome.tabs, "getCurrent").and.callThrough();
  spyOn(chrome.tabs, "update");
  spyOn(chrome.management, "getAll").and.callThrough();
  spyOn(chrome.tabs, "create");

  // Spies on things we don't want to test
  window.removeExtension = function (id) {};
  spyOn(window, "removeExtension");

  this.el = document.createElement('div');
  this.initComponent = function (component, model) {
    rivets.init(component, this.el, model);
  }
});
