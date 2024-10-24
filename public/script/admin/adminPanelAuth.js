// import { getFirebaseAuth, getFirebaseFirestore } from "./firebaseInit.js";
import { auth, db } from "../config/firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { showCustomAlert } from "../utils/alert.js"

const adminNavItem = `
    <li class="nav-item">
        <a href="index.html?content=adminpanel" class="nav-link">Admin Panel</a>
    </li>
`;

export default async function adminPanelAuth() {
  const headerNavContainer = document.querySelector(".navbar-nav");
  if (!headerNavContainer) {
    console.error("Element with class 'navbar-nav' not found.");
    return;
  }

  try {
    onAuthStateChanged(auth, async (user) => {
      console.log(user);
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists() && userDoc.data().role === "admin") {
            const hasSeenWelcomeAlert = localStorage.getItem("hasSeenWelcomeAlert");

            if (!hasSeenWelcomeAlert) {
              showCustomAlert("Welcome admin!", "success");
              localStorage.setItem("hasSeenWelcomeAlert", "true");
            }

            headerNavContainer.insertAdjacentHTML("afterbegin", adminNavItem);
          } else {
            console.log("Hello user!");
          }
        } catch (error) {
          console.error("Error getting user document:", error);
        }
      }
    });
  } catch (error) {
    console.error("Error in adminPanelAuth:", error);
  }
}
