CHANGELOG
=========

v1.0.0 (2014.11.04)
-------------------
- Initial Release.

v1.1.0 (2014.11.04)
-------------------
- Additional load binding shortcuts available on the `Thin` function:
    + `DOMContentLoaded` event binding (`document.readyState` == `"interactive"`).
    + `window` `load` event binding (`document.readyState` == `"complete"`).

v1.1.1 (2014.11.27)
-------------------
- A bug which caused the load binding callback to be executed twice when the `waitForAll` parameter was set to `true` was fixed.