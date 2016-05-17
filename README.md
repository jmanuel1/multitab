Multitab
========

A new tab page that opens other new tab pages!!!

Unfortunately, this neither runs from a server nor works as a chrome extension
because of Chrome's restrictions. **Load `src/index.html` directly from the
file system (so you can see `file://` in the URL).**

How It Works
------------

1. Extract the chrome_url_overrides.newtab information from the extension
   manifest.
1. `window.open` `chrome-extension://<extension-id>/<newtab>.html`
1. It works!

The extension database is stored in a table called `ext` by
[lovefield](https://google.github.io/lovefield/) using indexedDB.
