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

// ========== The plan ==========
// plan is a list of days, each day = { name: "Petra", activities: ["Hiking"] }
var plan = JSON.parse(localStorage.getItem("plan")) || [];

var dragIndex = null;      // the ticket we are dragging
var activitiesIndex = null; // the ticket we are adding activities to

function savePlanToStorage() {
  localStorage.setItem("plan", JSON.stringify(plan));
}

// find a place (from places.js) by its name
function findPlace(name) {
  for (var i = 0; i < places.length; i++) {
    if (places[i].name == name) {
      return places[i];
    }
  }
  return null;
}

// check if a place is already in the plan
function isInPlan(name) {
  for (var i = 0; i < plan.length; i++) {
    if (plan[i].name == name) {
      return true;
    }
  }
  return false;
}

// ========== Show the tickets ==========
function showTickets() {
  var tickets = document.getElementById("tickets");
  tickets.innerHTML = "";

  for (var i = 0; i < plan.length; i++) {
    tickets.innerHTML +=
      '<div class="ticket" draggable="true" data-index="' + i + '">' +
        '<div class="ticket-main">' +
          '<button class="ticket-remove" onclick="removeTicket(' + i + ')">&times;</button>' +
          '<h3>' + plan[i].name + '</h3>' +
          '<button class="ticket-btn" onclick="openActivities(' + i + ')">Add to your day</button>' +
        '</div>' +
        '<div class="ticket-stub"><span>Day ' + (i + 1) + '</span></div>' +
      '</div>';
  }

  // show the message if the plan is empty
  if (plan.length == 0) {
    document.getElementById("emptyMsg").style.display = "block";
  } else {
    document.getElementById("emptyMsg").style.display = "none";
  }

  addDragEvents();
}

function removeTicket(index) {
  plan.splice(index, 1);
  savePlanToStorage();
  showTickets();
}

// ========== Drag and drop ==========
function addDragEvents() {
  var allTickets = document.querySelectorAll(".ticket");

  for (var i = 0; i < allTickets.length; i++) {
    var ticket = allTickets[i];

    ticket.addEventListener("dragstart", function () {
      dragIndex = Number(this.dataset.index);
      this.classList.add("dragging");
    });

    ticket.addEventListener("dragend", function () {
      this.classList.remove("dragging");
    });

    ticket.addEventListener("dragover", function (e) {
      e.preventDefault(); // needed so we can drop here
      this.classList.add("drag-over");
    });

    ticket.addEventListener("dragleave", function () {
      this.classList.remove("drag-over");
    });

    ticket.addEventListener("drop", function (e) {
      e.preventDefault();
      var dropIndex = Number(this.dataset.index);

      // take the dragged day out, then put it in the new place
      var movedDay = plan.splice(dragIndex, 1)[0];
      plan.splice(dropIndex, 0, movedDay);

      savePlanToStorage();
      showTickets(); // the "Day 1, Day 2..." numbers update here
    });
  }
}

// ========== Popups ==========
function openPopup(id) {
  document.getElementById(id).classList.add("show");
}

function closePopup(id) {
  document.getElementById(id).classList.remove("show");
}

// ----- Add Trip popup -----
function openAddTrip() {
  fillDestinations();
  openPopup("addTripPopup");
}

// show only the places of the chosen category that are NOT in the plan
function fillDestinations() {
  var category = document.getElementById("categorySelect").value;
  var select = document.getElementById("destinationSelect");
  select.innerHTML = "";

  for (var i = 0; i < places.length; i++) {
    if (places[i].category == category && !isInPlan(places[i].name)) {
      select.innerHTML += "<option>" + places[i].name + "</option>";
    }
  }

  if (select.innerHTML == "") {
    select.innerHTML = '<option value="">All places are in your plan</option>';
  }
}

function addTrip() {
  var name = document.getElementById("destinationSelect").value;

  if (name == "") {
    alert("Please choose another category.");
    return;
  }

  plan.push({ name: name, activities: [] });
  savePlanToStorage();
  showTickets();
  closePopup("addTripPopup");
}

