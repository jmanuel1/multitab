Multitab
========

A new tab page that opens other new tab pages!!!

This is a chrome extension. It's not published, so you'll have to clone the
repo, then install it as an unpacked extension.

How It Works
------------

1. Extract the chrome_url_overrides.newtab information from the extension
   manifest.
1. `chrome.tabs.update(current_tab, {url: 'chrome-extension://<extension-id>/<newtab>.html'})`
1. It works!

The extension "database" is stored in a bookmarks folder called `New Tabs`.
