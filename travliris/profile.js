// ========== Profile page ==========
// the account part (name, email, log out) is in profile-auth.js (Firebase).
// this file has the picture, the trips, and the favorites.

// ========== Profile picture ==========
// saved on this device, one picture for each account (the key has the UID)
var image = "";

function imageKey() {
  return "profileImage_" + window.currentUser.uid;
}

function showImage() {
  var img = document.getElementById("userPic");
  var icon = document.getElementById("defaultPic");

  if (image == "") {
    img.style.display = "none";
    icon.style.display = "block";
  } else {
    img.src = image;
    img.style.display = "block";
    icon.style.display = "none";
  }
}

function uploadImage() {
  var file = document.getElementById("picInput").files[0];
  if (!file) return;

  // FileReader turns the image into text so we can save it
  var reader = new FileReader();

  reader.onload = function () {
    image = reader.result;

    try {
      localStorage.setItem(imageKey(), image);
    } catch (error) {
      alert("This image is too big, please choose a smaller one.");
      image = "";
    }

    showImage();
  };

  reader.readAsDataURL(file);
}

function removeImage() {
  image = "";
  document.getElementById("picInput").value = "";
  localStorage.removeItem(imageKey());
  showImage();
}

// ========== Trips (from Firestore) ==========
// the Firebase functions are in data.js
var trips = [];
var favorites = [];

// data.js calls this after the login is checked
async function whenUserReady() {
  image = localStorage.getItem(imageKey()) || "";
  showImage();

  try {
    trips = await window.getTripsFromFirebase();
    favorites = await window.getFavoritesFromFirebase();
  } catch (error) {
    alert("We couldn't load your trips (" + error.code + ").");
  }
  showTrips();
  showFavorites();
}

function showTrips() {
  var list = document.getElementById("tripsList");
  list.innerHTML = "";

  if (trips.length == 0) {
    list.innerHTML = '<p class="no-trips">You have no saved trips yet. <a href="planning.html">Build your route</a></p>';
  }

  for (var i = 0; i < trips.length; i++) {
    var trip = trips[i];

    // the days of the trip
    var days = "";
    for (var j = 0; j < trip.days.length; j++) {
      var activities = trip.days[j].activities.join(", ");
      if (activities == "") activities = "Free exploring";

      days += "<li><b>Day " + (j + 1) + " - " + trip.days[j].name + ":</b> " + activities + "</li>";
    }

    var word = "travellers";
    if (trip.people == 1) word = "traveller";

    // the dates (if the user chose them)
    var dates = "No dates chosen";
    if (trip.start != "" && trip.end != "") {
      dates = trip.start + " → " + trip.end;
    }

    list.innerHTML +=
      '<div class="trip-card">' +
        '<div class="trip-head">' +
          '<h3>Trip ' + (i + 1) + ' <span>(' + trip.days.length + (trip.days.length == 1 ? ' day' : ' days') + ')</span></h3>' +
          '<button class="delete-trip" onclick="deleteTrip(' + i + ')">Delete</button>' +
        '</div>' +
        '<p class="trip-info"><i class="fa-regular fa-calendar"></i> ' + dates +
          ' &nbsp;|&nbsp; <i class="fa-solid fa-user-group"></i> ' + trip.people + ' ' + word +
          ' &nbsp;|&nbsp; ' + trip.total + '</p>' +
        '<ul>' + days + '</ul>' +
      '</div>';
  }

  showStats();
}

async function deleteTrip(index) {
  if (!confirm("Delete this trip?")) return;

  try {
    await window.deleteTripFromFirebase(trips[index].id);
    trips.splice(index, 1);
    showTrips();
  } catch (error) {
    alert("We couldn't delete the trip (" + error.code + ").");
  }
}

// Total Trips + Places Visited (each place counted one time)
function showStats() {
  var places = [];

  for (var i = 0; i < trips.length; i++) {
    for (var j = 0; j < trips[i].days.length; j++) {
      var name = trips[i].days[j].name;
      if (places.indexOf(name) == -1) {
        places.push(name);
      }
    }
  }

  document.getElementById("totalTrips").innerText = trips.length;
  document.getElementById("placesVisited").innerText = places.length;
}

// ========== Favorites (from Firestore) ==========
function showFavorites() {
  var list = document.getElementById("favoritesList");
  list.innerHTML = "";

  if (favorites.length == 0) {
    list.innerHTML = '<p class="no-trips">No favorites yet. Tap the &#9825; on any place in <a href="index.html#categories">Explore</a>.</p>';
  }

  for (var i = 0; i < favorites.length; i++) {
    list.innerHTML +=
      '<div class="fav-item">' +
        '<span>&#9829; ' + favorites[i] + '</span>' +
        '<button class="delete-trip" onclick="removeFavorite(' + i + ')">Remove</button>' +
      '</div>';
  }
}

async function removeFavorite(index) {
  try {
    await window.removeFavoriteFromFirebase(favorites[index]);
    favorites.splice(index, 1);
    showFavorites();
  } catch (error) {
    alert("We couldn't remove the favorite (" + error.code + ").");
  }
}

