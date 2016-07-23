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

Basic Documentation
-------------------

The 'Your Extensions' section is a list of your extensions. Click the title of
each extension to open it in the current tab. There is a 'remove' button next
to each extension. That button removes the extension from Multitab and the
New Tabs folder.

### Adding an Extension

In the 'Add an Extension' section, select the new tab extension you want to add
in the dropdown menu.

Note *all* your Chrome extensions will be in the dropdown. This is a limitation
of Chrome.

Press the 'Enter manifest' button and follow the directions that appear. (A new
tab will be opened.)

After pasting into the textbox, if the extension you chose is not a new tab
extension, the message 'This is not a new tab extension.' will be displayed at
the bottom of the page. Otherwise, press the OK button that appears at the
bottom of the page.
