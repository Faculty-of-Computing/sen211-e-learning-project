      const quizguideBtn = document.querySelector("#quizguide-btn");
      const exitInfoBtn = document.querySelector("#exitinfo-btn");
      const landingpageContinueBtn = document.querySelector("#landingpage-continue-btn")
const guidePop = document.querySelector(".guide-pop");
const landingContent = document.querySelector('.landing-content');
const quizMain = document.querySelector('.quiz-main');

quizguideBtn.addEventListener('click', ()=>{
    guidePop.classList.add("active");
    landingContent.style.display ="none";
});

exitInfoBtn.addEventListener('click', ()=>{
    guidePop.classList.remove("active");
    landingContent.style.display ="";
});

landingpageContinueBtn.addEventListener('click', ()=>{
    quizMain.style.display="block";
    landingContent.style.display ="none";
    
});

 
  
    const prevBtn = document.querySelector(".left-btn");
const nextBtn = document.querySelector(".right-btn");
const submitQuiz = document.getElementById("submit");
const resultEl = document.getElementById("result");
const scoreEl = document.getElementById("score");
const pageCount = document.getElementById("page-count");
const strongTotal = document.getElementById("strong-total");
const questionTitle = document.getElementById("question");
const answerLabel = document.querySelectorAll(".answer-label");
const allInputs = document.querySelectorAll("input[type='radio']");
const quiz = document.getElementById("quiz");




let currentQtn = 0;
let answered = 0;

const quizData = [
    {
        question: "What is the primary goal of algorithm design in programming?",
        a: "To write efficient code",
        b: "To solve complex problems",
        c: "To design a user interface",
        d: "To optimize memory usage",
        correct: "a",
    },
          {
        question: "What is a flowchart used for in programming?" ,
        a: "To write code",
        b: "To design algorithms",
        c: "To debug programs",
        d: "To test software",
        correct:"a",
    },
    {
        question: "What is the purpose of keywords in programming?",
        a: "To declare variables",
        b: "To define functions",
        c: "To control program flow",
        d: "To identify reserved words",
        correct:"c",
    },
    {
        question:"What is the difference between assignment and equality operators?" ,
        a: "Assignment assigns a value, while equality checks for equality",
        b: "Assignment checks for equality, while equality assigns a value",
        c: "Assignment and equality are the same",
        d: "Assignment is used for arithmetic operations",
        correct:"a",
    },
    {
        question: "What type of control structure is used to execute a block of code repeatedly?",
        a: "Conditional statement",
        b: "Loop",
        c: "Function",
        d: "Array",
        correct:"a",
    },
    {
        question: "What is the purpose of an array in programming?",
        a: "To store a single value",
        b: "To store a collection of values",
        c: "To perform arithmetic operations",
        d: "To control program flow",
        correct:"a",
    },
    {
        question: "What is the benefit of using functions in programming?",
        a: "To reduce code readability",
        b: "To increase code complexity",
        c: "To promote code reusability",
        d: "To decrease code efficiency",
        correct:"b",
    },
    {
        question: "What is a function in programming?",
        a: "A block of code that performs a specific task",
        b: "A variable that stores a value",
        c: "A control structure that executes code repeatedly",
        d: "A data structure that stores a collection of values",
        correct:"a",
    },
    {
        question: "What is the difference between a local variable and a global variable?",
        a: "Local variables are accessible globally, while global variables are accessible locally",
        b: "Local variables are accessible only within a function, while global variables are accessible throughout the program",
        c: "Local variables are used for arithmetic operations, while global variables are used for storing strings",
        d: "Local variables are used for storing arrays, while global variables are used for storing single values",
        correct:"1",
    },
    {
        question: "What is the purpose of comments in programming?",
        a: "To execute code",
        b: "To explain code functionality",
        c: "To control program flow",
        d: "To declare variables",
        correct:"d",
    },
    {
        question:"What is the primary goal of computer programming?" ,
        a: "To develop algorithms and write",
        b: "To manage databases",
        c: "To design computer hardware",
        d: "To create computer networks",
        correct:"c",
    },
    {
        question: "What is the purpose of the break statement in a loop?",
        a: "To exit the loop prematurely",
        b: "To continue executing the loop",
        c: "To restart the loop from the beginning",
        d: "To skip to the next iteration of the loop",
        correct:"d",
    },
    {
        question: "What is the difference between an if-else statement and a switch statement?",
        a: "An if-else statement is used for conditional statements, while a switch statement is used for unconditional statements",
        b: "An if-else statement is used for multiple conditions, while a switch statement is used for a single condition",
        c: "An if-else statement is used for a single condition, while a switch statement is used for multiple conditions",
        d: "An if-else statement is used for functions, while a switch statement is used for variables",
        correct:"b",
    },
    {
        question:"What are keywords in programming?" ,
        a: "Reserved words with special meanings",
        b:  "Functions used in a program",
        c: "Variables used in a program",
        d: "Data types used in a program",
        correct:"c",
    },
    {
        question: "What is the purpose of variables in programming?",
        a: "To store changing values",
        b: "To store constant values",
        c: "To perform arithmetic operations",
        d: "To control program flow",
        correct:"b",
    },
    {
        question:"What is the purpose of the return statement in a function?" ,
        a: "To exit the function prematurely",
        b: "To return a value from the function",
        c: "To continue executing the function",
        d: "To restart the function",
        correct:"a",
    },
    {
        question:"What is a control structure in programming?" ,
        a:  "A statement that declares a variable",
        b: "A statement that assigns a value to a variable",
        c: "A statement that controls program flow",
        d: "A statement that performs arithmetic operations",
        correct:"b",
    },
    {
        question: "A statement that performs arithmetic operations",
        a: "A collection of variables of the same data type",
        b: "A single variable that stores multiple values",
        c: "A data structure that stores key-value pairs",
        d: "A programming language",
        correct:"a",
    },
    {
        question: "What is a function in programming?",
        a:  "A variable that stores a value",
        b:  "A control structure that controls program flow",
        c: "A block of code that performs a specific task",
        d: "A data structure that stores multiple values",
        correct:"c",
    },
    {
        question: "What is the difference between a for loop and a while loop?",
        a: "A for loop is used for known iterations, while a while loop is used for unknown iterations",
        b:   "A for loop is used for conditional statements, while a while loop is used for unconditional statements",
        c: "A for loop is used for functions, while a while loop is used for variables",
        d: "A for loop is used for arrays, while a while loop is used for linked lists",
        correct:"b",
    }

];

