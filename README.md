# dom-element-getter-helpers

An npm package used internally by single-spa framework helpers to determine where to mount a single-spa application or parcel.

## Installation

```sh
npm install --save dom-element-getter-helpers

yarn add --dev dom-element-getter-helpers

pnpm install --save-dev dom-element-getter-helpers
```

## Usage

### chooseDomElementGetter(opts, props)

This accepts an options object and the single-spa props for an application or parcel. The options object can have a `domElementGetter` property on it. The props can have a `domElement` or `domElementGetter` property on it. If none of those properties are provided, a default dom element getter is used, which creates a div that is appended to `<body>`.

This function returns a function that returns an HTMLElement container for the single-spa application or parcel. Note that the single-spa props will automatically be passed to the domElementGetter function.

```js
import { chooseDomElementGetter } from "dom-element-getter-helpers";

const opts = {
  domElementGetter() {
    return document.getElementById("1");
  },
};

const props = {
  domElement: document.getElementById("2"),
  domElementGetter: document.getElementById("3"),
};

const domElementGetter = chooseDomElementGetter(opts, props);
const domElement = domElementGetter();
```
