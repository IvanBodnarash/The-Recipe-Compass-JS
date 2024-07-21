import { auth, signInWithEmailAndPassword } from "./firebase.js";

// export function initLogin() {
//   const loginButton = document.getElementById("loginBtn");

//   if (loginButton) {
//     loginButton.addEventListener("click", function (event) {
//       event.preventDefault();
//       console.log("Login button clicked.");

//       const email = document.getElementById("userId").value;
//       const password = document.getElementById("pass").value;

//       signInWithEmailAndPassword(auth, email, password)
//         .then((userCredential) => {
//           // Signed in
//           const user = userCredential.user;
//           alert("Login Successful");
//           localStorage.setItem("valid_recipe_user", user.uid);
//           window.location.href = "index.html";
//         })
//         .catch((error) => {
//           alert("Error: " + error.message);
//         });
//     });
//   } else {
//     console.error("Element with id 'loginBtn' not found.");
//   }
// }

// document.addEventListener("DOMContentLoaded", function () {
//   if (
//     new URLSearchParams(window.location.search).get("content") === "login"
//   ) {
//     initLogin();
//   }
// });

export default function initLogin() {
  document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("userId").value;
    const password = document.getElementById("pass").value;
    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        window.location.href = "index.html";
      })
      .catch(error => {
        console.error("Error signing in:", error);
      });
  });
}