Thin JavaScript Utility
=======================
**Thin** is a small utility which extends the default behavior of the `Element` and `NodeList` JavaScript interfaces to make working with the DOM easier and require less code. This utility was developed specifically for modern browsers using standardized ES5 and ES6 features, with careful thought put into making the syntax intuitive and familiar to those who have worked with other JavaScript libraries.

[Installation](#installation)  
[Features](#features)  
[Method Reference](#method-reference)  
[Browser Compatibility](#browser-compatibility)  
[License](#license)  

Installation
------------
1. Download or clone this repository and copy either the `thin.js` or `thin.min.js` file into your website.
2. Add the utility to the pages that require it with a `script` tag.  
`<script src="path/to/thin.min.js type="text/javascript"></script>`  
*Make sure that it is the first script loaded if possible. At the very least it should be loaded before any other scripts that uses its methods.*
3. Start using the utitilty! Take a look at the [Features](#features) and [Method Reference](#method-reference) sections for information on how to get started.

Features
--------
- **NodeList Looping**: A `forEach` method is added to the `NodeList` interface which loops over the nodes it contains.
- **Group Methods**: Several methods relating to classes, attributes, and events that are available on the `Element` interface are added to the `NodeList` interface as well, so that methods can be called on all `Element`s in a `NodeList` at once.
- **Property Methods**: These are a shortcut for setting properties directly or by using the array syntax (`Element[propertyName]`), they also have the added bonus of only affecting properties that exist on the interface already. References to non-existent properties will simply be ignored.
- **Method Chaining**: `Element` and `NodeList` methods will return a reference to themselves when a specific value is not expected.
- **Query Shortcut**: The `Thin` function is included which is an alias for `document.querySelectorAll`. In conjunction with the **Group Methods** mentioned above, a query for a single `Element` will have the same methods available without needing to extract it from the `NodeList`.

Method Reference
----------------
Next to each method name it is stated whether the method was been *Added* or the existing method was *Altered*
###General###
- `Thin(query)` *Added*
    Returns any `Element` that matches the query.
    + query
        - `String`
        - The query to match against.
    * Returns `NodeList`

###Element Interface###
- `addClass(name[, ...])` *Added*  
    Adds one or more classes to the `Element`.
    + name
        - `String`
        - A name to add to the class attribute.
    + ...
        - `String`
        - Any additional names to add.
    + Returns `Element`
- `removeClass(name[, ...])` *Added*  
    Removes one or more classes from the `Element`.
    + name
        - `String`
        - A name to remove from the class attribute.
    + ...
        - `String`
        - Any additional names to remove.
    + Returns `Element`
- `hasClass(name)` *Added*  
    Whether the `Element` has the class.
    + name
        - `String`
        - The name to check for.
    + Returns `Boolean`
- `setAttribute(name[, value])` *Altered*  
    Sets the value of one or more attributes on the `Element`. An object of key/value pairs may be used to set multiple attributes.
    + name
        - `String` or `Object`
        - If a string is passed then the attribute with that name is assigned the passed `value`. If an object is passed then attributes are assigned by the key/value pairs.
    + value
        - `Any`
        - If a single attribute is being set, this should be the value to set it to.
    + Returns `Element`
- `removeAttribute(name[, ...])` *Altered*  
    Removes one or more attributes from the `Element`.
    + name
        - `String`
        - An attribute to remove from the class.
    + ...
        - `String`
        - Any additional attributes to remove.
    + Returns `Element`
- `setProperty` *Added*  
    Sets one or more properties on the `Element`. An object of key/value pairs may be used to set multiple properties. *Non-existent properties will not be set.*
    + name
        - `String` or `Object`
        - If a string is passed then the property with that name is assigned the passed `value`. If an object is passed then attributes are assigned by the key/value pairs.
    + value
        - `Any`
        - If a single property is being set, this should be the value to set it to.
    + Returns `Element`
- `getProperty(name)` *Added*  
    Gets the value of the `Element` property. If the property is non-existent then `undefined` will be returned.
    + name
        - `String`
        - The property to return the value of.
    + Returns `Any`
- `hasProperty(name)` *Added*  
    Whether the property exists on the `Element`. *This method differs from the `hasOwnProperty` method, which only compares to the properties of the current prototype and not inherited ones.*
    + name
        - `String`
        - The property to check for.
    + Returns `Boolean`
- `addEventListener(type, listener[, useCapture])` *Altered*  
    This method functions identically to the native implementation, but returns itself for chaining.
    + Returns `Element`
- `removeEventLister(type, listener[, useCapture])` *Altered*  
    This method functions identically to the native implementation, but returns itself for chaining.
    + Returns `Element`

###NodeList Interface###
- `forEach(callback[, thisArg])` *Added*  
    Loops through each `Element` and applies the callback to each one.
    + callback
        - `Function`
        - The function to be called on each `Element`. This function will be passed a single argument which is the `Element` itself.
    + thisArg
        - `Object`
        - The object which will be bound to the `this` variable when the `callback` is called.
    + Returns `NodeList`
- `addClass(name[, ...])` *Added*  
    Adds one or more classes to each `Element` in the `NodeList`.
    + name
        - `String`
        - A name to add to the class attribute.
    + ...
        - `String`
        - Any additional names to add.
    + Returns `NodeList`
- `removeClass(name[, ...])` *Added*  
    Removes one or more classes from each `Element` in the `NodeList`.
    + name
        - `String`
        - A name to remove from the class attribute.
    + ...
        - `String`
        - Any additional names to remove.
    + Returns `NodeList`
- `hasClass(name)` *Added*  
    Whether any `Element` in the `NodeList` has the class.
    + name
        - `String`
        - The name to check for.
    + Returns `Boolean`
- `getAttribute(name)` *Added*  
    Gets the value of the attribute on the first `Element` in the `NodeList`.
    + name
        - `String`
        - The attribute to return the value of.
    + Returns `Any`
- `setAttribute(name[, value])` *Added*  
    Sets the value of one or more attributes on each `Element` in the `NodeList`. An object of key/value pairs may be used to set multiple attributes.
    + name
        - `String` or `Object`
        - If a string is passed then the attribute with that name is assigned the passed `value`. If an object is passed then attributes are assigned by the key/value pairs.
    + value
        - `Any`
        - If a single attribute is being set, this should be the value to set it to.
    + Returns `NodeList`
- `removeAttribute(name[, ...])` *Added*  
    Removes one or more attributes from each `Element` in the `NodeList`.
    + name
        - `String`
        - An attribute to remove from the class.
    + ...
        - `String`
        - Any additional attributes to remove.
    + Returns `NodeList`  
- `hasAttribute(name)` *Added*  
    Whether any `Element` in the `NodeList` has the attribute.
    + name
        - `String`
        - The attribute to check.
    + Returns `Boolean`
- `setProperty` *Added*  
    Sets one or more properties on each `Element` in the `NodeList`. An object of key/value pairs may be used to set multiple properties. *Non-existent properties will not be set.*
    + name
        - `String` or `Object`
        - If a string is passed then the property with that name is assigned the passed `value`. If an object is passed then attributes are assigned by the key/value pairs.
    + value
        - `Any`
        - If a single property is being set, this should be the value to set it to.
    + Returns `NodeList`
- `getProperty(name)` *Added*  
    Gets the value of the property on the first `Element` in the `NodeList`. If the property is non-existent then `undefined` will be returned.
    + name
        - `String`
        - The property to return the value of.
    + Returns `Any`
- `hasProperty(name)` *Added*  
    Whether the property exists on any `Element` in the `NodeList`.
    + name
        - `String`
        - The property to check for.
    + Returns `Boolean`
- `addEventListener(type, listener, useCapture)` *Added*  
    This method uses the specifications found here:  
    http://www.w3.org/TR/dom/#eventtarget  
    https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.addEventListener
    + Returns `NodeList`  
- `removeEventListener(type, listener, useCapture)` *Added*  
    This method uses the specifications found here:
    http://www.w3.org/TR/dom/#eventtarget  
    https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.removeEventListener 
    + Returns `NodeList`

Browser Compatibility
---------------------
- **Chrome**: 8.0+
- **Firefox**: 6.0+
- **Internet Explorer**: 10.0+
- **Opera**: 12.00+
- **Safari**: 5.1+


License
-------
The **Thin** JavaScript utility is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT)