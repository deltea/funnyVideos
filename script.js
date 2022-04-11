// Funny Videos
/*^*^*^*^*^*^*^*
script.js
The main code for Funny Videos.
*^*^*^*^*^*^*^*/

import {firebaseConfig} from "./firebaseConfig.js";
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import {collection, addDoc, getFirestore, doc, getDoc, updateDoc} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

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

    // Add the likes
    let likeElement = document.createElement("p");
    likeElement.setAttribute("class", "likeButton");
    likeElement.innerText = "🤍";
    onAuthStateChanged(auth, (user) => {
      (async () => {
        const usersDoc = doc(database, "funny-videos", "users");
        const usersSnap = await getDoc(usersDoc);
        const data = usersSnap.data();
        const currentUserLikes = data[auth.currentUser.uid].likes;
        if (currentUserLikes.includes(name)) {
          likeElement.liked = true;
          likeElement.innerText = "❤️";
        } else {
          likeElement.liked = false;
          likeElement.innerText = "🤍";
        }
      })();
    });
    likeElement.onclick = () => {
      onAuthStateChanged(auth, (user) => {
        (async () => {
          const usersDoc = doc(database, "funny-videos", "users");
          const usersSnap = await getDoc(usersDoc);
          data = usersSnap.data();
          let likesAdded = data[auth.currentUser.uid].likes;
          if (likeElement.liked) {
            likeElement.liked = false;
            likeElement.innerText = "🤍";
            likesAdded.splice(likesAdded.indexOf(name), 1);
          } else {
            likeElement.liked = true;
            likeElement.innerText = "❤️";
            likesAdded.push(name);
          }
          await updateDoc(usersDoc, {
            [auth.currentUser.uid]: {
              likes: likesAdded
            }
          });
        })();
      });
    }

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
    header.appendChild(likeElement);
    document.body.appendChild(document.createElement("br"));
    document.body.appendChild(videoElement);
    document.body.appendChild(document.createElement("hr"));
  });
})();
onAuthStateChanged(auth, (user) => {
  let signUpDiv = document.getElementById("signUp");
  if (user) {
    let profile = document.createElement(null);
    profile.innerHTML = `<span class='username'>${user.displayName}</span><a href='#' id='profileImg'><img src='${user.photoURL}' alt='Profile Image' width='50' class='profileImg'></a><button class='logOutButton btn btn-primary' id='logOutButton'>Log Out</button>`;
    signUpDiv.appendChild(profile);
    document.getElementById("logOutButton").onclick = () => {
      signOut(auth).then(() => {
        signUpDiv.removeChild(profile);
      }).catch((error) => {
        console.log(error.message);
      });
    }
  } else {
    let signUpButton = document.createElement(null);
    let addVideoButton = document.getElementById("addVideoButton");
    signUpButton.innerHTML = "<a href='signUp.html' class='btn btn-primary' id='signUpButton'>Sign Up</a>";
    signUpDiv.appendChild(signUpButton);
    document.body.removeChild(addVideoButton);
  }
});
