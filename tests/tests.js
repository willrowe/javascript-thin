var fixture = require('./fixture.html'),
    originalKarmaStart = window.__karma__.start,
    DOMContentLoadedTestResult,
    WindowLoadedTestResult;


// Prevent karma from starting right away
window.__karma__.start = function () {};

// Attach listeners so they can be tested
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

// Start karma once everything has been loaded
window.addEventListener("load", function () {
    window.__karma__.start = originalKarmaStart;
    window.__karma__.start();
});


describe('Thin', function () {
    var singleSelector = ".menu",
        singleSelectorAlt = ".menu-alt",
        multipleSelector = ".menu-item",
        multipleSelectorAlt = ".menu-item-alt",
        nestedSelector = ".sub-menu-item",
        singleFormSelector = "form input[type=checkbox][name=checkbox1]",
        multipleFormSelector = "form input[type=checkbox]",
        dispatchedConfirmationString;

    beforeEach(function () {
        document.body.innerHTML = fixture;
        dispatchedConfirmationString = null;
    });

    function $(selector, multiple) {
        multiple = (multiple === null || multiple === undefined) ? true : multiple;

        if (multiple) {
            return document.querySelectorAll(selector);
        }

        return document.querySelector(selector);
    }

    function generateTestEvent() {
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent("test", true, true, Math.random().toString(36).substring(7));

        return evt;
    }

    function testListener(evt) {
        dispatchedConfirmationString = evt.detail;
    }

    /*
        Tests
     */
    it('should be registered in the global `window` object', function () {
        expect(window.Thin).toBeDefined();
    });

    it('should return an instance of `NodeList`', function () {
        var i,
            thinList,
            nativeList;

        expect(window.Thin(singleSelector) instanceof window.NodeList).toBe(true);
        expect(window.Thin(singleSelector)[0]).toBe(document.querySelectorAll(singleSelector)[0]);

        thinList = window.Thin(multipleSelector);
        nativeList = document.querySelectorAll(multipleSelector);
        expect(thinList instanceof window.NodeList).toBe(true);
        for (i = 0; i < thinList.length; i += 1) {
            expect(thinList[i]).toBe(nativeList[i]);
        }
    });

    it("should bind to DOMContentLoaded event", function () {
        expect(DOMContentLoadedTestResult.thisObj).toBe(document);
        expect(DOMContentLoadedTestResult.state).toEqual("interactive");
        expect(DOMContentLoadedTestResult.eventObj.type).toEqual("DOMContentLoaded");
    });

    it("should bind to the window load event", function () {
        expect(WindowLoadedTestResult.thisObj).toBe(window);
        expect(WindowLoadedTestResult.state).toEqual("complete");
        expect(WindowLoadedTestResult.eventObj.type).toEqual("load");
    });

    it("should convert `Element` and `NodeList` objects to a single `NodeList`", function () {
        var nodeList = document.querySelectorAll(multipleSelector),
            nodeListAlt = document.querySelectorAll(multipleSelectorAlt),
            element = document.querySelector(singleSelector),
            elementAlt = document.querySelector(singleSelectorAlt);

        // Single NodeList
        expect(window.Thin(nodeList) instanceof window.NodeList).toBe(true);

        // Multiple NodeLists
        expect(window.Thin(nodeList, nodeListAlt) instanceof window.NodeList).toBe(true);

        // Single Element
        expect(window.Thin(element) instanceof window.NodeList).toBe(true);

        // Multiple Elements
        expect(window.Thin(element, elementAlt) instanceof window.NodeList).toBe(true);

        // Multiple Mixed
        expect(window.Thin(element, nodeListAlt, nodeList, elementAlt) instanceof window.NodeList).toBe(true);
    });

    it("should add classes to an `Element`", function () {
        // One Class
        expect($(singleSelector, false).addClass("foo") instanceof window.Element).toBe(true);
        expect($(singleSelector, false).className.indexOf("foo") >= 0).toBe(true);

        // Multiple Classes
        expect($(singleSelector, false).addClass("foo", "bar") instanceof window.Element).toBe(true);
        expect($(singleSelector, false).className.indexOf("foo") >= 0).toBe(true);
        expect($(singleSelector, false).className.indexOf("bar") >= 0).toBe(true);
    });

    it("should remove classes from an `Element`", function () {
        // One Class
        $(singleSelector, false).addClass("foo");
        expect($(singleSelector, false).removeClass("foo") instanceof window.Element).toBe(true);
        expect($(singleSelector, false).className.indexOf("foo")).toEqual(-1);

        // Multiple Classes
        $(singleSelector, false).addClass("foo", "bar");
        $(singleSelector, false).removeClass("foo", "bar");
        expect($(singleSelector, false).className.indexOf("foo")).toEqual(-1);
        expect($(singleSelector, false).className.indexOf("bar")).toEqual(-1);
    });

    it("should detect if an `Element` has a class", function () {
        $(singleSelector, false).addClass("foo");
        expect($(singleSelector, false).hasClass("foo")).toBe(true);
        expect($(singleSelector, false).hasClass("bar")).toBe(false);
    });

    it("should set `Element` attributes", function () {
        // One Attribute
        expect($(singleSelector, false).setAttribute("data-foo", "bar") instanceof window.Element).toBe(true);
        expect($(singleSelector, false).attributes.getNamedItem("data-foo").value).toEqual("bar");

        // Multiple Attributes
        expect($(singleSelector, false).setAttribute({"data-foo": "bar", "data-baz": "qux"}) instanceof window.Element).toBe(true);
        expect($(singleSelector, false).attributes.getNamedItem("data-foo").value).toEqual("bar");
        expect($(singleSelector, false).attributes.getNamedItem("data-baz").value).toEqual("qux");
    });

    it("should remove `Element` attributes", function () {
        // One Attribute
        $(singleSelector, false).setAttribute("data-foo", "bar");
        expect($(singleSelector, false).removeAttribute("data-foo") instanceof window.Element).toBe(true);
        expect(!$(singleSelector, false).hasAttribute("data-foo")).toBe(true);

        // Multiple Attributes
        $(singleSelector, false).setAttribute({"data-foo": "bar", "data-baz": "qux"});
        expect($(singleSelector, false).removeAttribute("data-foo", "data-baz") instanceof window.Element).toBe(true);
        expect(!$(singleSelector, false).hasAttribute("data-foo")).toBe(true);
        expect(!$(singleSelector, false).hasAttribute("data-baz")).toBe(true);
    });

    it("should add an event listener to an `Element`", function () {
        var evt = generateTestEvent();
        expect($(singleSelector, false).addEventListener("test", testListener) instanceof window.Element).toBe(true);
        expect($(singleSelector, false).dispatchEvent(evt)).toBe(true);
        expect(dispatchedConfirmationString).toEqual(evt.detail);
    });

    it("should remove an event listener from an `Element`", function () {
        $(singleSelector, false).addEventListener("test", testListener);
        expect($(singleSelector, false).removeEventListener("test", testListener) instanceof window.Element).toBe(true);
        $(singleSelector, false).dispatchEvent(generateTestEvent());
        expect(dispatchedConfirmationString).toBe(null);
    });

    it("should set a single property on an `Element`", function () {
        // One Property
        expect($(singleFormSelector, false).setProperty("title", "quux") instanceof window.Element).toBe(true);
        expect($(singleFormSelector, false).title).toEqual("quux");

        expect($(singleFormSelector, false).setProperty("foo", "bar") instanceof window.Element);
        expect(!$(singleFormSelector, false).hasOwnProperty("foo"));
    });

    it("should set multiple properties on an `Element`", function () {
        // Multiple Properties
        expect($(singleFormSelector, false).setProperty({"title": "quux", "lang": "corge"}) instanceof window.Element);
        expect($(singleFormSelector, false).title).toEqual("quux");
        expect($(singleFormSelector, false).lang).toEqual("corge");

        expect($(singleFormSelector, false).setProperty({"foo": "bar", "baz": "qux"}) instanceof window.Element).toBe(true);
        expect(!$(singleFormSelector, false).hasOwnProperty("foo")).toBe(true);
        expect(!$(singleFormSelector, false).hasOwnProperty("baz")).toBe(true);
    });

    it("should return the value of a property on an `Element`", function () {
        $(singleFormSelector, false).title = "quux";
        expect($(singleFormSelector, false).getProperty("title")).toEqual("quux");

        expect($(singleFormSelector, false).getProperty("foo")).toBe(undefined);
    });

    it("should detect if an `Element` has property", function () {
        expect($(singleFormSelector, false).hasProperty("title")).toBe(true);
        expect(!$(singleFormSelector, false).hasProperty("foo")).toBe(true);
    });

    it("should apply a function to each `Element` in a `NodeList`", function () {
        var elements = $(multipleSelector),
            index = 0;

        expect($(multipleSelector).forEach(function (element) {
            expect(element).toBe(elements[index]);
            index += 1;
        }) instanceof window.NodeList).toBe(true);
    });

    it("should add classes to each `Element` in a `NodeList`", function () {
        // Single Class
        expect($(multipleSelector).addClass("foo") instanceof window.NodeList).toBe(true);
        $(multipleSelector).forEach(function (element) {
            expect(element.className.indexOf("foo") >= 0).toBe(true);
        });

        // Multiple Classes
        $(multipleSelector).addClass("foo", "bar");
        $(multipleSelector).forEach(function (element) {
            expect(element.className.indexOf("foo") >= 0).toBe(true);
            expect(element.className.indexOf("bar") >= 0).toBe(true);
        });
    });

    it("should remove classes from each `Element` in a `NodeList`", function () {
        $(multipleSelector).addClass("foo");
        expect($(multipleSelector).removeClass("foo") instanceof window.NodeList).toBe(true);
        $(multipleSelector).forEach(function (element) {
            expect(element.className.indexOf("foo")).toEqual(-1);
        });

        $(multipleSelector).addClass("foo", "bar");
        $(multipleSelector).removeClass("foo", "bar");
        $(multipleSelector).forEach(function (element) {
            expect(element.className.indexOf("foo")).toEqual(-1);
            expect(element.className.indexOf("bar")).toEqual(-1);
        });
    });

    it("should detect if the first `Element` in a `NodeList` has a class", function () {
        expect($(multipleSelector).hasClass("foo")).toBe(false);
        $(multipleSelector)[0].addClass("foo");
        expect($(multipleSelector).hasClass("foo")).toBe(true);
        $(multipleSelector).addClass("foo");
        expect($(multipleSelector).hasClass("foo")).toBe(true);
        expect($(multipleSelector).hasClass("bar")).toBe(false);
    });

    it("should set attributes on each `Element` in a `NodeList`", function () {
        // One Attribute
        expect($(multipleSelector).setAttribute("data-foo", "bar") instanceof window.NodeList).toBe(true);
        $(multipleSelector).forEach(function (element) {
            expect(element.getAttribute("data-foo")).toEqual("bar");
        });

        // Multiple Attributes
        expect($(multipleSelector).setAttribute({"data-foo": "bar", "data-baz": "qux"}) instanceof window.NodeList).toBe(true);
        $(multipleSelector).forEach(function (element) {
            expect(element.getAttribute("data-foo")).toEqual("bar");
            expect(element.getAttribute("data-baz")).toEqual("qux");
        });
    });

    it("should remove attributes from each `Element` in a `NodeList`", function () {
        // One Attribute
        $(multipleSelector).setAttribute("data-foo", "bar");
        expect($(multipleSelector).removeAttribute("data-foo", "bar") instanceof window.NodeList).toBe(true);
        $(multipleSelector).forEach(function (element) {
            expect(!element.hasAttribute("data-foo")).toBe(true);
        });

        // Multiple Attributes
        $(multipleSelector).setAttribute({"data-foo": "bar", "data-baz": "qux"});
        expect($(multipleSelector).removeAttribute("data-foo", "data-baz") instanceof window.NodeList).toBe(true);
        $(multipleSelector).forEach(function (element) {
            expect(!element.hasAttribute("data-foo")).toBe(true);
            expect(!element.hasAttribute("data-baz")).toBe(true);
        });
    });

    it("should detect if the first `Element` in a `NodeList` has attributes", function () {
        expect(!$(multipleSelector).hasAttribute("data-foo")).toBe(true);
        $(multipleSelector)[0].setAttribute("data-foo", "bar");
        expect($(multipleSelector).hasAttribute("data-foo")).toBe(true);
        $(multipleSelector).setAttribute("data-foo", "bar");
        expect($(multipleSelector).hasAttribute("data-foo")).toBe(true);
        expect(!$(multipleSelector).hasAttribute("data-baz")).toBe(true);
    });

    it("should get an attribute from the first `Element` in a `NodeList`", function () {
        $(multipleSelector)[0].setAttribute("data-foo", "bar");
        expect($(multipleSelector).getAttribute("data-foo")).toEqual("bar");
    });

    it("should add an event listener to each `Element` in a `NodeList`", function () {
        var evt;
        expect($(multipleSelector).addEventListener("test", testListener) instanceof window.NodeList).toBe(true);

        $(multipleSelector).forEach(function (element) {
            evt = generateTestEvent();
            expect(element.dispatchEvent(evt)).toBe(true);
            expect(dispatchedConfirmationString).toEqual(evt.detail);
        });
    });

    it("should remove an event listener from each `Element` in a `NodeList`", function () {
        $(multipleSelector).addEventListener("test", testListener);
        expect($(multipleSelector).removeEventListener("test", testListener) instanceof window.NodeList).toBe(true);

        $(multipleSelector).forEach(function (element) {
            element.dispatchEvent(generateTestEvent());
            expect(dispatchedConfirmationString).toBe(null);
        });
    });

    it("should set a single property on each `Element` in a `NodeList`", function () {
        // One Property
        expect($(multipleFormSelector).setProperty("title", "quux") instanceof window.NodeList).toBe(true);
        $(multipleFormSelector).forEach(function (element) {
            expect(element.title).toEqual("quux");
        });

        expect($(multipleFormSelector).setProperty("foo", "bar") instanceof window.NodeList).toBe(true);
        $(multipleFormSelector).forEach(function (element) {
            expect(!element.hasOwnProperty("foo")).toBe(true);
        });
    });

    it("should set multiple properties on each `Element` in a `NodeList`", function () {
        // Multiple Properties
        expect($(multipleFormSelector).setProperty({"title": "quux", "lang": "corge"}) instanceof window.NodeList).toBe(true);
        $(multipleFormSelector).forEach(function (element) {
            expect(element.title).toEqual("quux");
            expect(element.lang).toEqual("corge");
        });

        expect($(multipleFormSelector).setProperty({"foo": "bar", "baz": "qux"}) instanceof window.NodeList).toBe(true);
        $(multipleFormSelector).forEach(function (element) {
            expect(!element.hasOwnProperty("foo")).toBe(true);
            expect(!element.hasOwnProperty("baz")).toBe(true);
        });
    });

    it("should get properties from the first `Element` in a `NodeList`", function () {
        $(multipleFormSelector)[0].title = "quux";
        expect($(multipleFormSelector).getProperty("title")).toEqual("quux");
        expect($(multipleFormSelector).getProperty("foo")).toBe(undefined);
    });

    it("should detect if the first `Element` in a NodeList has a property", function () {
        expect($(multipleFormSelector).hasProperty("title")).toBe(true);
        expect($(multipleFormSelector).hasProperty("foo")).toBe(false);
    });

    it("should return a single `Element` if `querySelector` is called on a `NodeList`", function () {
        expect($(multipleSelector).querySelector(nestedSelector)).toBe($(nestedSelector)[0]);
    });

    it("should return a `NodeList` if `querySelectorAll` is called on a `NodeList`", function () {
        var subResults = $(multipleSelector).querySelectorAll(nestedSelector),
            globResults = $(nestedSelector),
            i;

        expect(subResults.length).toEqual(globResults.length);
        for (i = 0; i < subResults.length; i += 1) {
            expect(subResults[i]).toBe(globResults[i]);
        }
    });
});
