(function (window, document) {
    "use strict";

    var originalMethods = {
        "Element": {
            "setAttribute": window.Element.prototype.setAttribute,
            "removeAttribute": window.Element.prototype.removeAttribute
        }
    };

    function forEach(object, callback, thisArg) {
        window.Array.prototype.forEach.call(object, callback, thisArg);
    }

    function callEach(object, functionName, args) {
        var returnValues = [];
        object.forEach(function (item) {
            returnValues.push(item[functionName].apply(item, args));
        });

        return returnValues;
    }

    /**
     * Element
     */

    // Classes
    window.Element.prototype.addClass = function () {
        this.classList.add.apply(this.classList, arguments);

        return this;
    };

    window.Element.prototype.removeClass = function () {
        this.classList.remove.apply(this.classList, arguments);

        return this;
    };

    window.Element.prototype.hasClass = function (name) {
        return this.classList.contains(name);
    };

    // Attributes
    window.Element.prototype.setAttribute = function (name, value) {
        var attributes = name;
        if (typeof attributes === "string") {
            attributes = {};
            attributes[name] = value;
        }

        for (name in attributes) {
            originalMethods.Element.setAttribute.call(this, name, attributes[name]);
        }

        return this;
    };

    window.Element.prototype.removeAttribute = function () {
        forEach(arguments, function (name) {
            originalMethods.Element.removeAttribute.call(this, name);
        }, this);

        return this;
    };

    /**
     * NodeList
     */
    window.NodeList.prototype.forEach = function (callback, thisArg) {
        forEach(this, callback, thisArg);
    };

    // Classes
    window.NodeList.prototype.addClass = function () {
        callEach(this, "addClass", arguments);

        return this;
    };

    window.NodeList.prototype.removeClass = function () {
        callEach(this, "removeClass", arguments);

        return this;
    };

    window.NodeList.prototype.hasClass = function (name) {
        var results = callEach(this, "hasClass", [name]);

        return (results.indexOf(true) >= 0);
    };

    // Attributes
    window.NodeList.prototype.getAttribute = function (name) {
        return this[0].getAttribute(name);
    };

    window.NodeList.prototype.setAttribute = function (name, value) {
        callEach(this, "setAttribute", [name, value]);

        return this;
    };

    window.NodeList.prototype.removeAttribute = function () {
        callEach(this, "removeAttribute", arguments);

        return this;
    };

    window.NodeList.prototype.hasAttribute = function (name) {
        var results = callEach(this, "hasAttribute", [name]);

        return (results.indexOf(true) >= 0);
    };
}(window, document));