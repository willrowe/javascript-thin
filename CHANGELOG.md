CHANGELOG
=========

v1.2.0 (2015.01.??)
-------------------
- A different way of parsing the different `Thin` function signatures was implemented which pushes the minimum supported version of Opera up to 12.10. All other browsers remain the same.
- An instance of `NodeList` or `Element` can be passed to the `Thin` function and an instance of `NodeList` will be returned representing the same elements.
- The `querySelector` and `querySelectorAll` methods were added to the `NodeList` interface to allow for subquerying already selected elements

v1.1.1 (2014.11.27)
-------------------
- A bug which caused the load binding callback to be executed twice when the `waitForAll` parameter was set to `true` was fixed.

v1.1.0 (2014.11.04)
-------------------
- Additional load binding shortcuts available on the `Thin` function:
    + `DOMContentLoaded` event binding (`document.readyState` == `"interactive"`).
    + `window` `load` event binding (`document.readyState` == `"complete"`).

v1.0.0 (2014.11.04)
-------------------
- Initial Release.
