// @ts-check

import { getUser } from "./scripts/firebase.js";

getUser((user) => {
  const welcomeMsg = /** @type {HTMLElement} */ (
    document.querySelector(".welcome-message")
  );
  const userSlug = /** @type {HTMLElement} */ (
    document.querySelector(".user-slug")
  );
  welcomeMsg.innerText = `Welcome, ${user.displayName}`;
  if (user.displayName) {
    const nameParts = user.displayName.split(" ");
    const firstNameInitial = nameParts[0] ? nameParts[0][0] : "";
    const lastNameInitial =
      nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : "";
    userSlug.innerText = `${firstNameInitial}${lastNameInitial}`.toUpperCase();
  } else {
    userSlug.innerText = "NA";
  }
});
