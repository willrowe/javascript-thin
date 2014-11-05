(function (Q) {
    "use strict";

    var singleSelector = ".menu",
        multipleSelector = ".menu-item",
        singleFormSelector = "form input[type=checkbox][name=checkbox1]",
        multipleFormSelector = "form input[type=checkbox]",
        sandboxSelector = "#sandbox",
        originalSandboxNode,
        dispatchedConfirmationString,
        DOMContentLoadedTestResult,
        WindowLoadedTestResult;

    window.Thin(function (evt) {
        DOMContentLoadedTestResult = {
            thisObj: this,
            state: document.readyState,
            eventObj: evt
        };
    });

    window.Thin(function (evt) {
        WindowLoadedTestResult = {
            thisObj: this,
            state: document.readyState,
            eventObj: evt
        };
    }, true);

    function $(selector, multiple) {
        multiple = (multiple === null || multiple === undefined) ? true : multiple;

        if (multiple) {
            return document.querySelectorAll(selector);
        }

        return document.querySelector(selector);
    }

    function cleanSandbox() {
        var sandboxNode = document.querySelector(sandboxSelector);
        sandboxNode.parentNode.replaceChild(originalSandboxNode.cloneNode(true), sandboxNode);
    }

    function generateTestEvent() {
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent("test", true, true, Math.random().toString(36).substring(7));

        return evt;
    }

    function testListener(evt) {
        dispatchedConfirmationString = evt.detail;
    }

    document.addEventListener("DOMContentLoaded", function () {
        originalSandboxNode = document.querySelector(sandboxSelector).cloneNode(true);
    });

    Q.testStart(function () {
        cleanSandbox();
        dispatchedConfirmationString = null;
    });

    /*
     * Thin Function
     */
    Q.test("Thin Query Selector", function (assert) {
        var i,
            thinList,
            nativeList;

        assert.ok(window.Thin(singleSelector) instanceof window.NodeList);
        assert.strictEqual(window.Thin(singleSelector)[0], document.querySelectorAll(singleSelector)[0]);

        thinList = window.Thin(multipleSelector);
        nativeList = document.querySelectorAll(multipleSelector);
        assert.ok(thinList instanceof window.NodeList);
        for (i = 0; i < thinList.length; i += 1) {
            assert.strictEqual(thinList[i], nativeList[i]);
        }
    });

    Q.test("Thin DOMContentLoaded Binding", function (assert) {
        assert.strictEqual(DOMContentLoadedTestResult.thisObj, document);
        assert.equal(DOMContentLoadedTestResult.state, "interactive");
        assert.equal(DOMContentLoadedTestResult.eventObj.type, "DOMContentLoaded");
    });

    Q.test("Thin Window Load Binding", function (assert) {
        assert.strictEqual(WindowLoadedTestResult.thisObj, window);
        assert.equal(WindowLoadedTestResult.state, "complete");
        assert.equal(WindowLoadedTestResult.eventObj.type, "load");
    });

    /**
     * Element
     */

    // Class Methods
    Q.test("Add Element Class", function (assert) {
        // One Class
        assert.ok($(singleSelector, false).addClass("foo") instanceof window.Element);
        assert.ok($(singleSelector, false).className.indexOf("foo") >= 0);

        // Multiple Classes
        assert.ok($(singleSelector, false).addClass("foo", "bar") instanceof window.Element);
        assert.ok($(singleSelector, false).className.indexOf("foo") >= 0);
        assert.ok($(singleSelector, false).className.indexOf("bar") >= 0);
    });

    Q.test("Remove Element Class", function (assert) {
        // One Class
        $(singleSelector, false).addClass("foo");
        assert.ok($(singleSelector, false).removeClass("foo") instanceof window.Element);
        assert.equal($(singleSelector, false).className.indexOf("foo"), -1);

        // Multiple Classes
        $(singleSelector, false).addClass("foo", "bar");
        $(singleSelector, false).removeClass("foo", "bar");
        assert.equal($(singleSelector, false).className.indexOf("foo"), -1);
        assert.equal($(singleSelector, false).className.indexOf("bar"), -1);
    });

    Q.test("Element Has Class", function (assert) {
        $(singleSelector, false).addClass("foo");
        assert.ok($(singleSelector, false).hasClass("foo"));
        assert.equal($(singleSelector, false).hasClass("bar"), false);
    });

    // Attribute Methods
    Q.test("Set Element Attribute", function (assert) {
        // One Attribute
        assert.ok($(singleSelector, false).setAttribute("data-foo", "bar") instanceof window.Element);
        assert.equal($(singleSelector, false).attributes.getNamedItem("data-foo").value, "bar");

        // Multiple Attributes
        assert.ok($(singleSelector, false).setAttribute({"data-foo": "bar", "data-baz": "qux"}) instanceof window.Element);
        assert.equal($(singleSelector, false).attributes.getNamedItem("data-foo").value, "bar");
        assert.equal($(singleSelector, false).attributes.getNamedItem("data-baz").value, "qux");
    });

    Q.test("Remove Element Attribute", function (assert) {
        // One Attribute
        $(singleSelector, false).setAttribute("data-foo", "bar");
        assert.ok($(singleSelector, false).removeAttribute("data-foo") instanceof window.Element);
        assert.ok(!$(singleSelector, false).hasAttribute("data-foo"));

        // Multiple Attributes
        $(singleSelector, false).setAttribute({"data-foo": "bar", "data-baz": "qux"});
        assert.ok($(singleSelector, false).removeAttribute("data-foo", "data-baz") instanceof window.Element);
        assert.ok(!$(singleSelector, false).hasAttribute("data-foo"));
        assert.ok(!$(singleSelector, false).hasAttribute("data-baz"));
    });

    // Event Methods
    Q.test("Add Element Event Listener", function (assert) {
        var evt = generateTestEvent();
        assert.ok($(singleSelector, false).addEventListener("test", testListener) instanceof window.Element);
        assert.ok($(singleSelector, false).dispatchEvent(evt));
        assert.equal(dispatchedConfirmationString, evt.detail);
    });

    Q.test("Remove Element Event Listener", function (assert) {
        $(singleSelector, false).addEventListener("test", testListener);
        assert.ok($(singleSelector, false).removeEventListener("test", testListener) instanceof window.Element);
        $(singleSelector, false).dispatchEvent(generateTestEvent());
        assert.strictEqual(dispatchedConfirmationString, null);
    });

    // Property Methods
    Q.test("Set Element Property", function (assert) {
        // One Property
        assert.ok($(singleFormSelector, false).setProperty("title", "quux") instanceof window.Element);
        assert.equal($(singleFormSelector, false).title, "quux");

        assert.ok($(singleFormSelector, false).setProperty("foo", "bar") instanceof window.Element);
        assert.ok(!$(singleFormSelector, false).hasOwnProperty("foo"));

        // Multiple Properties
        cleanSandbox();
        assert.ok($(singleFormSelector, false).setProperty({"title": "quux", "lang": "corge"}) instanceof window.Element);
        assert.equal($(singleFormSelector, false).title, "quux");
        assert.equal($(singleFormSelector, false).lang, "corge");

        assert.ok($(singleFormSelector, false).setProperty({"foo": "bar", "baz": "qux"}) instanceof window.Element);
        assert.ok(!$(singleFormSelector, false).hasOwnProperty("foo"));
        assert.ok(!$(singleFormSelector, false).hasOwnProperty("baz"));
    });

    Q.test("Get Element Property", function (assert) {
        $(singleFormSelector, false).title = "quux";
        assert.equal($(singleFormSelector, false).getProperty("title"), "quux");

        assert.strictEqual($(singleFormSelector, false).getProperty("foo"), undefined);
    });

    Q.test("Element Has Property", function (assert) {
        assert.ok($(singleFormSelector, false).hasProperty("title"));
        assert.ok(!$(singleFormSelector, false).hasProperty("foo"));
    });

    /**
     * NodeList
     */

    Q.test("NodeList forEach", function (assert) {
        var elements = $(multipleSelector),
            index = 0;

        assert.ok($(multipleSelector).forEach(function (element) {
            assert.strictEqual(element, elements[index]);
            index += 1;
        }) instanceof window.NodeList);
    });

    // Class Methods
    Q.test("Add NodeList Class", function (assert) {
        // Single Class
        assert.ok($(multipleSelector).addClass("foo") instanceof window.NodeList);
        $(multipleSelector).forEach(function (element) {
            assert.ok(element.className.indexOf("foo") >= 0);
        });

        // Multiple Classes
        $(multipleSelector).addClass("foo", "bar");
        $(multipleSelector).forEach(function (element) {
            assert.ok(element.className.indexOf("foo") >= 0);
            assert.ok(element.className.indexOf("bar") >= 0);
        });
    });

    Q.test("Remove NodeList Class", function (assert) {
        $(multipleSelector).addClass("foo");
        assert.ok($(multipleSelector).removeClass("foo") instanceof window.NodeList);
        $(multipleSelector).forEach(function (element) {
            assert.equal(element.className.indexOf("foo"), -1);
        });

        $(multipleSelector).addClass("foo", "bar");
        $(multipleSelector).removeClass("foo", "bar");
        $(multipleSelector).forEach(function (element) {
            assert.equal(element.className.indexOf("foo"), -1);
            assert.equal(element.className.indexOf("bar"), -1);
        });
    });

    Q.test("NodeList Has Class", function (assert) {
        assert.equal($(multipleSelector).hasClass("foo"), false);
        $(multipleSelector)[0].addClass("foo");
        assert.ok($(multipleSelector).hasClass("foo"));
        $(multipleSelector).addClass("foo");
        assert.ok($(multipleSelector).hasClass("foo"));
        assert.equal($(multipleSelector).hasClass("bar"), false);
    });

    // Attribute Methods
    Q.test("Set NodeList Attribute", function (assert) {
        // One Attribute
        assert.ok($(multipleSelector).setAttribute("data-foo", "bar") instanceof window.NodeList);
        $(multipleSelector).forEach(function (element) {
            assert.equal(element.getAttribute("data-foo"), "bar");
        });

        // Multiple Attributes
        assert.ok($(multipleSelector).setAttribute({"data-foo": "bar", "data-baz": "qux"}) instanceof window.NodeList);
        $(multipleSelector).forEach(function (element) {
            assert.equal(element.getAttribute("data-foo"), "bar");
            assert.equal(element.getAttribute("data-baz"), "qux");
        });
    });

    Q.test("Remove NodeList Attribute", function (assert) {
        // One Attribute
        $(multipleSelector).setAttribute("data-foo", "bar");
        assert.ok($(multipleSelector).removeAttribute("data-foo", "bar") instanceof window.NodeList);
        $(multipleSelector).forEach(function (element) {
            assert.ok(!element.hasAttribute("data-foo"));
        });

        // Multiple Attributes
        $(multipleSelector).setAttribute({"data-foo": "bar", "data-baz": "qux"});
        assert.ok($(multipleSelector).removeAttribute("data-foo", "data-baz") instanceof window.NodeList);
        $(multipleSelector).forEach(function (element) {
            assert.ok(!element.hasAttribute("data-foo"));
            assert.ok(!element.hasAttribute("data-baz"));
        });
    });

    Q.test("NodeList Has Attribute", function (assert) {
        assert.ok(!$(multipleSelector).hasAttribute("data-foo"));
        $(multipleSelector)[0].setAttribute("data-foo", "bar");
        assert.ok($(multipleSelector).hasAttribute("data-foo"));
        $(multipleSelector).setAttribute("data-foo", "bar");
        assert.ok($(multipleSelector).hasAttribute("data-foo"));
        assert.ok(!$(multipleSelector).hasAttribute("data-baz"));
    });

    Q.test("Get NodeList Attribute", function (assert) {
        $(multipleSelector)[0].setAttribute("data-foo", "bar");
        assert.equal($(multipleSelector).getAttribute("data-foo"), "bar");
    });

    // Event Methods
    Q.test("Add NodeList Event Listener", function (assert) {
        var evt;
        assert.ok($(multipleSelector).addEventListener("test", testListener) instanceof window.NodeList);

        $(multipleSelector).forEach(function (element) {
            evt = generateTestEvent();
            assert.ok(element.dispatchEvent(evt));
            assert.equal(dispatchedConfirmationString, evt.detail);
        });
    });

    Q.test("Remove NodeList Event Listener", function (assert) {
        $(multipleSelector).addEventListener("test", testListener);
        assert.ok($(multipleSelector).removeEventListener("test", testListener) instanceof window.NodeList);

        $(multipleSelector).forEach(function (element) {
            element.dispatchEvent(generateTestEvent());
            assert.strictEqual(dispatchedConfirmationString, null);
        });
    });

    // Property Methods
    Q.test("Set NodeList Property", function (assert) {
        // One Property
        assert.ok($(multipleFormSelector).setProperty("title", "quux") instanceof window.NodeList);
        $(multipleFormSelector).forEach(function (element) {
            assert.equal(element.title, "quux");
        });

        assert.ok($(multipleFormSelector).setProperty("foo", "bar") instanceof window.NodeList);
        $(multipleFormSelector).forEach(function (element) {
            assert.ok(!element.hasOwnProperty("foo"));
        });

        // Multiple Properties
        cleanSandbox();
        assert.ok($(multipleFormSelector).setProperty({"title": "quux", "lang": "corge"}) instanceof window.NodeList);
        $(multipleFormSelector).forEach(function (element) {
            assert.equal(element.title, "quux");
            assert.equal(element.lang, "corge");
        });

        assert.ok($(multipleFormSelector).setProperty({"foo": "bar", "baz": "qux"}) instanceof window.NodeList);
        $(multipleFormSelector).forEach(function (element) {
            assert.ok(!element.hasOwnProperty("foo"));
            assert.ok(!element.hasOwnProperty("baz"));
        });
    });

    Q.test("Get NodeList Property", function (assert) {
        $(multipleFormSelector)[0].title = "quux";
        assert.equal($(multipleFormSelector).getProperty("title"), "quux");
        assert.strictEqual($(multipleFormSelector).getProperty("foo"), undefined);
    });

    Q.test("NodeList Has Property", function (assert) {
        assert.ok($(multipleFormSelector).hasProperty("title"));
        assert.ok(!$(multipleFormSelector).hasProperty("foo"));
    });

}(window.QUnit));