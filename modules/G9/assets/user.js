import { getUser } from "/scripts/firebase.js";

const userSlug = Array.from(document.querySelectorAll("div"))
  .reverse()
  .find((div) => {
    return div.innerText.includes("JD");
  });

if (userSlug)
  getUser(({ displayName, photoURL }) => {
    if (photoURL || displayName) userSlug.innerText = "";
    if (photoURL) {
      userSlug.style.backgroundImage = `url(${photoURL})`;
      userSlug.style.backgroundPosition = "center";
      userSlug.style.backgroundSize = "cover";
    } else if (displayName) {
      userSlug.innerText = displayName
        .split(" ")
        .slice(0, 2)
        .map((name) => name[0].toUpperCase())
        .join("");
    }
  });
