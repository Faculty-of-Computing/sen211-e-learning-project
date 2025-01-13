// @ts-check

import { getUser } from "/scripts/firebase.js";

getUser((user) => {
  const welcomeMsg = /** @type {HTMLElement} */ (
    document.querySelector(".welcome-message")
  );
  const userSlug = /** @type {HTMLElement} */ (
    document.querySelector(".user-slug")
  );
  welcomeMsg.innerText = `Welcome, ${user.displayName}`;
  if (user.displayName) {
    const nameParts = user.displayName.split(" ").map((part) => part[0].toUpperCase());
    userSlug.innerText = nameParts.slice(0, 2).join("");
  } else {
    userSlug.innerText = "NA";
  }
});
