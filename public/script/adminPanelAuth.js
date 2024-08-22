import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

import firebaseConfig from "./config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

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

  onAuthStateChanged(auth, async (user) => {
    console.log(user);
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      console.log(userDoc);
      if (userDoc.exists() && userDoc.data().role === "admin") {
        console.log("Welcome admin!");
        console.log(adminNavItem);
        headerNavContainer.insertAdjacentHTML("afterbegin", adminNavItem);
      } else {
        console.log("Hello user!");
      }
    }
  });
}
