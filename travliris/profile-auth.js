// ========== Profile: account data from Firebase ==========
import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// runs when the page opens, and every time the login changes
onAuthStateChanged(auth, async function (user) {

  // not logged in -> go to the login page
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // the email comes from Authentication
  document.getElementById("email").value = user.email;

  // the name comes from Firestore: users/{uid}
  try {
    const snapshot = await getDoc(doc(db, "users", user.uid));

    if (snapshot.exists()) {
      const data = snapshot.data();
      document.getElementById("firstName").value = data.firstName;
      document.getElementById("lastName").value = data.lastName;
    } else {
      document.getElementById("firstName").placeholder = "Profile not found";
    }
  } catch (error) {
    alert("We couldn't load your profile (" + error.code + ").");
  }
});

// ========== Log out ==========
document.getElementById("logoutBtn").addEventListener("click", async function () {
  await signOut(auth);
  localStorage.removeItem("plan"); // the next account starts with an empty plan
  window.location.href = "login.html";
});

// ========== Change password ==========
// we never show or save the password. Firebase sends a reset link by email
document.getElementById("resetPasswordBtn").addEventListener("click", async function () {
  try {
    await sendPasswordResetEmail(auth, auth.currentUser.email);
    alert("We sent a link to your email to change your password.");
  } catch (error) {
    alert("Something went wrong (" + error.code + ").");
  }
});
