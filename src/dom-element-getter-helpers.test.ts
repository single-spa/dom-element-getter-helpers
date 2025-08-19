import { chooseDomElementGetter } from "./dom-element-getter-helpers";

describe("dom-element-getter-helpers", () => {
  let opts, props;

  beforeEach(() => {
    opts = {};
    props = {
      name: "test",
    };
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("creates a default dom element if no opts or props are provided", () => {
    const domElementGetter = chooseDomElementGetter(opts, props);
    expect(document.getElementById("single-spa-application:test")).toBe(null);
    const domElement = domElementGetter();
    expect(document.getElementById("single-spa-application:test")).toBe(
      domElement,
    );
    expect(domElement.parentNode).toBe(document.body);
  });

  it("uses props.domElement if provided", () => {
    props.domElement = document.createElement("div");
    props.domElementGetter = () => document.createElement("div");
    opts.domElement = document.createElement("div");
    opts.domElementGetter = () => document.createElement("div");

    const domElementGetter = chooseDomElementGetter(opts, props);
    expect(document.getElementById("single-spa-application:test")).toBe(null);
    const domElement = domElementGetter();
    expect(document.getElementById("single-spa-application:test")).toBe(null);
    expect(props.domElement).toBe(domElement);
    expect(domElement.parentNode).toBe(null);
  });

  it("uses props.domElementGetter if props.domElement is not provided", () => {
    const el = document.createElement("div");
    props.domElementGetter = () => el;
    opts.domElement = document.createElement("div");
    opts.domElementGetter = () => document.createElement("div");

    const domElementGetter = chooseDomElementGetter(opts, props);
    expect(document.getElementById("single-spa-application:test")).toBe(null);
    const domElement = domElementGetter();
    expect(document.getElementById("single-spa-application:test")).toBe(null);
    expect(domElement).toBe(el);
    expect(el.parentNode).toBe(null);
  });

  it("uses opts.domElementGetter if neither props.domElement or props.domElementGetter is provided", () => {
    const el = document.createElement("div");
    opts.domElement = document.createElement("div");
    opts.domElementGetter = () => el;

    const domElementGetter = chooseDomElementGetter(opts, props);
    expect(document.getElementById("single-spa-application:test")).toBe(null);
    const domElement = domElementGetter();
    expect(document.getElementById("single-spa-application:test")).toBe(null);
    expect(domElement).toBe(el);
    expect(el.parentNode).toBe(null);
  });

  it("throws if using default dom element getter and no name is provided", () => {
    delete props.name;
    expect(() => chooseDomElementGetter(opts, props)).toThrow(
      /was not given an application name/,
    );
  });

  it("throws if the domElementGetter is not a function", () => {
    props.domElementGetter = "asdfsad";
    expect(() => chooseDomElementGetter(opts, props)).toThrow(
      /an invalid domElementGetter/,
    );
  });

  it("throws if the domElementGetter function returns something that's not an HTMLElement", () => {
    props.domElementGetter = () => "asdfsad";
    const domElementGetter = chooseDomElementGetter(opts, props);
    expect(domElementGetter).toThrow(/returned an invalid dom element/);
  });

  it("passes props to opts.domElementGetter", () => {
    opts.domElementGetter = jest
      .fn()
      .mockImplementation(() => document.createElement("div"));
    chooseDomElementGetter(opts, props)();
    expect(opts.domElementGetter).toHaveBeenCalledWith(props);
  });

  it("passes props to props.domElementGetter", () => {
    props.domElementGetter = jest
      .fn()
      .mockImplementation(() => document.createElement("div"));
    chooseDomElementGetter(opts, props)();
    expect(props.domElementGetter).toHaveBeenCalledWith(props);
  });

  it("adds domElementGetterHelpers property to created dom elements", () => {
    const domElement = chooseDomElementGetter(opts, props)();
    expect(domElement.domElementGetterHelpers).toBe(true);
  });
});
