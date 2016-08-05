describe("The rv-json binder", function () {
  it("should set the value of the keypath on input event", function () {
    var el = document.createElement('div'), model = {};
    var object = {an: "object", with: ['data', 'and', {numbers: [0, 7, 5]}]};
    el.setAttribute('rv-json', 'keypath');
    el.value = JSON.stringify(object);
    rivets.bind(el, model);
    el.dispatchEvent(new Event('input'));
    expect(model.keypath).toEqual(object);
  });
});
