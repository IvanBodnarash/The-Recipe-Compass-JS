import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

import firebaseConfig from "./config.js";
// import firebaseConfig from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function displayUsername(userId) {
  const docRef = doc(db, "users", userId);
  getDoc(docRef)
    .then((doc) => {
      if (doc.exists()) {
        const data = doc.data();
        console.log(data);
        document.getElementById("displayUserName").textContent = data.userName;
      } else {
        console.log("No such document!");
        document.getElementById("displayUserName").textContent = "";
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}
