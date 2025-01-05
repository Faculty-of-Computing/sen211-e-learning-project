import { studentDataIsSaved } from "./firebase.js";

export function disableFields() {
  document.querySelectorAll("fieldset, button").forEach((element) => {
    element.disabled = true;
  });
}

export function enableFields() {
  document.querySelectorAll("fieldset, button").forEach((element) => {
    element.disabled = false;
  });
}

/** @type {string} */
export function toast(msg) {
  return vanillaToast.show(msg, {
    duration: 2500,
    fadeDuration: 500,
    className: "auth",
  });
}

/**  @param {unknown} err */
export function handleError(err) {
  toast(err instanceof Error ? err.message : "An unknown error occured!");
  enableFields();
}
