import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { auth } from "../config/firebaseConfig.js";
import { showCustomAlert } from "../utils/alert.js";

// Initialize Login
export default async function logIn() {
  // Submit Button

  document
    .getElementById("loginBtn")
    .addEventListener("click", function (event) {
      event.preventDefault();
      try {
        // Inputs
        const email = document.getElementById("userId").value;
        const password = document.getElementById("pass").value;
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            showCustomAlert("Login Successful", "success");
            localStorage.setItem("valid_recipe_user", user.uid);
            window.location.href = "index.html";
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            showCustomAlert(
              "Error: " + `${errorMessage} ${errorCode}`,
              "error"
            );
          });
      } catch (error) {
        showCustomAlert("Error in logIn: " + error.message, "error");
      }
    });
}
