<div align="center">

# 🌿 TravIris

### Explore Jordan's Stories, Places, and Hidden Gems 🇯🇴

*Discover the Jordan beyond the postcards, and build your own trip day by day.*

<br>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

<br>

### 🌐 [Live Demo](https://YOUR-PROJECT-ID.web.app)

</div>

---

## 🌿 About the Project

Most travel websites show the same famous places: Petra, Wadi Rum, the Dead Sea.
**TravIris** helps tourists find the **hidden places** of Jordan too, like quiet canyons, forests, and old towns, and turns them into a **personal trip plan** in a few minutes.

> **The problem:** hidden places and local experiences are hard to find, and planning a trip means jumping between many websites.
>
> **Our solution:** one place to discover, plan, save, and book your trip through local travel offices.

---

## ✨ Features

| | Feature | Description |
|:-:|---|---|
| 🧭 | **Explore by Mood** | 4 categories: Seas & Valleys, Mountains & Desert, Forests & Nature, History & Heritage |
| 💎 | **Hidden & Famous Places** | Every category has hidden gems *and* famous spots, with location, price, activities, and services |
| ❤️ | **Favorites** | Save the places you love to your account |
| 🎟️ | **Trip Tickets** | Add places to your plan as travel tickets |
| 🖱️ | **Drag & Drop Days** | Change the order of your days by dragging the tickets |
| 🎯 | **Activities** | Pick activities for each day (hiking, camping, local food…) |
| 🗓️ | **Suggested Plan** | A day-by-day plan with real dates and an estimated total price |
| 💬 | **Contact a Travel Office** | Send your full plan on WhatsApp to a local office to book activities and hotels |
| 👤 | **Accounts & Profile** | Sign up, log in, see your saved trips, favorites, and travel stats |
| ⭐ | **Feedback** | Rate the website and read what other travelers say |
| 🎬 | **Animations** | Animated map, fade-up on scroll, and smooth hover effects |
| 📱 | **Responsive** | Works on desktop, laptop, and mobile |

---

## 🗺️ How It Works

1. 🏠 **Open TravIris** and choose what you are in the mood for.
2. 🧭 **Explore** hidden places and famous spots in that category.
3. 💎 **Click "More Info"** to see the location, price, activities, and services.
4. 🎟️ **Add to the plan**. Each place becomes a ticket in your Days Timeline.
5. 🎯 **Pick activities**, your dates, and the number of travellers, and drag the tickets to order your days.
6. 🗓️ **Get your Suggested Plan** with the dates and an estimated total price.
7. 💾 **Save it to your profile**, download it as a PDF, or 💬 **send it to a local travel office** on WhatsApp.

---

## 🔥 Firebase

TravIris uses **Firebase** as its backend:

| Service | What we use it for |
|---|---|
| 🔐 **Authentication** | Sign up and log in with email & password, email verification, password reset |
| 🗄️ **Cloud Firestore** | User profiles, saved trips, and favorite places |
| 🚀 **Hosting** | Publishing the website online |

### Database structure

```
users                         // collection
 └── {uid}                    // document ID = the user's UID
      ├── firstName, lastName, name, email
      ├── createdAt           // server timestamp
      ├── favorites: [ "Petra", "Wadi Rum" ]
      └── trips               // sub-collection
           └── {tripId}
                ├── start, end, people
                ├── days: [ { name: "Petra", activities: ["Hiking"] } ]
                ├── total
                └── createdAt
```

### 🔒 Security

- Every user can only read and change **their own** data (Firestore Security Rules in `firestore.rules`).
- Passwords are **never** saved in the database. They stay in Firebase Authentication.
- Forms are checked before sending (email format, password length, matching passwords).

---

## 🛠️ Built With

- **HTML** – page structure
- **CSS** – design, animations, and responsive layout
- **JavaScript** – interaction (tickets, drag & drop, popups, planning logic)
- **Firebase** – Authentication, Cloud Firestore, and Hosting
- [Font Awesome](https://fontawesome.com/) icons · [Poppins](https://fonts.google.com/specimen/Poppins) font

---

## 📁 Project Structure

```
travliris/
├── index.html                 Home
├── seas.html, desert.html,
│   forest.html, history.html  Categories
├── planning.html              Build your route
├── about.html                 About us + feedback
├── profile.html               User profile
├── login.html                 Login / Sign up
│
├── style.css, category.css, planning.css, about.css, profile.css, login.css
│
├── script.js                  Category pages (details, favorites, add to plan)
├── planning.js                Tickets, drag & drop, suggested plan, travel offices
├── places.js                  Places data (activities, prices)
├── profile.js                 Trips, favorites, profile picture
├── feedback.js                Feedback section
│
├── firebase.js                Firebase setup
├── login.js                   Sign up / log in (Authentication + Firestore)
├── profile-auth.js            Profile data and log out
├── data.js                    Trips and favorites (Firestore)
├── firestore.rules            Security Rules
├── firebase.json              Hosting settings
│
└── images/
```

---

## 🚀 Run It Yourself

**1. Clone the repository**
```bash
git clone https://github.com/raghadjaser06-Ghood/Traviris-project.git
```

**2. Add your Firebase config**

In the [Firebase Console](https://console.firebase.google.com/):
- **Authentication** → enable **Email/Password**
- **Firestore Database** → create a database, then paste `firestore.rules` in the **Rules** tab
- **Project settings** → copy your `firebaseConfig` into `firebase.js`

**3. Run it**

Open the folder in VS Code and start it with the **Live Server** extension.

**4. Deploy (optional)**
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only hosting --project traviris-6e755
```

---

## 👩‍💻 The Team

<table>
  <tr>
    <td align="center">🌸<br><b>Dyala Nafis</b></td>
    <td align="center">🌿<br><b>Raghad Jaser</b></td>
    <td align="center">🌙<br><b>Sara Sa'bi</b></td>
    <td align="center">⭐<br><b>Layan Khalil</b></td>
  </tr>
</table>

---

<div align="center">

Made with 💚 for **PixelSite 2.0**

*TravIris — because Jordan has more to show.*

</div>
