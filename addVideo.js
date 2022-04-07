// Funny Videos
/*^*^*^*^*^*^*^*
addVideo.js
Script to add video to Firebase database.
*^*^*^*^*^*^*^*/

import {firebaseConfig} from "./firebaseConfig.js";
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import {collection, addDoc, getFirestore, doc, getDoc, setDoc} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

const firebase = initializeApp(firebaseConfig);
const database = getFirestore(firebase);
(async () => {
  const docRef = doc(database, "funny-videos", "videos");
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  console.log(_GET["name"]);
  await setDoc(docRef, {
    highScore: data.highScore + 1
  });
})();
