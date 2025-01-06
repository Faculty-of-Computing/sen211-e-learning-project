type QuestionData = {
  question: string;
  options: string[];
  correct: string;
  feedback: string;
};

type QuizData = {
  name: string;
  time: number;
  questions: QuestionData[];
};

type Result = {
  /** Total number of questions the user attempted. */
  total: number;
  /** Number of questions answered correctly by the user. */
  score: number;
  /** Name of the course or subject for which the result pertains. */
  course: string;
  /** The amount of time it took the user to complete the quiz e.g. 10 Mins */
  duration: number;
};

type User = import("firebase/auth").User;
