describe("extensionManager.addExtension", function () {
  beforeEach(function () {
    window.globalModel = {
      ext: {name: 'ext-name', id: 'ext-id'},
      manifest: {chrome_url_overrides: {newtab: 'newtab.html'}},
      model: []
    }
    window.NEW_TABS_FOLDER = {id: 'folder-id'};
    extensionManager.addExtension();
  });

  it("should add a bookmark when called", function () {
    var args = chrome.bookmarks.create.calls.argsFor(0);
    expect(args[0]).toEqual({
      parentId: 'folder-id',
      title: 'ext-name',
      url: 'chrome-extension://ext-id/newtab.html'
    });
  });

  it("should add the extension to the model", function () {
    expect(globalModel.model).toEqual([{
      full_name: 'ext-name',
      id: 'ext-id',
      page: 'newtab.html',
      bookmark_id: 'bookmark-id'
    }]);
  });
});
