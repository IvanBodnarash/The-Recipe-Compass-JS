import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { auth, db } from "../config/firebaseConfig.js";
import { showCustomAlert } from "../utils/alert.js";

// Initialize Register
export default async function initRegister() {
  try {
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

        // Compare Passwords
        if (password != password2) {
          showCustomAlert("Passwords do not match", "error");
          return;
        }

        if (!validateEmail(email)) {
          showCustomAlert("Please enter a valid email address", "error");
          return;
        }

        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            showCustomAlert("Account Creating...", "info");
            // Saving user data
            saveUserData(
              db,
              user.uid,
              userName,
              firstName,
              lastName,
              email,
              role
            );
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            showCustomAlert(`Error: ${errorMessage} ${errorCode}`, "error");
          });
      });
    } else {
      console.error("Element with id 'registerBtn' not found");
    }
  } catch (error) {
    console.error("Register error:", error);
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
function saveUserData(db, userId, userName, firstName, lastName, email, role) {
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
