// @ts-check

import { googleAuth, signUp } from "./firebase.js";
import { disableFields, handleError, toast } from "./utils.auth.js";

window.addEventListener("load", () => {
  // @ts-expect-error ...
  // eslint-disable-next-line no-undef
  lucide.createIcons();

  const googleBtn = document.querySelector("#google-auth");
  // @ts-expect-error ...
  googleBtn.onclick = () => {
    disableFields();
    googleAuth()
      .then(() => {
        location.href = "/auth/auth.html";
      })
      .catch(handleError);
  };

  /** @type {HTMLFormElement} */
  const registerForm = document["register-form"];
  registerForm.onsubmit = (e) => {
    e.preventDefault();
    if (
      registerForm.password.value !== registerForm["confirm-password"].value
    ) {
      return toast("Passwords don't match");
    }
    disableFields();
    signUp(registerForm.email.value, registerForm.password.value)
      .then(() => {
        location.href = "/auth/auth.html";
      })
      .catch(handleError);
  };

  // reveal password
  document.querySelectorAll("[data-lucide=eye]").forEach((element) => {
    // @ts-expect-error ...
    element.onclick = (e) => {
      e.currentTarget.parentElement.querySelector("input").type = "text";
      e.currentTarget.classList.add("!hidden");
      e.currentTarget.nextElementSibling.classList.remove("!hidden");
    };
  });

  // hide password
  document.querySelectorAll("[data-lucide=eye-off]").forEach((element) => {
    // @ts-expect-error ...
    element.onclick = (e) => {
      e.currentTarget.parentElement.querySelector("input").type = "password";
      e.currentTarget.classList.add("!hidden");
      e.currentTarget.previousElementSibling.classList.remove("!hidden");
    };
  });
});
