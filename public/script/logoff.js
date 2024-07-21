import { auth, signOut } from "./firebase.js";

export function initLogoff() {
  const logoffButton = document.getElementById("logoutBtn");

  if (logoffButton) {
    logoffButton.addEventListener("click", function (event) {
      event.preventDefault();

      signOut(auth)
        .then(() => {
          alert("Logout Successful");
          localStorage.removeItem("valid_recipe_user");
          window.location.href = "index.html";
        })
        .catch((error) => {
          alert("Error: " + error.message);
        });
    });
  } else {
    console.error("Element with id 'logoutBtn' not found");
  }

  //   // Event Listener for Logout
  //   document.getElementById("logoutBtn").addEventListener("click", (event) => {
  //     event.preventDefault();

  //     signOut(auth)
  //       .then(() => {
  //         localStorage.removeItem("valid_recipe_user");
  //         alert("Logout Successful");
  //         window.location.href = "login.html";
  //       })
  //       .catch((error) => {
  //         alert("Error: " + error.message);
  //       });
  //   });
}

document.addEventListener("DOMContentLoaded", function () {
    if (
      new URLSearchParams(window.location.search).get("content") === "logout"
    ) {
      initLogoff();
    }
  });
