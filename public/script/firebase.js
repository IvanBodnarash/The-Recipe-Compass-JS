// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  setDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

// import firebaseConfig from "./firebaseConfig.js";
import firebaseConfig from "./config.js";
import displayUsername from "./displayUser.js";
import initRegister from "./register.js";
import logIn from "./login.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

// Check if user is logged in
window.onload = function () {
  onAuthStateChanged(auth, function (user) {
    if (user) {
      displayUsername(user.uid);
      toggleAddRecipeButton(true);
    } else {
      toggleAddRecipeButton(false);
    }
  });

  // Initialize Logout
  const logout = document.getElementById("logoutBtn");
  if (logout) {
    logout.addEventListener("click", function () {
      signOut(auth);
      alert("Logout Successful");
      localStorage.removeItem("valid_recipe_user");
      window.location.href = "index.html";
    });
  } else {
    console.error("Element with id 'logoutBtn' not found");
  }
};

function toggleAddRecipeButton(isEnabled) {
  const addRecipeButton = document.getElementById("addRecipeBtn");
  if (addRecipeButton) {
    addRecipeButton.href = isEnabled
      ? "index.html?content=newrecipe"
      : "index.html?content=login";
  } else {
    console.error("Element with id 'addRecipeBtn' not found");
  }
}

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  const content = new URLSearchParams(window.location.search).get("content");
  if (content === "register") {
    initRegister();
  } else if (content === "login") {
    logIn();
  }
});
