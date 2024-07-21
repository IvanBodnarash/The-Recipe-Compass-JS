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

// Validate Email
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Display Username in Header
function displayUsername(userId) {
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

// Initialize Register
export function initRegister() {
  // Submit Button
  const register = document.getElementById("registerBtn");

  if (register) {
    register.addEventListener("click", function (event) {
      event.preventDefault();

      // Inputs
      const userName = document.getElementById("userName").value;
      const firstName = document.getElementById("firstName").value;
      const lastName = document.getElementById("lastName").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const password2 = document.getElementById("password2").value;

      // Compare Passwords
      if (password != password2) {
        alert("Passwords do not match");
        return;
      }

      if (!validateEmail(email)) {
        alert("Please enter a valid email address");
        return;
      }

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          alert("Account Creating...");
          // Saving user data
          saveUserData(user.uid, userName, firstName, lastName, email);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert("Error: " + errorMessage);
        });
    });
  } else {
    console.error("Element with id 'registerBtn' not found");
  }
}

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

// Save User Data
function saveUserData(userId, userName, firstName, lastName, email) {
  // Logic to save user data to database(Firestore)
  setDoc(doc(db, "users", userId), {
    userName: userName,
    firstName: firstName,
    lastName: lastName,
    email: email,
  })
    .then(() => {
      console.log("User data saved successfully");
    })
    .catch((error) => {
      console.error("Error saving user data: ", error);
    });
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
