// ========== Feedback ==========
// for now saved in localStorage (later: Firebase, so everyone can see it)
var feedbackList = JSON.parse(localStorage.getItem("feedback")) || [];

function sendFeedback() {
  var name = document.getElementById("fbName").value.trim();
  var rating = Number(document.getElementById("fbRating").value);
  var message = document.getElementById("fbMessage").value.trim();

  // check the inputs
  if (name == "" || message == "") {
    alert("Please write your name and your message.");
    return;
  }

  // add the new feedback at the top
  feedbackList.unshift({ name: name, rating: rating, message: message });
  localStorage.setItem("feedback", JSON.stringify(feedbackList));

  // clear the form
  document.getElementById("fbName").value = "";
  document.getElementById("fbMessage").value = "";

  alert("Thank you for your feedback!");
  showFeedback();
}

function showFeedback() {
  var list = document.getElementById("feedbackList");
  list.innerHTML = "";

  if (feedbackList.length == 0) {
    list.innerHTML = '<p class="no-feedback">No feedback yet. Be the first!</p>';
    document.getElementById("fbAverage").innerText = "";
    return;
  }

  var total = 0;

  for (var i = 0; i < feedbackList.length; i++) {
    var item = feedbackList[i];
    total += item.rating;

    // make the stars text, like ★★★★
    var stars = "";
    for (var j = 0; j < item.rating; j++) {
      stars += "★";
    }

    // we use textContent for the name and message (text written by users),
    // so if someone writes HTML code in the message it shows as normal text
    var card = document.createElement("div");
    card.className = "feedback-card";
    card.innerHTML =
      '<p class="fb-stars">' + stars + '</p>' +
      '<p class="fb-message"></p>' +
      '<p class="fb-name"></p>';

    card.querySelector(".fb-message").textContent = item.message;
    card.querySelector(".fb-name").textContent = "- " + item.name;

    list.appendChild(card);
  }

  // average rating, one number after the dot
  var average = (total / feedbackList.length).toFixed(1);
  document.getElementById("fbAverage").innerText =
    "★ " + average + " (" + feedbackList.length + ")";
}

showFeedback();
