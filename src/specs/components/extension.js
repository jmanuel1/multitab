/* Specs for extension component */
describe("The extension component", function () {
  beforeEach(function () {
    // Chrome API spies
    window.chrome = {
      tabs: {
        getCurrent: function (callback) {
          var tab = {id: 'id'};
          callback(tab);
        },
        update: function (id, info) {}
      }
    };
    spyOn(chrome.tabs, "getCurrent").and.callThrough();
    spyOn(chrome.tabs, "update");

    // Spies on things we don't want to test
    window.removeExtension = function (id) {};
    spyOn(window, "removeExtension");

    this.el = document.createElement('div');
    this.model = {ext: {id: 'id', page: 'page', full_name: 'full_name'}};
    rivets.init('extension', this.el, this.model);
  });

  it("should open the extension when the extension's name is pressed",
    function () {
      this.el.openButton.dispatchEvent(new Event('click'));
      expect(chrome.tabs.getCurrent).toHaveBeenCalled();
      expect(chrome.tabs.update).toHaveBeenCalledWith('id', {
        url: 'chrome-extension://id/page'
      });
    });

  it("should remove the extension when the remove button is pressed",
    function () {
      this.el.removeButton.dispatchEvent(new Event('click'));
      expect(removeExtension).toHaveBeenCalledWith('id');
    });
});
