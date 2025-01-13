const quizData = [
  {
      question: "What does HTML stand for?",
      options: [
          "HyperText Markup Language",
          "HyperText Transfer Protocol",
          "HyperLink Text Markup",
          "HyperLink Transfer Protocol",
      ],
      correct: 0,
  },
  {
      question: "What is CSS used for?",
      options: [
          "Styling web pages",
          "Adding interactivity",
          "Creating web page structure",
          "Adding multimedia",
      ],
      correct: 0,
  },
  {
      question: "What is JavaScript used for?",
      options: [
          "Styling web pages",
          "Adding interactivity",
          "Creating web page structure",
          "Adding multimedia",
      ],
      correct: 1,
  },
  {
      question: "What is XML used for?",
      options: [
          "Styling web pages",
          "Adding interactivity",
          "Sharing data between systems",
          "Creating web page structure",
      ],
      correct: 2,
  },
  {
      question: "What is the purpose of the `<head>` element in HTML?",
      options: [
          "Provide metadata",
          "Add interactivity",
          "Style page",
      ],
      correct: 0,
  },
  {
      question: "What is the difference between HTML and XML?",
      options: [
          "HTML is for styling, XML is for data",
          "HTML is for data, XML is for styling",
          "HTML is for web pages, XML is for data exchange",
          "HTML is for data exchange, XML is for web pages",
      ],
      correct: 2,
  },
  {
      question: "What is the purpose of the `id` attribute in HTML?",
      options: [
          "Define style",
          "Define structure",
          "Identify element",
          "Add interactivity",
      ],
      correct: 2,
  },
  {
      question: "What is the purpose of the `stylesheet` element in XML?",
      options: [
          "Define style",
          "Link to stylesheet",
          "Define structure",
          "Add interactivity",
      ],
      correct: 1,
  },
  {
      question: "What is the difference between a well-formed and valid XML document?",
      options: [
          "Well-formed is invalid, valid is well-formed",
          "Well-formed meets basic syntax, valid meets schema",
          "Well-formed meets schema, valid meets basic syntax",
          "Well-formed is for data, valid is for styling",
      ],
      correct: 1,
  },
  {
      question: "What is the purpose of the `DOCTYPE` declaration in HTML?",
      options: [
          "Define style",
          "Define structure",
          "Declare document type",
          "Add interactivity",
      ],
      correct: 2,
  },
];


const quizContainer = document.getElementById("quiz");
const submitButton = document.getElementById("submit");

function loadQuiz() {
  quizData.forEach((item, index) => {
      const questionElement = document.createElement("div");
      questionElement.classList.add("question");

      const questionTitle = document.createElement("h3");
      questionTitle.textContent = `Question ${index + 1}: ${item.question}`;
      questionElement.appendChild(questionTitle);

      const optionsList = document.createElement("ul");
      optionsList.classList.add("options");

      item.options.forEach((option, i) => {
          const optionItem = document.createElement("li");

          const radioInput = document.createElement("input");
          radioInput.type = "radio";
          radioInput.name = `question${index}`;
          radioInput.value = i;

          const label = document.createElement("label");
          label.textContent = option;

          optionItem.appendChild(radioInput);
          optionItem.appendChild(label);

          optionsList.appendChild(optionItem);
      });

      questionElement.appendChild(optionsList);
      quizContainer.appendChild(questionElement);
  });
}

function submitQuiz() {
  const answers = document.querySelectorAll("input[type='radio']:checked");
  const resultBox = document.createElement("div");
  resultBox.classList.add("result-box");
  quizContainer.appendChild(resultBox);

  let score = 0;

  quizData.forEach((item, index) => {
      const selectedAnswer = document.querySelector(
          `input[name="question${index}"]:checked`
      );

      const resultElement = document.createElement("div");
      resultElement.classList.add("result-item");

      if (selectedAnswer) {
          const selectedValue = parseInt(selectedAnswer.value);

          if (selectedValue === item.correct) {
              score++;
              resultElement.textContent = `Question ${index + 1}: Correct ✅`;
              resultElement.style.color = "green";
          } else {
              resultElement.textContent = `Question ${index + 1}: Wrong ❌`;
              resultElement.style.color = "red";
          }
      } else {
          resultElement.textContent = `Question ${index + 1}: Skipped ❌`;
          resultElement.style.color = "red";
      }

      resultBox.appendChild(resultElement);
  });

  alert(`You scored ${score} out of ${quizData.length}!`);
}

submitButton.addEventListener("click", () => {
  // Clear any previous results
  const existingResultBox = document.querySelector(".result-box");
  if (existingResultBox) existingResultBox.remove();

  submitQuiz();
});

// Load the quiz on page load
loadQuiz();
