Multitab
========

A new tab page that opens other new tab pages!!!

![Mandatory screenshot](https://cloud.githubusercontent.com/assets/7255867/17273300/92a79b10-569f-11e6-9c7f-78111d984dce.gif)

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


Contributing
------------

As for style, all I can say is the follow what's already here (including
directory structure). Here are some code snippets to serve as examples.

```js
function toggleManifestInput() {
  globalModel.showManifestInput = !globalModel.showManifestInput;
  if (globalModel.showManifestInput) {
    chrome.tabs.create({
      url: toUrl(JSON.parse(globalModel.ext).id, 'manifest.json'),
      active: false
    });
  }
}
```

```html
<head>
  <meta charset="utf-8">
  <title>Multitab</title>
  <script src="../bower_components/rivets/dist/rivets.bundled.min.js"
    charset="utf-8"></script>
  <script src='lib/main.js' type="text/javascript"></script>
</head>
```

Try to keep lines under 80 characters.

Unit tests are written using Jasmine. They are in the `src/specs` directory.
Run the specs by opening `src/test.html` in a browser.

All specs for components should go into `src/specs/components`.


Roadmap
-------

1. Modularize `main.js`
1. Convert to ES2016
2. Design user interface
2. Add random new tab and round robin new tab selection
3. Build process
4. Publish the thing
5. *The future is what you make it*
