// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirebaseFirestore } from "./firebaseInit.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// import firebaseConfig from "./config.js";
// import firebaseConfig from "./config/firebaseConfig.js";

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

export default async function displayUsername(userId) {
  try {
    const db = await getFirebaseFirestore();
    const docRef = doc(db, "users", userId);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      console.log(data);
      document.getElementById("displayUserName").textContent = data.userName;
    } else {
      console.log("No such document!");
      document.getElementById("displayUserName").textContent = "";
    }
  } catch (error) {
    console.log("Error getting document:", error);
  }
}