const loadQuiz = () => {
    questionTitle.innerHTML = quizData[currentQtn].question;
    answerLabel[0].innerHTML = quizData[currentQtn].a;
    answerLabel[1].innerHTML = quizData[currentQtn].b;
    answerLabel[2].innerHTML = quizData[currentQtn].c;
    answerLabel[3].innerHTML = quizData[currentQtn].d;

    reset();

    pageCount.innerHTML = currentQtn + 1;
    strongTotal.innerHTML = quizData.length;

    prevBtn.disabled = currentQtn === 0;

    if (currentQtn === quizData.length - 1) {
        nextBtn.style.display = 'none';
        submitQuiz.parentElement.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitQuiz.parentElement.style.display = 'none';
    }
};

const reset = () => {
    allInputs.forEach((input) => {
        input.checked = false;
    });
};

const getSelected = () => {
    let answer;
    allInputs.forEach((input) => {
        if (input.checked) {
            answer = input.value;
        }
    });
    return answer;
};

nextBtn.addEventListener('click', () => {
    const answer = getSelected();
    if (answer) {
        if (answer === quizData[currentQtn].correct) {
            answered++;
        }
        currentQtn++;
        loadQuiz();
    }
});


submitQuiz.addEventListener('click', () => {
    const answer = getSelected();
    if (answer === quizData[currentQtn].correct) {
        answered++;
    }
    if (getSelected()) {
        quiz.style.display = 'none';
        resultEl.style.display = "block";
        scoreEl.innerHTML = `Questions Answered Correctly ${answered} / ${quizData.length}`;
    }
});

prevBtn.addEventListener('click', () => {
    if (currentQtn > 0) {
        currentQtn--;
        loadQuiz();
    }
});

loadQuiz();

function reloadQuiz() {
        
        currentQtn = 0;
        answered = 0;
        pageCount.innerHTML = 1; 
        allInputs.forEach(input => input.checked = false);

        resultEl.style.display = 'none';
        quizMain.style.display = 'block';
        
        loadQuiz();
    }