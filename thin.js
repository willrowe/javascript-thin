(function (window, document) {
    "use strict";
    var prototypePatch = Object.getPrototypeOf(document.querySelectorAll("html")).constructor.name === "Object";

    function bindLoad(listener, waitForAll) {
        if (waitForAll === true) {
            window.addEventListener("load", listener);
            return;
        }
        document.addEventListener("DOMContentLoaded", listener);
    }

    function forEach(object, callback, thisArg) {
        window.Array.prototype.forEach.call(object, callback, thisArg);
    }

    function getInheritedPrototypes(object) {
        var prototypes = [],
            parentPrototype = Object.getPrototypeOf(object);

        if (parentPrototype !== null) {
            prototypes = prototypes.concat(getInheritedPrototypes(parentPrototype));
            prototypes.push((prototypePatch ? parentPrototype : parentPrototype.constructor).toString().match("(?:function|\\[object) ([A-Za-z0-9]+)")[1].replace("Prototype", ""));
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

    function convertToNodeList() {
        var randomClassName = generateRandomClassName(),
            nodeList;

        forEach(arguments, function (object) {
            var prototypes = getInheritedPrototypes(object);
            if (prototypes.indexOf("NodeList") >= 0 || prototypes.indexOf("Element") >= 0) {
                object.addClass(randomClassName);
            }
        });
        nodeList = document.querySelectorAll("." + randomClassName);
        nodeList.removeClass(randomClassName);

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
            "object:Element|NodeList+": {
                thisArg: this,
                callback: convertToNodeList
            }
        };

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
        var parameters = signature.split(new RegExp(", ?"));

        parameters = parameters.map(function (parameter, index) {
            parameter = (index > 0 ? ", " : "") + parameter;

            // convert optional parameters
            parameter = parameter.replace(new RegExp("^(, )?(.*)\\?$"), "($1$2)?");

            // convert multiple parameters
            parameter = parameter.replace(new RegExp("^(, )?(.*)\\+$"), "($1$2(, )?)+");

            // convert object type parameter to handle inheritance correctly
            parameter = parameter.replace(new RegExp("^(\\(?(?:, )?)object:((?:[^\\|\\(\\)]+\\|?)+)(\\)\\?|\\(, \\)\\?\\)\\+)?$"), "$1object:({[^}]+})*{($2)}({[^}]+})*$3");

            return parameter;
        });


        return new RegExp("^" + parameters.join("") + "$");
    }

    function matchSignature(args) {
        var thinSignature,
            calledSignature = getSignature(args);

        for (thinSignature in thinFunctionSignatures) {
            if (calledSignature.match(generateRegex(thinSignature)) !== null) {
                return thinFunctionSignatures[thinSignature];
            }
        }
    }

    window.Thin = function () {
        var signature = matchSignature(arguments);

        return signature.callback.apply(signature.thisArg, arguments);
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

    // Query
    window.NodeList.prototype.querySelector = function (selector) {
        var results = callEach(this, "querySelector", [selector]);

        return results.filter(function (elements) {
            return elements !== null;
        })[0] || [];
    };

    window.NodeList.prototype.querySelectorAll = function (selector) {
        var results = callEach(this, "querySelectorAll", [selector]);

        return convertToNodeList.apply(null, results);
    };
}(window, document));
