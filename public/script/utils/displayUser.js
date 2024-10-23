import { db } from "../config/firebaseConfig.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

export default async function displayUsername(userId) {
  try {
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
    console.error("Error getting document:", error);
  }
}