// ----- Add Activities popup -----
function openActivities(index) {
  activitiesIndex = index;
  var place = findPlace(plan[index].name);
  var list = document.getElementById("activitiesList");

  document.getElementById("activitiesPlace").innerText = plan[index].name;
  list.innerHTML = "";

  for (var i = 0; i < place.activities.length; i++) {
    var activity = place.activities[i];
    var checked = "";

    // keep the old choices checked
    if (plan[index].activities.indexOf(activity) != -1) {
      checked = "checked";
    }

    list.innerHTML +=
      '<label><input type="checkbox" value="' + activity + '" ' + checked + '> ' + activity + '</label>';
  }

  openPopup("activitiesPopup");
}

function saveActivities() {
  var boxes = document.querySelectorAll("#activitiesList input");
  var chosen = [];

  for (var i = 0; i < boxes.length; i++) {
    if (boxes[i].checked) {
      chosen.push(boxes[i].value);
    }
  }

  plan[activitiesIndex].activities = chosen;
  savePlanToStorage();
  showTickets();
  closePopup("activitiesPopup");
}

// ----- Create Your Trip? popup -----
function openConfirm() {
  if (plan.length == 0) {
    alert("Please add at least one place to your plan.");
    return;
  }

  var text = "You're about to create a personalized " + plan.length +
    "-day trip based on your selected destinations and activities.";

  // compare the number of days in the dates with the number of places
  var tripDays = countTripDays();

  if (tripDays == -1) {
    alert("The end date can't be before the start date.");
    return;
  }

  if (tripDays > 0 && tripDays != plan.length) {
    text += "\n\nNote: your dates are " + tripDays + " days, but your plan has " +
      plan.length + " places.";
  }

  document.getElementById("confirmText").innerText = text;
  openPopup("confirmPopup");
}

// ========== Dates ==========

// the end date can't be before the start date
function setEndDateMin() {
  var start = document.getElementById("startDate").value;
  document.getElementById("endDate").min = start;
}

// how many days between start and end (0 = dates not chosen, -1 = wrong dates)
function countTripDays() {
  var start = document.getElementById("startDate").value;
  var end = document.getElementById("endDate").value;

  if (start == "" || end == "") {
    return 0;
  }

  var startDate = new Date(start + "T00:00");
  var endDate = new Date(end + "T00:00");
  var oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day

  var days = Math.round((endDate - startDate) / oneDay) + 1;

  if (days < 1) {
    return -1;
  }
  return days;
}

