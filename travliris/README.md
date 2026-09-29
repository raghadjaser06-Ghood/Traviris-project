# TravIris 🌿

**Explore Jordan's stories, places, and hidden gems.**

TravIris is a travel website that helps tourists discover hidden places in Jordan, not only the famous ones, and build their own trip plan day by day.

## Live Demo

🔗 **https://YOUR-PROJECT-ID.web.app**

## Features

- **Explore by mood:** 4 categories (Seas & Valleys, Mountains & Desert, Forests & Nature, History & Heritage). Each one has hidden places and famous spots.
- **Place details:** click "More Info" to see the location, price, activities, and services.
- **Favorites:** save the places you like with the ♥ button (saved in Firestore).
- **Trip planning:**
  - Add places to your plan as tickets.
  - Choose activities for each day.
  - Drag and drop the tickets to change the order of the days.
  - Pick your dates and the number of travellers.
- **Suggested plan:** a day-by-day plan with the dates and an estimated total price. Save it to your account or as a PDF.
- **Contact a travel office:** send your plan on WhatsApp to a local office to book activities and hotels.
- **Login & Sign up:** email and password accounts with Firebase Authentication, email verification, and password reset.
- **Profile:** your saved trips, your favorites, and your stats.
- **Feedback:** rate the website and read what other travelers say.
- **Animations:** CSS animations, including fade-up on scroll and an animated map.
- **Responsive:** works on desktop and mobile.

## Pages

| Page | File |
|------|------|
| Home | `index.html` |
| Categories | `seas.html`, `desert.html`, `forest.html`, `history.html` |
| Planning | `planning.html` |
| About (with feedback) | `about.html` |
| Profile | `profile.html` |
| Login / Sign up | `login.html` |

## Built With

- HTML
- CSS
- JavaScript
- [Firebase](https://firebase.google.com/) – Authentication, Cloud Firestore, and Hosting
- [Font Awesome](https://fontawesome.com/) (icons)
- [Google Fonts – Poppins](https://fonts.google.com/specimen/Poppins)

## Project Structure

```
travliris/
├── index.html, seas.html, ...   pages
├── *.css                        styles
├── script.js, planning.js, ...  page logic (JavaScript)
├── places.js                    places data (activities, prices)
├── firebase.js                  Firebase setup (config)
├── login.js, profile-auth.js    Firebase Authentication (sign up, login, profile)
├── data.js                      Cloud Firestore (trips and favorites)
├── firestore.rules              Firestore Security Rules
├── firebase.json                Firebase Hosting settings
└── images/
```

## How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/raghadjaser06-Ghood/Traviris-project.git
   ```
2. Open the folder in VS Code.
3. Run it with the **Live Server** extension (right click `index.html` → *Open with Live Server*).

> Live Server is needed because the Firebase files use JavaScript modules (`import`).

## Firebase Setup

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. **Authentication** → Get started → Sign-in method → enable **Email/Password**.
3. **Firestore Database** → Create database (Production mode).
4. **Firestore → Rules** → paste the content of `firestore.rules` → Publish.
5. **Project settings → Your apps → Web app** → copy the `firebaseConfig` and paste it in `firebase.js`.

### Firestore data

```
users                        // collection
  {uid}                      // document ID = the user's UID from Authentication
    firstName: "Raghad"
    lastName: "Jaser"
    name: "Raghad Jaser"
    email: "raghad@gmail.com"
    createdAt: Timestamp
    favorites: ["Petra", "Wadi Rum"]
    trips                    // sub-collection
      {tripId}               // automatic ID
        start: "2026-10-10"
        end: "2026-10-12"
        people: 2
        days: [ { name: "Petra", activities: ["Hiking"] } ]
        total: "60–95 JOD / person"
        createdAt: Timestamp
```

Passwords are never saved in Firestore. They stay in Firebase Authentication.

### Deploy (Firebase Hosting)

```bash
npm install -g firebase-tools
firebase login
firebase deploy --project YOUR-PROJECT-ID
```

This uploads the website and the Firestore rules, and gives you the link: `https://YOUR-PROJECT-ID.web.app`.

## Notes

- Accounts, profiles, trips, and favorites are saved in **Firebase**, so every user sees only their own data.
- The plan you are still building, the profile picture, and the feedback are saved in the browser (**localStorage**).
- Some prices are approximate.
- The travel offices in the Planning page are examples.

## Team

- Dyala Nafis
- Raghad Jaser
- Sara Sa'bi
- Layan Khalil
