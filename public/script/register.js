// import { auth, createUserWithEmailAndPassword, saveUserData } from "./firebase.js";

import { auth, db } from "./firebase";

// export function initRegister() {
//   const register = document.getElementById("registerBtn");

//   if (register) {
//     register.addEventListener("click", function (event) {
//       event.preventDefault();

//       // Inputs
//       const userName = document.getElementById("userName").value;
//       const firstName = document.getElementById("firstName").value;
//       const lastName = document.getElementById("lastName").value;
//       const email = document.getElementById("email").value;
//       const password = document.getElementById("password").value;
//       const password2 = document.getElementById("password2").value;

//       if (password !== password2) {
//         alert("Passwords do not match");
//         return;
//       }

//       const emailRegex =
//         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//       if (!emailRegex.test(email)) {
//         alert("Invalid email format");
//         return;
//       }

//       createUserWithEmailAndPassword(auth, email, password)
//         .then((userCredential) => {
//           // Signed in
//           const user = userCredential.user;
//           alert("Registration successful");
//           saveUserData(user.uid, userName, firstName, lastName, email);
//           window.location.href = "index.html";
//         })
//         .catch((error) => {
//           alert("Error: " + errorMessage);
//         });
//     });
//   } else {
//     console.log("Element not found: registerBtn");
//   }
// }

// // function saveUserData(userId, userName, firstName, lastName, email) {
// //   // Logic to save user data to database(Firestore)
// //   setDoc(doc(db, "users", userId), {
// //     userName,
// //     firstName,
// //     lastName,
// //     email,
// //   })
// //     .then(() => {
// //       console.log("User data saved successfully");
// //     })
// //     .catch((error) => {
// //       console.error("Error saving user data: ", error);
// //     });
// // }

// document.addEventListener("DOMContentLoaded", function () {
//   if (
//     new URLSearchParams(window.location.search).get("content") === "register"
//   ) {
//     initRegister();
//   }
// });

export default function initRegister() {
  document
    .getElementById("registerForm")
    .addEventListener("submit", (event) => {
      event.preventDefault();

      // Inputs
      const userName = document.getElementById("userName").value;
      const firstName = document.getElementById("firstName").value;
      const lastName = document.getElementById("lastName").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const password2 = document.getElementById("password2").value;

      if (password !== password2) {
        alert("Passwords do not match");
        return;
      }

      auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          return db.collection("users").doc(userCredential.user.uid).set({
            userName,
            firstName,
            lastName,
            email,
          });
        })
        .then(() => {
          alert("Registration successful");
          window.location.href = "index.html";
        })
        .catch(error => {
          alert("Error: " + error.message);
        });
    });
}
