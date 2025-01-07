// @ts-check

// @ts-expect-error ...
import * as _firebaseAnalytics from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
// @ts-expect-error ...
import * as _firebaseApp from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
// @ts-expect-error ...
import * as _firebaseAuth from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
// @ts-expect-error ...
import * as _firestore from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firestore = /** @type {import("firebase/firestore")} */ (_firestore);
const firebaseApp = /** @type {import("firebase/app")} */ (_firebaseApp);
const firebaseAuth = /** @type {import("firebase/auth")} */ (_firebaseAuth);
const firebaseAnalytics = /** @type {import("firebase/analytics")} */ (
  _firebaseAnalytics
);

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
const app = firebaseApp.initializeApp(firebaseConfig);
firebaseAnalytics.getAnalytics(app);
export const auth = firebaseAuth.getAuth(app);
const db = firestore.getFirestore(app);

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
    await firebaseAuth.createUserWithEmailAndPassword(auth, email, password);
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
 * @returns {Promise<User>} Resolves when login is successful.
 * @throws {Error} If the login process fails.
 */
export async function login(email, password) {
  try {
    const { user } = await firebaseAuth.signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return user;
  } catch (error) {
    handleError(error);
  }
}

/**
 * Directs the user to sign in using their Google account via a popup.
 *
 * @returns {Promise<User>} Resolves when Google sign-in is successful.
 * @throws {Error} If the Google sign-in process fails.
 */
export async function googleAuth() {
  const provider = new firebaseAuth.GoogleAuthProvider();
  try {
    const { user } = await firebaseAuth.signInWithPopup(auth, provider);
    return user;
  } catch (error) {
    handleError(error);
  }
}

/**
 * Save the user's quiz or test results to the database and redirect them
 * to the performance page to see their result.
 *
 * @param {Result} result - An object containing the user's test results.
 * @returns {Promise<string>} Returns the url to the performance page
 * to Firestore.
 * @throws {Error} If the upload process fails.
 */
export async function saveResult(result) {
  const ref = firestore.collection(db, "results");
  const user = await getUser();
  try {
    const { id } = await firestore.addDoc(ref, {
      ...result,
      time: firestore.serverTimestamp(),
      uid: user.uid,
    });
    const url = new URL("/modules/performance/index.html", location.href);
    url.searchParams.set("id", id);
    url.searchParams.set("score", result.score.toString());
    url.searchParams.set("total", result.total.toString());
    url.searchParams.set("duration", result.duration.toString());
    url.searchParams.set("course", result.course);
    return url.href;
  } catch (error) {
    handleError(error);
  }
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
    const user = await getUser();
    const ref = firestore.doc(db, "users", user.uid);
    await firestore.setDoc(ref, {
      ...data,
    });
    await firebaseAuth.updateProfile(user, {
      displayName: `${data.firstName} ${data.lastName}`,
    });
    localStorage.setItem("user-id", user.uid);
  } catch (err) {
    handleError(err);
  }
}

export async function studentDataIsSaved() {
  const user = await getUser();
  const ref = firestore.doc(db, "users", user.uid);
  const snapshot = await firestore.getDoc(ref);
  return snapshot.exists();
}

/**
 * Fetch a list of the current user's results from the database.
 *
 * @returns {Promise<Array<Result & ResultExtra>>} A promise that resolves to an array of the user's results.
 * @throws {Error} If fetching results from Firestore fails.
 */
export async function getUserResults() {
  try {
    const user = await getUser();
    const ref = firestore.collection(db, "results");
    const q = firestore.query(ref, firestore.where("uid", "==", user.uid));
    const snapshot = await firestore.getDocs(q);
    return snapshot.docs.map((doc) => {
      return {
        .../** @type {Result & ResultExtra} */ (doc.data()),
        id: doc.id,
      };
    });
  } catch (error) {
    handleError(error);
  }
}

/**
 * @param {(user: User) => any} [cb]
 * @returns {Promise<User>}
 */
export async function getUser(cb) {
  /** @type {User} */
  const user = await new Promise((res, rej) => {
    firebaseAuth.onAuthStateChanged(auth, (user) => {
      if (user) res(user);
      else rej("Unable to fetch user!");
    });
  });
  if (cb) cb(user);
  return user;
}
