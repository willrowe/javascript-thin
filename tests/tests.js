(function (Q) {
    "use strict";

    var singleSelector = ".menu",
        multipleSelector = ".menu-item",
        sandboxSelector = "#sandbox",
        originalSandboxNode,
        dispatchedConfirmationString;

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
        var evt = new window.Event("test");
        evt.confirmationString = Math.random().toString(36).substring(7);

        return evt;
    }

    function testListener(evt) {
        dispatchedConfirmationString = evt.confirmationString;
    }

    document.addEventListener("DOMContentLoaded", function () {
        originalSandboxNode = document.querySelector(sandboxSelector).cloneNode(true);
    });

    Q.testStart(function () {
        cleanSandbox();
        dispatchedConfirmationString = null;
    });

    // Element
    Q.test("Add Element Class Test", function (assert) {
        // One Class
        assert.ok($(singleSelector, false).addClass("foo") instanceof window.Element);
        assert.ok($(singleSelector, false).className.indexOf("foo") >= 0);

        // Multiple Classes
        assert.ok($(singleSelector, false).addClass("foo", "bar") instanceof window.Element);
        assert.ok($(singleSelector, false).className.indexOf("foo") >= 0);
        assert.ok($(singleSelector, false).className.indexOf("bar") >= 0);
    });

    Q.test("Remove Element Class Test", function (assert) {
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

    Q.test("Element Has Class Test", function (assert) {
        $(singleSelector, false).addClass("foo");
        assert.ok($(singleSelector, false).hasClass("foo"));
        assert.equal($(singleSelector, false).hasClass("bar"), false);
    });

    Q.test("Add Element Event Listener Test", function (assert) {
        var evt = generateTestEvent();
        assert.ok($(singleSelector, false).addEventListener("test", testListener) instanceof window.Element);
        assert.ok($(singleSelector, false).dispatchEvent(evt));
        assert.equal(dispatchedConfirmationString, evt.confirmationString);
    });

    Q.test("Remove Element Event Listener Test", function (assert) {
        $(singleSelector, false).addEventListener("test", testListener);
        assert.ok($(singleSelector, false).removeEventListener("test", testListener) instanceof window.Element);
        $(singleSelector, false).dispatchEvent(generateTestEvent());
        assert.strictEqual(dispatchedConfirmationString, null);
    });

    // NodeList
    Q.test("NodeList forEach Test", function (assert) {
        var elements = $(multipleSelector),
            index = 0;

        $(multipleSelector).forEach(function (element) {
            assert.strictEqual(element, elements[index]);
            index += 1;
        });
    });

    Q.test("Add NodeList Class Test", function (assert) {
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

    Q.test("Remove NodeList Class Test", function (assert) {
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

    Q.test("NodeList Has Class Test", function (assert) {
        assert.equal($(multipleSelector).hasClass("foo"), false);
        $(multipleSelector)[0].addClass("foo");
        assert.ok($(multipleSelector).hasClass("foo"));
        $(multipleSelector).addClass("foo");
        assert.ok($(multipleSelector).hasClass("foo"));
        assert.equal($(multipleSelector).hasClass("bar"), false);
    });

    Q.test("Add NodeList Event Listener Test", function (assert) {
        var evt;
        assert.ok($(multipleSelector).addEventListener("test", testListener) instanceof window.NodeList);

        $(multipleSelector).forEach(function (element) {
            evt = generateTestEvent();
            assert.ok(element.dispatchEvent(evt));
            assert.equal(dispatchedConfirmationString, evt.confirmationString);
        });
    });

    Q.test("Remove NodeList Event Listener Test", function (assert) {
        $(multipleSelector).addEventListener("test", testListener);
        assert.ok($(multipleSelector).removeEventListener("test", testListener) instanceof window.NodeList);

        $(multipleSelector).forEach(function (element) {
            element.dispatchEvent(generateTestEvent());
            assert.strictEqual(dispatchedConfirmationString, null);
        });
    });
}(window.QUnit));