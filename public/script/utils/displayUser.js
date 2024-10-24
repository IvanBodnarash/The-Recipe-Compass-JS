import { db } from "../config/firebaseConfig.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

export default async function displayUsername(userId) {
  const cachedUserName = localStorage.getItem("userName");
  if (cachedUserName) {
    document.getElementById("displayUserName").textContent = cachedUserName;
    return;
  }

  try {
    const docRef = doc(db, "users", userId);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      const userName = data.userName;

      localStorage.setItem("userName", userName);

      document.getElementById("displayUserName").textContent = userName;
    } else {
      console.log("No such document!");
      document.getElementById("displayUserName").textContent = "";
    }
  } catch (error) {
    console.error("Error getting document:", error);
  }
}
