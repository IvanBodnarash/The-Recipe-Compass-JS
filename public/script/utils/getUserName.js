import { db } from "../config/firebaseConfig.js";
// import {
//   getAuth,
//   deleteUser,
// } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

export async function getUserName(usersRef, userId) {
  const userDoc = await getDoc(doc(usersRef, userId));
  console.log("hello!!!!");
  if (userDoc.exists()) {
    return userDoc.data().userName;
  } else {
    console.log(`User with ID ${userId} not found.`);
    return "Unknown";
  }
}

export async function getUserNameAdminPanel(userId) {
    // Check if userId exists
    if (!userId) {
      console.log("User ID is undefined or null.");
      return "Unknown";
    }
  
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data().userName;
      } else {
        console.log(`User with ID ${userId} not found.`);
        return "Unknown";
      }
    } catch (error) {
      console.error("Error fetching user name:", error);
      return "Unknown";
    }
  }
