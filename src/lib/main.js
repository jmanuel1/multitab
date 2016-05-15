function toUrl (id, page) {
  return 'chrome-extension://' + id + '/' + page;
}

function addExtension () {
  var rawRow = {
    full_name: globalModel.manifest.name,
    id: globalModel.id,
    page: globalModel.manifest.chrome_url_overrides.newtab
  };
  var row = ext.createRow(rawRow);
  return extDb.insertOrReplace().into(ext).values([row]).exec()
    .then(function () {
      console.debug('New extension inserted into database');
      // change model
      // NOTE: use push since rivets watches Array.prototype methods instead of
      // the array; trying to do otherwise causes weird things to happen; see
      // https://github.com/mikeric/rivets/issues/497#issuecomment-114837422
      globalModel.model.push(rawRow);
    });
}

function openExtension (button) {
  var name = button.innerHTML;
  var ext = globalModel.model.filter(function (x) {
    return x.full_name === name;
  })[0];
  var id = ext.id, page = ext.page;

  window.open(toUrl(id, page));
}

// toManifestUrl formatter - takes an id and returns url to that extension's
// manifest
rivets.formatters.toManifestUrl = function (id) {
  return toUrl(id, 'manifest.json');
}

rivets.binders.href = function (el, value) {
  el.setAttribute('href', value);
}

rivets.binders.json = {
  bind: function (el) {
    console.log(this.observer.key.path);
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

var schemaBuilder = lf.schema.create('exts', 1);
var globalModel;

schemaBuilder.createTable('Extensions').
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
      "full_name": "Tabbie",
      "id": "kckhddfnffeofnfjcpdffpeiljicclbd",
      "page": "tab.html"
    },
    {
      "full_name": "Google Earth View",
      "id": "bhloflhklmhfpedakmangadcdofhnnoh",
      "page": "index.html"
    }
  ].map(ext.createRow.bind(ext));

  return db.insertOrReplace().into(ext).values(rows).exec();
}).then(function () {
  return extDb.select().from(ext).exec();
}).then(function (model) {
  var template = document.querySelector('#ext_template');
  globalModel = {model: model}
  var view = rivets.bind(template, globalModel);
  window.addEventListener('unload', function () {
    globalView.unbind();
  });
});
