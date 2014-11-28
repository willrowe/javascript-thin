(function (window, document) {
    "use strict";

    function bindLoad(listener, waitForAll) {
        if (waitForAll === true) {
            window.addEventListener("load", listener);
            return;
        }
        document.addEventListener("DOMContentLoaded", listener);
    }

    function getInheritedPrototypes(object) {
        var prototypes = [],
            parentPrototype = Object.getPrototypeOf(object);

        if (parentPrototype !== null) {
            prototypes = prototypes.concat(getInheritedPrototypes(parentPrototype));
            prototypes.push(parentPrototype.constructor.name);
        }

        return prototypes;
    }

    function generateRandomClassName() {
        var randomClassName;
        do {
            randomClassName = "thin-rcn-" + Math.random().toString(36).substring(7);
        } while (document.querySelector("." + randomClassName));

        return randomClassName;
    }

    function convertToNodeList(object) {
        if (getInheritedPrototypes(object).indexOf("NodeList") >= 0) {
            return object;
        }
        var randomClassName = generateRandomClassName(),
            nodeList;
        object.addClass(randomClassName);
        nodeList = document.querySelectorAll("." + randomClassName);
        object.removeClass(randomClassName);

        return nodeList;
    }

    var originalMethods = {
            "Element": {
                "setAttribute": window.Element.prototype.setAttribute,
                "removeAttribute": window.Element.prototype.removeAttribute,
                "addEventListener": window.Element.prototype.addEventListener,
                "removeEventListener": window.Element.prototype.removeEventListener
            }
        },
        thinFunctionSignatures = {
            "string": {
                thisArg: document,
                callback: document.querySelectorAll
            },
            "function, boolean?": {
                thisArg: this,
                callback: bindLoad
            },
            "object:Element|NodeList": {
                thisArg: this,
                callback: convertToNodeList
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

    function getTypeString(variable) {
        var type = typeof variable;

        if (type !== "object") {
            return type;
        }

        return type + ":{" + getInheritedPrototypes(variable).join("}{") + "}";
    }

    function getSignature(args) {
        var types = [];
        forEach(args, function (variable) {
            types.push(getTypeString(variable));
        });

        return types.join(", ");
    }

    function generateRegex(signature) {
        var namePattern = "[A-Za-z0-9]+";
        signature = signature.replace(new RegExp("((?:, )?" + namePattern + ")\\?", "g"), "($1)?").replace(new RegExp("(object:)((?:" + namePattern + "\\|?)+)", "g"), "$1(?:{" + namePattern + "})*{($2)}(?:{" + namePattern + "})*");
        return new RegExp("^" + signature + "$");
    }

    function matchSignature(args) {
        var matches,
            thinSignature,
            calledSignature = getSignature(args);
        for (thinSignature in thinFunctionSignatures) {
            matches = calledSignature.match(generateRegex(thinSignature));
            if (matches !== null) {
                thinSignature = thinFunctionSignatures[thinSignature];
                break;
            }
        }

        if (!("arguments" in thinSignature)) {
            thinSignature.arguments = [];
        }
        if (matches.length > 1) {
            thinSignature.arguments.push(matches[1]);
        }

        return thinSignature;
    }

    window.Thin = function () {
        var signature = matchSignature(arguments);

        return signature.callback.apply(signature.thisArg, Array.prototype.slice.call(arguments).concat(signature.arguments));
    };

    /**
     * Element
     */

    // Classes
    window.Element.prototype.addClass = function () {
        forEach(arguments, function (name) {
            this.classList.add(name);
        }, this);

        return this;
    };

    window.Element.prototype.removeClass = function () {
        forEach(arguments, function (name) {
            this.classList.remove(name);
        }, this);

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

    // Properties
    window.Element.prototype.setProperty = function (name, value) {
        var properties = name;
        if (typeof properties === "string") {
            properties = {};
            properties[name] = value;
        }

        for (name in properties) {
            if (this.hasProperty(name)) {
                this[name] = properties[name];
            }
        }

        return this;
    };

    window.Element.prototype.getProperty = function (name) {
        return this[name];
    };

    window.Element.prototype.hasProperty = function (name) {
        return (name in this);
    };

    // Events
    window.Element.prototype.addEventListener = function (type, listener, useCapture) {
        originalMethods.Element.addEventListener.call(this, type, listener, useCapture);

        return this;
    };

    window.Element.prototype.removeEventListener = function (type, listener, useCapture) {
        originalMethods.Element.removeEventListener.call(this, type, listener, useCapture);

        return this;
    };


    /**
     * NodeList
     */
    window.NodeList.prototype.forEach = function (callback, thisArg) {
        forEach(this, callback, thisArg);

        return this;
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

    // Properties
    window.NodeList.prototype.setProperty = function (name, value) {
        callEach(this, "setProperty", [name, value]);

        return this;
    };

    window.NodeList.prototype.getProperty = function (name) {
        return this[0].getProperty(name);
    };

    window.NodeList.prototype.hasProperty = function (name) {
        var results = callEach(this, "hasProperty", [name]);

        return (results.indexOf(true) >= 0);
    };

    // Events
    window.NodeList.prototype.addEventListener = function (type, listener, useCapture) {
        callEach(this, "addEventListener", [type, listener, useCapture]);

        return this;
    };

    window.NodeList.prototype.removeEventListener = function (type, listener, useCapture) {
        callEach(this, "removeEventListener", [type, listener, useCapture]);

        return this;
    };
}(window, document));