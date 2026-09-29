// ========== Login & Sign up with Firebase ==========
import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

// ========== Switch between the two forms ==========
document.getElementById("showSignup").addEventListener("click", function (e) {
  e.preventDefault();
  loginForm.style.display = "none";
  signupForm.style.display = "block";
});

document.getElementById("showLogin").addEventListener("click", function (e) {
  e.preventDefault();
  signupForm.style.display = "none";
  loginForm.style.display = "block";
});

// ========== Messages ==========
// type = "error" (red) or "success" (green)
function showStatus(id, message, type) {
  const status = document.getElementById(id);
  status.textContent = message;
  status.className = "status " + type;
}

// turn the Firebase error code into a clear message
function errorMessage(code) {
  if (code == "auth/email-already-in-use") return "An account already uses this email.";
  if (code == "auth/invalid-email") return "Please write a correct email.";
  if (code == "auth/weak-password") return "The password is too weak. Use at least 6 characters.";
  if (code == "auth/operation-not-allowed") return "Email/Password sign in is not enabled in Firebase.";
  if (code == "auth/network-request-failed") return "Network error. Check your internet and try again.";
  if (code == "auth/too-many-requests") return "Too many tries. Please wait a little and try again.";
  if (code == "auth/invalid-credential" || code == "auth/wrong-password" || code == "auth/user-not-found") {
    return "Wrong email or password.";
  }
  if (code == "permission-denied") return "Permission denied. Check the Firestore Security Rules.";
  return "Something went wrong (" + code + "). Please try again.";
}

// simple email check: something@something.something
function isEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ========== Save the profile in Firestore ==========
// the document ID is the user's UID: users/{uid}
// (the password is NOT saved here, it stays in Authentication)
async function saveProfile(user, firstName, lastName) {
  await setDoc(doc(db, "users", user.uid), {
    firstName: firstName,
    lastName: lastName,
    name: firstName + " " + lastName,
    email: user.email,
    createdAt: serverTimestamp()
  });
}

// ========== Sign up ==========
signupForm.addEventListener("submit", async function (e) {
  e.preventDefault(); // stop the page from reloading

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const button = document.getElementById("signupBtn");

  // 1) check the inputs before sending anything
  if (firstName.length < 2 || lastName.length < 2) {
    showStatus("signupStatus", "First and last name must be at least 2 letters.", "error");
    return;
  }
  if (!isEmail(email)) {
    showStatus("signupStatus", "Please write a correct email.", "error");
    return;
  }
  if (password.length < 6) {
    showStatus("signupStatus", "The password must be at least 6 characters.", "error");
    return;
  }
  if (password != confirmPassword) {
    showStatus("signupStatus", "The two passwords are not the same.", "error");
    return;
  }

  // 2) disable the button while we wait for Firebase
  button.disabled = true;
  showStatus("signupStatus", "Creating your account...", "success");

  // 3) create the account in Authentication
  let user;

  if (auth.currentUser && auth.currentUser.email == email) {
    // the account was already created before, but the profile was not saved.
    // use the same account (same UID) instead of creating a new one
    user = auth.currentUser;
  } else {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      user = result.user;
    } catch (error) {
      showStatus("signupStatus", errorMessage(error.code), "error");
      button.disabled = false;
      return;
    }
  }

  // 4) save the profile in Firestore
  try {
    await saveProfile(user, firstName, lastName);
  } catch (error) {
    // the account is ready but the profile failed -> the user can try again
    showStatus("signupStatus",
      "Your account was created, but your profile was not saved. Click Sign Up to try again.", "error");
    button.disabled = false;
    return;
  }

  // 5) send the verification email (not required to continue)
  try {
    await sendEmailVerification(user);
  } catch (error) {
    console.log("Verification email was not sent:", error.code);
  }

  showStatus("signupStatus", "Welcome " + firstName + "! We sent a verification link to your email.", "success");

  // go to the profile after 2 seconds
  setTimeout(function () {
    window.location.href = "profile.html";
  }, 2000);
});

// ========== Log in ==========
loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const button = document.getElementById("loginBtn");

  if (!isEmail(email) || password == "") {
    showStatus("loginStatus", "Please write your email and password.", "error");
    return;
  }

  button.disabled = true;
  showStatus("loginStatus", "Logging in...", "success");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "profile.html";
  } catch (error) {
    showStatus("loginStatus", errorMessage(error.code), "error");
    button.disabled = false;
  }
});

// ========== Forgot password ==========
document.getElementById("forgotPassword").addEventListener("click", async function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();

  if (!isEmail(email)) {
    showStatus("loginStatus", "Write your email first, then click \"Forgot password?\".", "error");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    showStatus("loginStatus", "We sent a link to reset your password. Check your email.", "success");
  } catch (error) {
    showStatus("loginStatus", errorMessage(error.code), "error");
  }
});
