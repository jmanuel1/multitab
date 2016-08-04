describe("The toggleManifestInput function", function () {
  beforeEach(function () {
    window.globalModel = {showManifestInput: false, ext: '{"id":"some-id"}'};
  });
  it("should toggle globalModel.showManifestInput", function () {
    toggleManifestInput();
    expect(globalModel.showManifestInput).toBeTruthy();
    toggleManifestInput();
    expect(globalModel.showManifestInput).toBeFalsy();
  });

  it("should open a new tab with the extension manifest if " +
     "showManifestInput becomes true", function () {
    toggleManifestInput();
    expect(chrome.tabs.create).toHaveBeenCalledWith({
      url: 'chrome-extension://some-id/manifest.json',
      active: false
    });
  });
});
