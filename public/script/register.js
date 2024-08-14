// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
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

// Initialize Register
export default function initRegister() {
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
      const role = "user";

      // if (!validatePassword(password)) {
      //   alert("Your password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character");
      //   return;
      // }

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
          saveUserData(user.uid, userName, firstName, lastName, email, role);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert("Error: " + errorMessage + " " + errorCode);
        });
    });
  } else {
    console.error("Element with id 'registerBtn' not found");
  }
}

// Validate Email
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// // Validate Password
// function validatePassword(password) {
//   const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//   return re.test(password);
// }

// Save User Data
function saveUserData(userId, userName, firstName, lastName, email, role) {
  // Logic to save user data to database(Firestore)
  setDoc(doc(db, "users", userId), {
    userName: userName,
    firstName: firstName,
    lastName: lastName,
    email: email,
    role: role,
  })
    .then(() => {
      console.log("User data saved successfully");
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Error saving user data: ", error);
    });
}