import { getUser, saveResult } from "/scripts/firebase.js";

// Wait for the DOM to be loaded before adding event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Listen for the quiz button click event
    const quizButtons = document.getElementsByClassName('quizButton');
    const quizButton = quizButtons[1];

    // Ensure the button exists before adding the event listener
    if (quizButton) {
        quizButton.addEventListener('click', function(event) {
            event.preventDefault();  // Prevent default click behavior

            // Get the content dynamically (you can use document.querySelector to fetch specific content)
            const pageContent = document.querySelector('.content').innerHTML;

            // Optionally, log the content or perform any actions you want
            console.log('Page Content:', pageContent);

            // Store the content in localStorage or do whatever you need with it
            localStorage.setItem('quizContent', pageContent);

            // Redirect to the quiz page (or you can dynamically load the quiz content here)
            window.location.href = './quizzes/Quiz.html';
        });
    } else {
        console.error('Quiz button not found!');
    }

    /** @type {string} */
    let performanceUrl;

    getUser((user) => {
        const welcomeMsg = /** @type {HTMLElement} */ (
            document.querySelector(".welcome-message")
        );
        welcomeMsg.innerText = `Welcome, ${user.displayName}`;
    });

    document.addEventListener("DOMContentLoaded", function () {
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
        let timeLeft = 0; //s
        let i;

        const fetchQuizData = async () => {
            try {
                const response = await fetch("https://cos1.vercel.app/api/quiz/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        content: localStorage.getItem('quizContent'),
                        level: 'MEDIUM', // Replace with the actual difficulty level if needed
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const quizData = JSON.parse(data);
                    quizName.innerText = quizData.name;
                    quizName2.innerText = quizData.name;
                    const minutes = Math.floor(quizData.time / 60);
                    const seconds = quizData.time % 60;
                    timeAlloc.innerText = `Time Allocated: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
                    timeLeft = quizData.time;
                    statusMessage.innerText = "";
                    startButton.classList.toggle("hide", false); // Show the start button
                    loadingGif.classList.toggle("hide", true); // Hide the loading gif

                    const questionsContainer = document.createElement("div");
                    questionContainer.classList.add("questions-container");

                    quizData.questions.forEach((questionData, index) => {
                        const questionElement = document.createElement("div");
                        questionElement.classList.add("question");

                        const questionText = document.createElement("p");
                        questionText.innerText = `${index + 1}. ${questionData.question}`;
                        questionElement.appendChild(questionText);

                        questionData.options.forEach((option, optionIndex) => {
                            const optionElement = document.createElement("div");
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
                            const feedbackElement = document.createElement("p");
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
                        const questions = document.querySelectorAll(".question");
                        questions.forEach((question, index) => {
                            const selectedOption = question.querySelector('input[type="radio"]:checked');
                            if (selectedOption && selectedOption.value == quizData.questions[index].correct) {
                                score++;
                                selectedOption.parentElement.classList.add("correct-answer");
                                question.firstChild.innerText += " (✅Correct)";
                            } else {
                                question.firstChild.innerText += " (❌Wrong)";
                                const correctOption = question.querySelector(`input[value="${quizData.questions[index].correct}"]`);
                                correctOption.nextElementSibling.innerText += " (✅Correct Option)";
                                if (selectedOption) {
                                    selectedOption.parentElement.classList.add("wrong-answer");
                                }
                            }
                        });

                        console.log("Final Score:", score);
                        performanceUrl = await saveResult({
                            course: quizData.name,
                            duration: quizData.time - timeLeft, // Time taken for the quiz
                            score,
                            total: quizData.questions.length,
                        });
                    };
                } else {
                    console.error("Failed to fetch quiz data:", await response.text());
                }
            } catch (error) {
                console.error("Error fetching the quiz data:", error);
            }
        };

        fetchQuizData();

        startButton.onclick = () => {
            console.log("Start");
            waitSection.classList.toggle("hide", true);
            startSection.classList.toggle("hide", false);
            timerDisplay.classList.toggle("hide", false);
            i = setInterval(() => {
                if (timeLeft <= 0) {
                    console.log("Time up");
                    submitButton.click();
                    timerDisplay.classList.toggle("panic", false);
                    timerDisplay.classList.toggle("hide", true);
                    clearInterval(i);
                } else {
                    timeLeft -= 1;
                    const minutes = Math.floor(timeLeft / 60);
                    const seconds = timeLeft % 60;
                    timerDisplay.innerText = `Time left: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
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
    });
});