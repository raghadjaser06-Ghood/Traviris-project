// ========== Firebase setup ==========
// this file connects the website to our Firebase project.
// every page that needs Firebase uses this file.
// Firebase is loaded from the Firebase CDN (gstatic links)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// paste your project's config here
// (Firebase Console → Project settings → Your apps → Web app → Config)
const firebaseConfig = {
  apiKey: "AIzaSyBsGdleddZV85fO-t5ejIWWhcINSCfpKPg",
  authDomain: "traviris-6e755.firebaseapp.com",
  projectId: "traviris-6e755",
  storageBucket: "traviris-6e755.firebasestorage.app",
  messagingSenderId: "530101376886",
  appId: "1:530101376886:web:2c796fdfb0bad35a76cc57",
  measurementId: "G-BRPTK5R80S"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);       // Authentication (accounts)
const db = getFirestore(app);    // Cloud Firestore (database)

// share the logged in user with the normal scripts (script.js, planning.js)
// window.currentUser = the user, or null if nobody is logged in
onAuthStateChanged(auth, function (user) {
  window.currentUser = user;
});

export { app, auth, db };
