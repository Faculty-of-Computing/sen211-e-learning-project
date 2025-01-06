// @ts-check

// NOTE LOAD THIS QUIZ WITH THE URL OF YOUR JSON FILE, ATTACHED AS PART OF
// THE SCRIPT'S URL TO BE LOADED INTO YOUR HTML. THE FEW LINES OF CODE BELOW
// MAKE USE OF THIS INFORMATION TO LOAD AND IMPLEMENT YOUR QUIZ

import { getUser, saveResult } from "../scripts/firebase.js";
import Timer from "./std/_timer.js";
import { createElement, parseMetaUrl } from "./std/_utils.js";

export const timer = new Timer();

const main = document.body.appendChild(document.createElement("div"));
main.classList.add("main");

const {
  moduleNumber,
  loadingMsg: loadingText,
  jsonUrl,
  course,
} = parseMetaUrl(import.meta.url);

{
  // SECTION - HEADER SECTION
  const header = main.appendChild(createElement("div.header-section"));
  // header.classList.add("header-section");
  header.innerHTML += `<h1><span id="Learn">Module</span> ${moduleNumber}</h1>`;
  getUser(({ displayName, photoURL }) => {
    if (photoURL) {
      const img = new Image(36, 36);
      img.src = photoURL;
      img.classList.add("user-slug");
      header.appendChild(img);
    } else if (displayName) {
      const userSlug = header.appendChild(createElement("div.user-slug"));
      displayName.split(" ").forEach((name) => {
        userSlug.innerText += name[0].toUpperCase();
      });
    }
  });
}
{
  // Welcome message
  const welcomeMsg = main.appendChild(createElement("p.welcome-message"));
  welcomeMsg.innerText = "Welcome";
  getUser(({ displayName }) => {
    welcomeMsg.innerText += `, ${displayName}`;
  });
}
{
  // Bread crumbs
  const p = main.appendChild(createElement("p"));

  const homeAnchor = /** @type {HTMLAnchorElement} */ (
    p.appendChild(createElement("a.goto"))
  );
  homeAnchor.innerText = "Home";
  homeAnchor.href = "/";
  p.innerHTML += "/";
  const moduleAnchor = /** @type {HTMLAnchorElement} */ (
    p.appendChild(createElement("a.goto"))
  );
  moduleAnchor.href = "../";
  moduleAnchor.innerText = `Module ${moduleNumber}`;
  /** @type {HTMLAnchorElement} */
  p.innerHTML += "/Quiz";
}
{
  // loader
  const waitContainer = main.appendChild(createElement("div.embed"));
  const loadingMsg = waitContainer.appendChild(
    createElement("span.status-message")
  );
  loadingMsg.innerText = loadingText;
  const innerContainer = waitContainer.appendChild(
    createElement("div.inside-header.start")
  );
  const loadingImg = document.createElement("img");
  loadingImg.src = "/modules/COS111/img/loading_ai.gif";
  loadingImg.setAttribute("width", "50%");
  loadingImg.classList.add("loading-gif");
  innerContainer.appendChild(loadingImg);

  // fetch quiz
  fetch(jsonUrl)
    .then((res) => res.json())
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      alert("Unable to load quiz");
      history.back();
    })
    .then(
      /** @param {QuizData} quiz  */
      (quiz) => {
        // Randomize quiz
        for (let i = 0; i < quiz.questions.length; i++) {
          const j = Math.floor(Math.random() * quiz.questions.length);
          [quiz.questions[i], quiz.questions[j]] = [
            quiz.questions[j],
            quiz.questions[i],
          ];
        }

        // QUIZ READY
        loadingMsg.remove();
        /** @type {HTMLImageElement} */ (
          document.querySelector(".loading-gif")
        ).remove();
        const quizName = innerContainer.appendChild(createElement("h1"));
        quizName.innerText = quiz.name;
        const allocatedTime = innerContainer.appendChild(createElement("span"));
        const startButton = innerContainer.appendChild(
          createElement("a.link-part")
        );
        startButton.innerText = "Start";
        startButton.style.float = "right";

        // calculate time
        const minutes = Math.floor(quiz.time / 60);
        const seconds = quiz.time % 60;
        allocatedTime.innerText = `Time Allocated: ${minutes}:${seconds
          .toString()
          .padStart(2, "0")}`;

        startButton.onclick = () => {
          // hide the loader & reveal the main quiz
          waitContainer.replaceWith(renderQuiz(quiz));
        };

        // TODO allocated time
      }
    );
}

/**
 * @param {QuizData} quiz
 * @returns {HTMLElement}
 */
function renderQuiz(quiz) {
  // quiz section
  const quizContainer = createElement("div.embed.start");
  const quizName = quizContainer.appendChild(createElement("h2"));
  quizName.innerText = quiz.name;

  // let timeLeft = quiz.time;

  const _container = quizContainer.appendChild(createElement("div"));
  const container = _container.appendChild(createElement("div"));

  // questions
  quiz.questions.forEach((q, index) => {
    const qElement = createElement("div.question");
    const qText = qElement.appendChild(createElement("p"));
    qText.innerText = `${index + 1}. ${q.question}`;

    q.options.forEach((option, optionIndex) => {
      const isCorrect = option === q.correct;

      const oElement = createElement(
        `div.option.${isCorrect ? "correct" : "wrong"}`
      );

      const input = /** @type {HTMLInputElement} */ (
        oElement.appendChild(createElement("input"))
      );
      input.type = "radio";
      input.name = `question-${index}`;
      input.value = option;
      input.id = `question-${index}-option-${optionIndex}`;

      if (isCorrect) input.setAttribute("correct", "true");

      const label = /** @type {HTMLLabelElement} */ (
        oElement.appendChild(createElement("label"))
      );
      label.innerText = option;
      label.htmlFor = input.id;

      qElement.appendChild(oElement);
    });

    // feedback
    const feedback = qElement.appendChild(createElement("p.feedback"));
    feedback.innerText = `Feedback: ${q.feedback}`;

    container.appendChild(qElement);
  });

  const quizContainerFooter = quizContainer.appendChild(
    createElement("div.inside-header-home")
  );
  quizContainerFooter.innerHTML += `<span>End of quiz</span>`;

  const quizButton = /** @type {HTMLAnchorElement} */ (
    quizContainerFooter.appendChild(createElement("a.link-part"))
  );
  quizButton.href = "#";

  let quizButtonClickCount = 0,
    performanceUrl = "";
  /** @param {MouseEvent} e */
  quizButton.onclick = (e) => {
    e.preventDefault();
    (async () => {
      quizButtonClickCount++;
      switch (quizButtonClickCount) {
        case 1: {
          quizContainer.classList.add("review-stage");
          performanceUrl = await saveResult({
            course,
            // FIXME
            duration: Infinity,
            score: document.querySelectorAll("div.option.correct input:checked")
              .length,
            total: quiz.questions.length,
          });
          quizButton.setAttribute("href", performanceUrl);
          quizButton.onclick = null;
          break;
        }
        case 2: {
          location.href = "/performance";
        }
      }
    })();
  };

  return quizContainer;
}
