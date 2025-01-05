// @ts-ignore
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
// @ts-ignore
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
// @ts-ignore
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

/**
 * Handles errors thrown in the application, formats their messages, and throws them.
 * @param {Error | string | any} error - The error object, string, or unknown object representing the error.
 * @returns {never} Throws a formatted error message.
 */
function handleError(error) {
  let text;

  if (
    error instanceof Error ||
    (typeof error === "object" && "message" in error)
  )
    text = error.message;
  else if (typeof error === "string") text = error;
  else throw new Error("Unknown error occurred!");

  const message = text
    .replace(/(^firebase:\s(error\s)?|\(auth\/|\)\.$)/gi, "")
    .replace(/-/g, " ");

  const errorMessage = message[0].toUpperCase() + message.slice(1);
  throw new Error(errorMessage);
}

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBCvaIdfHGFJC2nkLh1HGKAXAxcKnL8ePI",
  authDomain: "sen211-project.firebaseapp.com",
  projectId: "sen211-project",
  storageBucket: "sen211-project.firebasestorage.app",
  messagingSenderId: "1026780756728",
  appId: "1:1026780756728:web:36e48c435d11cab157990d",
  measurementId: "G-TV17E0KFXQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
export const auth = getAuth(app);
const db = getFirestore(app);

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) localStorage.setItem("user-id", user.uid);
});

/**
 * Create a new account for the user, using their email and password.
 *
 * @param {string} email - User's email address.
 * @param {string} password - User's password (must meet Firebase's password rules).
 * @returns {Promise<void>} Resolves when the account creation is successful.
 * @throws {Error} If the sign-up process fails.
 */
export async function signUp(email, password) {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    handleError(error);
  }
  return;
}

/**
 * Log in to an existing user account using email and password.
 *
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @returns {Promise<void>} Resolves when login is successful.
 * @throws {Error} If the login process fails.
 */
export async function login(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    handleError(error);
  }
  return;
}

/**
 * Directs the user to sign in using their Google account via a popup.
 *
 * @returns {Promise<void>} Resolves when Google sign-in is successful.
 * @throws {Error} If the Google sign-in process fails.
 */
export async function googleAuth() {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    handleError(error);
  }
}

/**
 * @typedef {object} Result
 * @property {number} total - Total number of questions the user attempted.
 * @property {number} score - Number of questions answered correctly by the user.
 * @property {string} course - Name of the course or subject for which the result pertains.
 * @property {string} time - Timestamp of when the result was uploaded.
 * @property {string} uid - The user's unique identifier.
 */

/**
 * Save the user's quiz or test results to the database.
 *
 * @param {Result} result - An object containing the user's test results.
 * @returns {Promise<void>} Resolves when the result is successfully uploaded to Firestore.
 * @throws {Error} If the upload process fails.
 */
export async function uploadResult(result) {
  const ref = collection(db, "results");
  try {
    await addDoc(ref, {
      ...result,
      time: serverTimestamp(),
      uid: localStorage.getItem("user-id"),
    });
  } catch (error) {
    handleError(error);
  }
  return;
}

/**
 * @typedef {object} StudentData
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} regNo
 * @param {StudentData} data
 */
export async function saveStudent(data) {
  try {
    const userId = await new Promise((res, rej) => {
      onAuthStateChanged(auth, (user) => {
        if (user) res(user.uid);
        else rej(user);
      });
    });
    const ref = doc(db, "users", userId);
    await setDoc(ref, {
      ...data,
    });
    await updateProfile(auth, {
      displayName: `${data.firstName} ${data.lastName}`,
    });
  } catch (err) {
    handleError(err);
  }
}

/**
 * Fetch a list of the current user's results from the database.
 *
 * @returns {Promise<Result[]>} A promise that resolves to an array of the user's results.
 * @throws {Error} If fetching results from Firestore fails.
 */
export async function getUserResults() {
  try {
    const id = localStorage.getItem("user-id");
    const ref = collection(db, "results");
    const q = query(ref, where("uid", "==", id));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    handleError(error);
  }
}
