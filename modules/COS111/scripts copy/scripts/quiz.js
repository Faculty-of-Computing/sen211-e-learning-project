// @ts-check

import { getUser, saveResult } from "./firebase.js";

const scriptUrl = new URL(import.meta.url);
const jsonParam = scriptUrl.searchParams.get("json");

await new Promise((res) => {
  document.addEventListener("DOMContentLoaded", res);
});

/** @type {string} */
let performanceUrl;

getUser((user) => {
  const welcomeMsg = /** @type {HTMLElement} */ (
    document.querySelector(".welcome-message")
  );
  welcomeMsg.innerText = `Welcome, ${user.displayName}`;
});

const waitSection = /** @type {HTMLElement} */ (
  document.querySelector(".inside.embed.wait")
);
const startSection = /** @type {HTMLElement} */ (
  document.querySelector(".inside.embed.start")
);
const finishSection = /** @type {HTMLElement} */ (
  document.querySelector(".inside.embed.finish")
);
const quizName = /** @type {HTMLElement} */ (
  document.querySelector(".quiz-name")
);
const quizName2 = /** @type {HTMLElement} */ (
  document.querySelector(".quiz-name-2")
);
const startButton = /** @type {HTMLElement} */ (
  document.querySelector(".go.start")
);
const submitButton = /** @type {HTMLElement} */ (
  document.querySelector(".go.submit")
);
const statusMessage = /** @type {HTMLElement} */ (
  document.querySelector(".status-message")
);
const questionContainer = /** @type {HTMLElement} */ (
  document.querySelector(".questions-container-main")
);
const reviewScore = /** @type {HTMLElement} */ (
  document.querySelector(".review-score-button")
);
const doneReviewScore = /** @type {HTMLElement} */ (
  document.querySelector(".done-review-score-button")
);
const timeAlloc = /** @type {HTMLElement} */ (
  document.querySelector(".time-alloc")
);
const timerDisplay = /** @type {HTMLElement} */ (
  document.querySelector(".timer-head")
);
const loadingGif = /** @type {HTMLElement} */ (
  document.querySelector(".loading-gif")
);
var timeLeft = 0; //s
var i;

startButton.onclick = () => {
  waitSection.classList.toggle("hide", true);
  startSection.classList.toggle("hide", false);
  timerDisplay.classList.toggle("hide", false);
  i = setInterval(() => {
    if (timeLeft <= 0) {
      submitButton.click();
      timerDisplay.classList.toggle("panic", false);
      timerDisplay.classList.toggle("hide", true);
      clearInterval(i);
    } else {
      timeLeft -= 1;
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerDisplay.innerText = `Time left: ${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;
    }
    if (timeLeft < 10) {
      timerDisplay.classList.toggle("panic", true);
    }
  }, 1000);
};
reviewScore.onclick = () => {
  finishSection.classList.toggle("hide", true);
  startSection.classList.toggle("hide", false);
  startSection.classList.toggle("review-stage", true);
};
doneReviewScore.onclick = () => {
  finishSection.classList.toggle("hide", false);
  startSection.classList.toggle("hide", true);
  location.href = performanceUrl;
};

/** @type {QuizData} */
let quizData;

try {
  const res = await fetch(jsonParam);
  /** @type {QuizData} */
  quizData = await res.json();
} catch {
  if (typeof globalThis.quizError === "function") globalThis.quizError();
  else alert("Unable to fetch quiz data");
}

quizName.innerText = quizData.name;
quizName2.innerText = quizData.name;
const minutes = Math.floor(quizData.time / 60);
const seconds = quizData.time % 60;
timeAlloc.innerText = `Time Allocated: ${minutes}:${
  seconds < 10 ? "0" : ""
}${seconds}`;
timeLeft = quizData.time;
statusMessage.innerText = "";
startButton.classList.toggle("hide", false); // Show the start button
loadingGif.classList.toggle("hide", true); // Hide the loading gif

const questionsContainer = /** @type {HTMLElement} */ (
  document.createElement("div")
);
questionContainer.classList.add("questions-container");

quizData.questions.forEach((questionData, index) => {
  const questionElement = /** @type {HTMLElement} */ (
    document.createElement("div")
  );
  questionElement.classList.add("question");

  const questionText = /** @type {HTMLElement} */ (document.createElement("p"));
  questionText.innerText = `${index + 1}. ${questionData.question}`;
  questionElement.appendChild(questionText);

  questionData.options.forEach((option, optionIndex) => {
    const optionElement = /** @type {HTMLElement} */ (
      document.createElement("div")
    );
    optionElement.classList.add("option");

    const inputElement = document.createElement("input");
    inputElement.type = "radio";
    inputElement.name = `question-${index}`;
    inputElement.value = option;
    inputElement.id = `question-${index}-option-${optionIndex}`;
    optionElement.appendChild(inputElement);

    const labelElement = document.createElement("label");
    labelElement.innerText = option;
    labelElement.htmlFor = `question-${index}-option-${optionIndex}`;
    optionElement.appendChild(labelElement);

    questionElement.appendChild(optionElement);
  });
  if (questionData.feedback) {
    const feedbackElement = /** @type {HTMLElement} */ (
      document.createElement("p")
    );
    feedbackElement.classList.add("feedback");
    feedbackElement.innerText = "Feedback: " + questionData.feedback;
    questionElement.appendChild(feedbackElement);
  }
  questionsContainer.appendChild(questionElement);
});

questionContainer.appendChild(questionsContainer);

submitButton.onclick = async () => {
  startSection.classList.toggle("hide", true);
  finishSection.classList.toggle("hide", false);
  timerDisplay.classList.toggle("panic", false);
  timerDisplay.classList.toggle("hide", true);
  clearInterval(i);

  let score = 0;
  const questions = /** @type {NodeListOf<HTMLElement>} */ (
    document.querySelectorAll(".question")
  );
  questions.forEach((question, index) => {
    const selectedOption = /** @type {HTMLInputElement} */ (
      question.querySelector('input[type="radio"]:checked')
    );
    if (
      selectedOption &&
      selectedOption.value == quizData.questions[index].correct
    ) {
      score++;
      selectedOption.parentElement.classList.add("correct-answer");
      /** @type {HTMLElement} */ (
        selectedOption.parentElement.parentElement.firstChild
      ).innerText += " (✅Correct)";
    } else {
      /** @type {HTMLElement} */ (question.firstChild).innerText +=
        " (❌Wrong)";
      const correctOption = /** @type {HTMLInputElement} */ (
        question.querySelector(
          `input[value="${quizData.questions[index].correct}"]`
        )
      );
      /** @type {HTMLElement} */ (correctOption.nextElementSibling).innerText +=
        " (✅Correct Option)";
      try {
        selectedOption.parentElement.classList.add("wrong-answer");
      } catch {
        /* empty */
      }
    }
  });
  performanceUrl = await saveResult({
    course: quizData.name,
    // FIXME DURATION IS THE TIME TAKEN FOR THE QUIZ,
    //  NOT THE TIME LEFT CHECK THE VALIDITY OF THIS LOGIC
    duration: timeLeft,
    score,
    total: quizData.questions.length,
  });
};
