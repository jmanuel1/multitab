function toUrl (id, page) {
  return 'chrome-extension://' + id + '/' + page;
}

var model = [
  {
    name: 'tabbie',
    full_name: 'Tabbie',
    id: 'kckhddfnffeofnfjcpdffpeiljicclbd',
    page: 'tab.html'
  },
  {
    name: 'earth',
    full_name: 'Google Earth View',
    id: 'bhloflhklmhfpedakmangadcdofhnnoh',
    page: 'index.html'
  }
]

var templateScript = document.querySelector('#ext_template').innerHTML;
var template = Handlebars.compile(templateScript);
document.body.innerHTML += template(model);

var buttons = document.querySelectorAll('button');

for (var i = 0; i < buttons.length; i++) {
  buttons[i].onclick = function (event) {
    var name = event.target.getAttribute('name');
    var ext = model.filter(function (x) {
      return x.name === name;
    })[0];
    var id = ext.id, page = ext.page;

    window.open(toUrl(id, page));
  }
}
