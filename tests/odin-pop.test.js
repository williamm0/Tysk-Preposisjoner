const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function makeElement(tagName, document) {
  const element = {
    tagName: tagName.toUpperCase(),
    children: [],
    attributes: {},
    style: {},
    className: "",
    events: {},
    value: "",
    classList: { add() {}, remove() {}, toggle() { return false; } },
    set id(value) {
      this.attributes.id = value;
      document._byId[value] = this;
    },
    get id() { return this.attributes.id; },
    set innerHTML(value) {
      this._innerHTML = value;
      for (const match of value.matchAll(/id="([^"]+)"/g)) {
        const child = makeElement(match[1] === "sticky-body" ? "textarea" : "div", document);
        child.id = match[1];
        this.appendChild(child);
      }
    },
    get innerHTML() { return this._innerHTML || ""; },
    set src(value) { this.attributes.src = value; },
    get src() { return this.attributes.src; },
    set alt(value) { this.attributes.alt = value; },
    get alt() { return this.attributes.alt; },
    set cssText(value) { this.style.cssText = value; },
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
    appendChild(child) {
      this.children.push(child);
      return child;
    },
    addEventListener(type, handler) {
      this.events[type] = handler;
    },
    remove() {
      const index = document.body.children.indexOf(this);
      if (index >= 0) document.body.children.splice(index, 1);
    },
  };
  return element;
}

function loadMain() {
  const document = {
    _byId: {},
    documentElement: { setAttribute() {}, getAttribute() { return "light"; } },
    body: {
      children: [],
      appendChild(child) {
        this.children.push(child);
        return child;
      },
      prepend(child) {
        this.children.unshift(child);
        return child;
      },
    },
    createElement(tagName) {
      return makeElement(tagName, document);
    },
    getElementById(id) { return this._byId[id] || null; },
    addEventListener() {},
  };

  const context = {
    console,
    document,
    localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
    location: { pathname: "/index.html" },
    Math,
    RegExp,
    setTimeout,
    clearTimeout,
    window: { matchMedia() { return { addEventListener() {} }; } },
  };
  vm.createContext(context);
  const source = fs.readFileSync(path.join(__dirname, "..", "js", "main.js"), "utf8");
  vm.runInContext(source, context);
  return context;
}

test("launchOdinPop appends multiple odin images", () => {
  const context = loadMain();

  context.launchOdinPop();

  const images = context.document.body.children.filter(child => child.tagName === "IMG");
  assert.equal(images.length, 24);
  assert.ok(images.every(image => image.src === "image-odin.png"));
  assert.ok(images.every(image => image.className === "odin-pop"));
});

test("launchOdinPop uses large image sizes", () => {
  const context = loadMain();

  context.launchOdinPop();

  const widths = context.document.body.children
    .filter(child => child.tagName === "IMG")
    .map(image => Number(image.style.cssText.match(/width:([\d.]+)px/)?.[1]));
  assert.ok(widths.every(width => width >= 180), `expected all widths to be at least 180px: ${widths.join(", ")}`);
});

test("typing odin in the sticky note triggers odin images once", () => {
  const context = loadMain();
  context.injectStickyNote();
  const stickyBody = context.document.getElementById("sticky-body");

  stickyBody.value = "odin";
  stickyBody.events.input();

  const images = context.document.body.children.filter(child => child.tagName === "IMG");
  assert.equal(images.length, 24);
});
