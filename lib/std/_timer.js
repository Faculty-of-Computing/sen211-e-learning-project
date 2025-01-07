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
      fontFamily: `'Afacad', serif`,
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
  hide() {
    this.element.style.display = "none";
  }
  panic() {
    pairCSS(this.element, {
      animation: "panic 0.5s infinite",
      borderTop: "none",
    });
  }
  stop() {
    clearInterval(this.interval);
  }
  /**
   * Start the timer for the quiz
   * @param {number} time
   */
  start(time) {
    this.time = time;
    // reveal timer
    this.element.style.display = "";
    this.interval = setInterval(() => {
      this.time--;
      this.element.innerText = `Time Left: ${Math.floor(this.time / 60)
        .toString()
        .padStart(2, "0")}:${(this.time % 60).toString().padStart(2, "0")}`;
      if (this.time <= 300) this.panic();
      if (this.time <= 0) this.stop();
    }, 1000);
  }
}
