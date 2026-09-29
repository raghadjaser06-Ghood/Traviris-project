// ========== Trips & Favorites in Firestore ==========
// every user has their own data:
//
// users
//   {uid}
//     favorites: ["Petra", "Wadi Rum"]      <- array of place names
//     trips                                 <- sub-collection
//       {tripId}
//         start, end, people, days, total, createdAt
//
// the normal scripts (script.js, planning.js, profile.js) can't use "import",
// so we put these functions on "window" to let them use them.

import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {
  doc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  arrayUnion,
  arrayRemove,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ========== Trips ==========

// save a new trip -> users/{uid}/trips/{automatic id}
window.saveTripToFirebase = async function (trip) {
  const uid = auth.currentUser.uid;
  trip.createdAt = serverTimestamp();
  await addDoc(collection(db, "users", uid, "trips"), trip);
};

// get all the trips of the user (oldest first)
window.getTripsFromFirebase = async function () {
  const uid = auth.currentUser.uid;
  const q = query(collection(db, "users", uid, "trips"), orderBy("createdAt"));
  const snapshot = await getDocs(q);

  const trips = [];
  snapshot.forEach(function (tripDoc) {
    const trip = tripDoc.data();
    trip.id = tripDoc.id; // we need the id to delete the trip
    trips.push(trip);
  });
  return trips;
};

// delete one trip
window.deleteTripFromFirebase = async function (tripId) {
  const uid = auth.currentUser.uid;
  await deleteDoc(doc(db, "users", uid, "trips", tripId));
};

// ========== Favorites ==========

// get the favorites array from users/{uid}
window.getFavoritesFromFirebase = async function () {
  const uid = auth.currentUser.uid;
  const snapshot = await getDoc(doc(db, "users", uid));

  if (snapshot.exists() && snapshot.data().favorites) {
    return snapshot.data().favorites;
  }
  return [];
};

// add a place (arrayUnion doesn't add the same name twice)
window.addFavoriteToFirebase = async function (placeName) {
  const uid = auth.currentUser.uid;
  await setDoc(doc(db, "users", uid), { favorites: arrayUnion(placeName) }, { merge: true });
};

// remove a place
window.removeFavoriteFromFirebase = async function (placeName) {
  const uid = auth.currentUser.uid;
  await setDoc(doc(db, "users", uid), { favorites: arrayRemove(placeName) }, { merge: true });
};

// ========== Tell the page when the user is ready ==========
// if the page has a function called "whenUserReady", we call it after login is checked
onAuthStateChanged(auth, function (user) {
  if (user && window.whenUserReady) {
    window.whenUserReady();
  }
});
