var schemaBuilder = lf.schema.create('exts', 1);

schemaBuilder.createTable('Extensions').
  addColumn('name', lf.Type.STRING).
  addColumn('full_name', lf.Type.STRING).
  addColumn('id', lf.Type.STRING).
  addColumn('page', lf.Type.STRING).
  addPrimaryKey(['id']);

var extDb, ext;
schemaBuilder.connect().then(function (db) {
  extDb = db;
  ext = db.getSchema().table('Extensions');
  var rows = [
    {
      "name": "tabbie",
      "full_name": "Tabbie",
      "id": "kckhddfnffeofnfjcpdffpeiljicclbd",
      "page": "tab.html"
    },
    {
      "name": "earth",
      "full_name": "Google Earth View",
      "id": "bhloflhklmhfpedakmangadcdofhnnoh",
      "page": "index.html"
    }
  ].map(ext.createRow.bind(ext));

  return db.insertOrReplace().into(ext).values(rows).exec();
}).then(function () {
  return extDb.select().from(ext).exec();
}).then(function (model) {
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
});

function toUrl (id, page) {
  return 'chrome-extension://' + id + '/' + page;
}
