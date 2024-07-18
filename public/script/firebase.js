// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

import firebaseConfig from "./config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

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

document.addEventListener("DOMContentLoaded", function () {
  const content = new URLSearchParams(window.location.search).get("content");
  if (content === "register") {
    initRegister();
  }
});