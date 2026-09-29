// ========== Check login ==========
// returns true if the user is logged in.
// if not, it asks them to go to the login page
// (window.currentUser is set by firebase.js)
function checkLogin() {
  if (window.currentUser) {
    return true;
  }

  if (confirm("You need an account to do this.\nGo to the login page?")) {
    window.location.href = "login.html";
  }
  return false;
}

// open the card details on the side
function openCard(button) {
  var card = button.closest(".place-card");
  var row = card.parentElement;

  row.classList.add("has-open");
  card.classList.add("open");
}

// close the card details
function closeCard(button) {
  var card = button.closest(".place-card");
  var row = card.parentElement;

  row.classList.remove("has-open");
  card.classList.remove("open");
}

// the arrow moves the row to the right
function scrollRow(button) {
  var row = button.previousElementSibling;
  row.scrollBy({ left: 300, behavior: "smooth" });
}

// "Add to the plan" button
// the plan is saved in localStorage so the Planning page can read it
function addToPlan(button) {
  var card = button.closest(".place-card");
  var placeName = card.querySelector(".place-main h3").innerText;

  var plan = JSON.parse(localStorage.getItem("plan")) || [];

  // don't add the same place twice
  for (var i = 0; i < plan.length; i++) {
    if (plan[i].name == placeName) {
      alert(placeName + " is already in your plan!");
      return;
    }
  }

  plan.push({ name: placeName, activities: [] });
  localStorage.setItem("plan", JSON.stringify(plan));

  if (confirm(placeName + " was added to your plan!\nGo to the Planning page?")) {
    window.location.href = "planning.html";
  }
}

// ========== Favorites (saved in Firestore) ==========
// the Firebase functions are in data.js
async function toggleFavorite(button) {
  if (!checkLogin()) return; // only logged in users can save favorites

  var card = button.closest(".place-card");
  var placeName = card.querySelector(".place-main h3").innerText;
  var isLiked = button.classList.contains("liked");

  try {
    if (isLiked) {
      await window.removeFavoriteFromFirebase(placeName);
      button.innerHTML = "&#9825;";    // empty heart
      button.classList.remove("liked");
    } else {
      await window.addFavoriteToFirebase(placeName);
      button.innerHTML = "&#9829;";    // full heart
      button.classList.add("liked");
    }
  } catch (error) {
    alert("We couldn't save your favorite (" + error.code + ").");
  }
}

// fill the hearts of the saved favorites
// (data.js calls this after the login is checked)
async function whenUserReady() {
  var favorites = await window.getFavoritesFromFirebase();
  var buttons = document.querySelectorAll(".fav-btn");

  for (var i = 0; i < buttons.length; i++) {
    var card = buttons[i].closest(".place-card");
    var placeName = card.querySelector(".place-main h3").innerText;

    if (favorites.indexOf(placeName) != -1) {
      buttons[i].innerHTML = "&#9829;";
      buttons[i].classList.add("liked");
    }
  }
}
