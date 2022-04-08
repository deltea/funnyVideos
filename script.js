// Funny Videos
/*^*^*^*^*^*^*^*
script.js
The main code for Funny Videos.
*^*^*^*^*^*^*^*/

import {firebaseConfig} from "./firebaseConfig.js";
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import {collection, addDoc, getFirestore, doc, getDoc, setDoc} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import {getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

// ---------- Data ----------
const firebase = initializeApp(firebaseConfig);
const database = getFirestore(firebase);
const auth = getAuth();
let data = [];
let searchBar = document.getElementById("searchBar");
(async () => {
  const dataDoc = doc(database, "funny-videos", "videos");
  const dataSnap = await getDoc(dataDoc);
  data = dataSnap.data();

  // ---------- Go! ----------
  Object.entries(data).forEach(video => {
    let data = video[1];
    const rating = data.rating;
    const youtubeId = data.youtubeId;
    const name = video[0];
    let color = "";

    // Check what color
    if (rating >= 4) {
      color = "bg-success";
    } else if (rating <= 1) {
      color = "bg-danger";
    } else {
      color = "bg-warning";
    }

    // Add the ratings
    let ratingElements = [];
    for (var i = 0; i < rating; i++) {
      const documentElement = document.createElement(null);
      documentElement.innerHTML = `<div title="${rating}" class="${color} rating shadow"></div>`;
      ratingElements.push(documentElement);
    }
    for (var i = 0; i < 5 - rating; i++) {
      const documentElement = document.createElement(null);
      documentElement.innerHTML = `<div title="${rating}" class="notfilled rating shadow"></div>`;
      ratingElements.push(documentElement);
    }

    // Add the name
    let nameElement = document.createElement(null);
    nameElement.innerHTML = `<span class="name">${name}:</span>`;

    // Add the video, duh
    let videoElement = document.createElement(null);
    videoElement.innerHTML = `<iframe width="853" height="480" class="shadow-lg" src="https://www.youtube.com/embed/${youtubeId}?controls=0" frameborder="0" allowfullscreen></iframe>`;

    // Assemble!
    const header = document.createElement("h2");
    document.body.appendChild(header);
    header.appendChild(nameElement);
    ratingElements.forEach(element => {
      header.appendChild(element);
    });
    document.body.appendChild(document.createElement("br"));
    document.body.appendChild(videoElement);
    document.body.appendChild(document.createElement("hr"));
  });
})();
onAuthStateChanged(auth, (user) => {
  if (user) {
    let profile = document.createElement(null);
    profile.innerHTML = "<img src='https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d' alt='Profile Image' width='50' class='profileImg'>";
    document.getElementById("signUp").removeChild(document.getElementById("signUpButton"));
    document.getElementById("signUp").appendChild(profile);
  } else {
    console.log("Not logged in.");
  }
});
