const nav = document.querySelector(".mobile-nav");
const menuButton = document.querySelector(".hamburger");
const closeButton = document.querySelector(".reverse-hamburger");

let isNavOpen = false;

const showNav = () => {
    nav.classList.add("showOnMobile");
    menuButton.classList.remove("showOnMobile");
    isNavOpen = true;
    closeButton.classList.add("showOnMobile");
}

const hideNav = () => {
    nav.classList.remove("showOnMobile");
    closeButton.classList.remove("showOnMobile");
    menuButton.classList.add("showOnMobile");
    isNavOpen = false;
}