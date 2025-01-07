// @ts-check

/**
 * @param {HTMLElement} element
 * @param {CSSStyleDeclaration} styles
 */
export function pairCSS(element, styles) {
  for (const [key, value] of Object.entries(styles)) {
    // @ts-expect-error ...
    element.style[key] = value;
  }
}

/** @param {string} url  */
export function parseMetaUrl(url) {
  const urlObj = new URL(url);
  return {
    moduleNumber: +(/** @type {string} */ (urlObj.searchParams.get("mod"))),
    jsonUrl: /** @type {string} */ (urlObj.searchParams.get("json")),
    loadingMsg: urlObj.searchParams.get("load-msg") || "Please wait",
    course: /** @type {string} */ (urlObj.searchParams.get("course")),
  };
}

/** @param {string} name  */
export function createElement(name) {
  // @ts-expect-error ...
  const tagName = name.match(/^[a-zA-Z0-9]+/g)[0];
  const id = name.match(/#[^.]+/g);
  const classNames = name.match(/\.[^.]+/g);
  const element = document.createElement(tagName);
  if (id) element.id = id[0].slice(1);
  if (classNames)
    element.classList.add(...classNames.map((name) => name.slice(1)));
  return element;
}
