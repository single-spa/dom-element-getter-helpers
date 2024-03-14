import { AppProps } from "single-spa";

type AllProps<ExtraProps = {}> = AppProps &
  ExtraProps & {
    domElement?: HTMLElement | ShadowRoot;
    domElementGetter?(): HTMLElement | ShadowRoot;
    // Old versions of single-spa had an appName prop
    appName?: string;
  };

interface HelperOpts {
  domElementGetter?(): HTMLElement | ShadowRoot;
}

export function chooseDomElementGetter<ExtraProps = {}>(
  opts: HelperOpts,
  props: AllProps<ExtraProps>
): () => HTMLElement | ShadowRoot {
  let domElementGetter;

  if (props.domElement) {
    domElementGetter = () => props.domElement;
  } else if (props.domElementGetter) {
    domElementGetter = props.domElementGetter;
  } else if (opts.domElementGetter) {
    domElementGetter = opts.domElementGetter;
  } else {
    domElementGetter = defaultDomElementGetter<ExtraProps>(props);
  }

  if (typeof domElementGetter !== "function") {
    throw Error(
      `single-spa's dom-element-getter-helpers was given an invalid domElementGetter for application or parcel '${
        props.name
      }'. Expected a function, received ${typeof domElementGetter}`
    );
  }

  return () => {
    const domElement = domElementGetter(props);

    if (!(domElement instanceof HTMLElement || domElement instanceof ShadowRoot)) {
      throw Error(
        `single-spa's dom-element-getter-helpers: domElementGetter returned an invalid dom element for application or parcel '${
          props.name
        }'. Expected HTMLElement or ShadowRoot, received ${typeof domElement}`
      );
    }

    return domElement;
  };
}

function defaultDomElementGetter<ExtraProps>(
  props: AllProps<ExtraProps>
): () => HTMLElement | ShadowRoot {
  const appName = props.appName || props.name;
  if (!appName) {
    throw Error(
      `single-spa's dom-element-getter-helpers was not given an application name as a prop, so it can't make a unique dom element container for the react application`
    );
  }
  const htmlId = `single-spa-application:${appName}`;

  return function defaultDomEl() {
    let domElement = document.getElementById(htmlId);
    if (!domElement) {
      domElement = document.createElement("div");
      domElement.id = htmlId;
      document.body.appendChild(domElement);
    }

    return domElement;
  };
}