// the real date of day number i (Day 1 = start date)
function getDayDate(i) {
  var start = document.getElementById("startDate").value;

  if (start == "") {
    return "";
  }

  var date = new Date(start + "T00:00");
  date.setDate(date.getDate() + i);

  return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

// ========== Adults & Children ==========
function changeCount(id, number) {
  var span = document.getElementById(id);
  var count = Number(span.innerText) + number;

  if (id == "adults" && count < 1) count = 1;   // at least 1 adult
  if (id == "children" && count < 0) count = 0;

  span.innerText = count;
}

// ========== Suggested Plan ==========
function createTrip() {
  closePopup("confirmPopup");

  var daysList = document.getElementById("daysList");
  var totalMin = 0;
  var totalMax = 0;
  daysList.innerHTML = "";

  for (var i = 0; i < plan.length; i++) {
    var place = findPlace(plan[i].name);
    var activities = plan[i].activities;

    // if the user didn't choose, show the first 2 activities of the place
    if (activities.length == 0) {
      activities = place.activities.slice(0, 2);
    }

    var items = "";
    for (var j = 0; j < activities.length; j++) {
      items += "<li>" + activities[j] + "</li>";
    }

    daysList.innerHTML +=
      '<div class="day">' +
        '<h3>Day ' + (i + 1) + ' - ' + plan[i].name + '</h3>' +
        '<p class="day-date">' + getDayDate(i) + '</p>' +
        '<ul>' + items + '</ul>' +
      '</div>';

    totalMin += place.priceMin;
    totalMax += place.priceMax;
  }

  var people = Number(document.getElementById("adults").innerText) +
               Number(document.getElementById("children").innerText);

  document.getElementById("totalPrice").innerText =
    totalMin + "–" + totalMax + " JOD / person";

  var word = "travellers";
  if (people == 1) word = "traveller";

  document.getElementById("totalGroup").innerText =
    "For " + people + " " + word + ": " + (totalMin * people) + "–" + (totalMax * people) + " JOD";

  var suggested = document.getElementById("suggested");
  suggested.style.display = "block";
  suggested.scrollIntoView({ behavior: "smooth" });
}

// save the whole trip in Firestore, so it shows in the Profile page ("My Trip")
async function savePlan() {
  if (!checkLogin()) return; // only logged in users can save trips

  var people = Number(document.getElementById("adults").innerText) +
               Number(document.getElementById("children").innerText);

  var trip = {
    start: document.getElementById("startDate").value,
    end: document.getElementById("endDate").value,
    people: people,
    days: plan,
    total: document.getElementById("totalPrice").innerText
  };

  // save in Firestore (the function is in data.js)
  try {
    await window.saveTripToFirebase(trip);
  } catch (error) {
    alert("We couldn't save your trip (" + error.code + "). Please try again.");
    return;
  }

  if (confirm("Your trip was saved!\nGo to your profile to see it?")) {
    window.location.href = "profile.html";
  }
}

// ========== Contact a Travel Office ==========
// EXAMPLES: change the names and numbers to real offices
// (phone number with the country code, without + or 0 at the start)
var offices = [
  { name: "Petra Local Tours (Example)", city: "Wadi Musa", phone: "962790000001" },
  { name: "Rum Desert Trips (Example)",  city: "Wadi Rum",  phone: "962790000002" },
  { name: "Amman Travel Office (Example)", city: "Amman",   phone: "962790000003" }
];

// write the plan as a message for WhatsApp
function buildMessage() {
  var message = "Hello, I found you on TravIris and I would like to arrange this trip:\n\n";

  var start = document.getElementById("startDate").value;
  var end = document.getElementById("endDate").value;
  if (start != "" && end != "") {
    message += "Dates: " + start + " to " + end + "\n";
  }

  message += "Adults: " + document.getElementById("adults").innerText +
    ", Children: " + document.getElementById("children").innerText + "\n\n";

  for (var i = 0; i < plan.length; i++) {
    var activities = plan[i].activities.join(", ");
    if (activities == "") activities = "any activities";

    message += "Day " + (i + 1) + " - " + plan[i].name + ": " + activities + "\n";
  }

  message += "\nCan you help me book the activities and hotels? Thank you!";
  return message;
}

function openOffices() {
  var list = document.getElementById("officesList");
  var message = encodeURIComponent(buildMessage()); // make the text safe for a link
  list.innerHTML = "";

  for (var i = 0; i < offices.length; i++) {
    list.innerHTML +=
      '<div class="office">' +
        '<div>' +
          '<h3>' + offices[i].name + '</h3>' +
          '<p><i class="fa-solid fa-location-dot"></i> ' + offices[i].city + '</p>' +
        '</div>' +
        '<div class="office-buttons">' +
          '<a class="office-btn" target="_blank" onclick="saveContact(' + i + ', \'WhatsApp\')" ' +
            'href="https://wa.me/' + offices[i].phone + '?text=' + message + '">' +
            '<i class="fa-brands fa-whatsapp"></i> WhatsApp</a>' +
          '<a class="office-btn light" onclick="saveContact(' + i + ', \'Call\')" ' +
            'href="tel:+' + offices[i].phone + '">' +
            '<i class="fa-solid fa-phone"></i> Call</a>' +
        '</div>' +
      '</div>';
  }

  openPopup("officesPopup");
}

// save every contact request (so we can count them)
function saveContact(index, type) {
  var contacts = JSON.parse(localStorage.getItem("contacts")) || [];

  contacts.push({
    office: offices[index].name,
    type: type,
    days: plan.length,
    date: new Date().toLocaleString()
  });

  localStorage.setItem("contacts", JSON.stringify(contacts));
}

// ========== Start ==========
// the start date can't be before today
document.getElementById("startDate").min = new Date().toISOString().split("T")[0];

showTickets();
