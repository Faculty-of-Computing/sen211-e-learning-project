// @ts-check

import { saveStudent } from "./firebase.js";

window.addEventListener("load", () => {
  // @ts-ignore
  lucide.createIcons();

  /** @type {HTMLFormElement} */
  const form = document["auth-form"];
  form.onsubmit = (e) => {
    e.preventDefault();
    const regNumberPattern = /^\d{2}\/[A-Za-z]{2}\/[A-Za-z]{2}\/\d{3,4}$/;
    const regNo = form["reg"].value.trim();
    if (!regNumberPattern.test(regNo)) {
      return toast("Invalid registration number");
    }
    disableFields();
    saveStudent({
      regNo,
      firstName: form["first-name"].value,
      lastName: form["last-name"].value,
    })
      .then(() => (location.href = "/"))
      .catch((err) => {
        toast(err instanceof Error ? err.message : "An unknown error occured");
        enableFields();
      });
  };
});

function disableFields() {
  document.querySelectorAll("fieldset, button").forEach((element) => {
    if (
      element instanceof HTMLFieldSetElement ||
      element instanceof HTMLButtonElement
    )
      element.disabled = true;
  });
}

function enableFields() {
  document.querySelectorAll("fieldset, button").forEach((element) => {
    if (
      element instanceof HTMLFieldSetElement ||
      element instanceof HTMLButtonElement
    )
      element.disabled = false;
  });
}

/** @param {string} msg */
function toast(msg) {
  // @ts-ignore
  return vanillaToast.show(msg, {
    duration: 2500,
    fadeDuration: 500,
    className: "auth",
  });
}
