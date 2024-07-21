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
  setDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

import firebaseConfig from "./config.js";
import displayUsername from "./displayUser.js";
import initRegister from "./register.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

// Check if user is logged in
window.onload = function () {
  onAuthStateChanged(auth, function (user) {
    if (user) {
      displayUsername(user.uid);
    }
  });

  const logout = document.getElementById("logoutBtn");
  if (logout) {
    logout.addEventListener("click", function () {
      signOut(auth);
    });
  } else {
    console.error("Element with id 'logoutBtn' not found");
  }
};

// Initialize Login
export function logIn() {
  // Submit Button
  const login = document.getElementById("loginBtn");

  if (login) {
    login.addEventListener("click", function (event) {
      event.preventDefault();
      // Inputs
      const email = document.getElementById("userId").value;
      const password = document.getElementById("pass").value;
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          alert("Login Successful");
          localStorage.setItem("valid_recipe_user", user.uid);
          window.location.href = "index.html";
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert("Error: " + errorMessage);
        });
    });
  } else {
    console.error("Element with id 'loginBtn' not found");
  }
}

// Initialize Logout
export function logout() {
  signOut(auth)
    .then(() => {
      alert("Logout Successful");
      localStorage.removeItem("valid_recipe_user");
    })
    .catch((error) => {
      console.log(error);
    });
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
