import { AppProps } from "single-spa";

type AllProps<ExtraProps = {}> = AppProps &
  ExtraProps & {
    domElement?: HTMLElement;
    domElementGetter?(): HTMLElement;
    // Old versions of single-spa had an appName prop
    appName?: string;
  };

interface HelperOpts {
  domElementGetter?(): HTMLElement;
}

export function chooseDomElementGetter<ExtraProps = {}>(
  opts: HelperOpts,
  props: AllProps<ExtraProps>
): () => HTMLElement {
  if (props.domElement) {
    return () => props.domElement;
  } else if (props.domElementGetter) {
    return props.domElementGetter;
  } else if (opts.domElementGetter) {
    return opts.domElementGetter;
  } else {
    return defaultDomElementGetter<ExtraProps>(props);
  }
}

function defaultDomElementGetter<ExtraProps>(
  props: AllProps<ExtraProps>
): () => HTMLElement {
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
