/* Specs for extension component */
describe("The extension component", function () {
  beforeEach(function () {
    this.initComponent('extension', {
      ext: {id: 'id', page: 'page', full_name: 'full_name'}
    });
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
