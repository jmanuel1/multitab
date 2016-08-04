/* Specs for extension-selector component */
describe("The extension-selector component", function () {
  beforeEach(function () {
    this.initComponent('extension-selector', {});
  });

  it("should be initialized with all extensions (ext.type === 'extension')",
    function () {
      expect(JSON.parse(this.el.options[0].value)).toEqual({
        type: 'extension',
        name: 'extension-name'
      });
    });

  describe('when an extension is chosen', function() {
    beforeEach(function () {
      spyOn(this.el, "dispatchEvent");
      // Ensure the event is actually doing something
      this.el.value = null;
      this.el.selectElement.dispatchEvent(new Event('change'));
    });

    it("should fire an event", function () {
      expect(this.el.dispatchEvent).toHaveBeenCalledWith(new Event('input'));
    });

    it("should store the chosen extension on the value property (as JSON)",
      function () {
        expect(JSON.parse(this.el.value)).toEqual({
          type: 'extension',
          name: 'extension-name'
        });
      });
  });
});
