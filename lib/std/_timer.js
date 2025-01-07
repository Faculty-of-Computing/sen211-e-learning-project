import { pairCSS } from "./_utils.js";

export default class Timer {
  constructor() {
    this.element = document.body.appendChild(document.createElement("div"));
    this.element.innerText = "Time left: ...";
    pairCSS(this.element, {
      position: "fixed",
      top: 0,
      left: "50%",
      width: "200px",
      transform: "translateX(-50%)",
      border: "#ff9100 2px solid",
      borderTop: "none",
      fontSize: "18px",
      fontFamily: `'Courier New', Courier, monospace`,
      padding: "4px",
      borderBottomLeftRadius: "9px",
      borderBottomRightRadius: "9px",
      background: "black",
      fontWeight: "700",
      color: "#ff9100",
      zIndex: "100",
      display: "none",
      textAlign: "center",
    });
  }
  reveal() {
    this.element.style.display = "";
  }
  hide() {
    this.element.style.display = "none";
  }
  panic() {
    pairCSS(this.element, {
      animation: "panic 0.5s infinite",
      color: "#ff2626",
      border: "#ff2626 2px solid",
      borderTop: "none",
    });
  }
}
