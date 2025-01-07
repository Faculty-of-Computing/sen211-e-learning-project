/* eslint-disable no-unused-vars */
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

declare function setupQuiz(meta: MetaRequirements): void;

type ResultExtra = {
  id: string;
  time: {
    toDate(): Date;
  };
};

type MetaRequirements = {
  /** The group number */
  moduleNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  /** A URL to your quiz's json */
  jsonUrl: string;
  /** A custom loading message for your quiz */
  loadingMsg?: string;
  /** The name of the course for the module */
  course: string;
};
