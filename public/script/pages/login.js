import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { auth } from "../config/firebaseConfig.js";

// Initialize Login
export default async function logIn() {
  // Submit Button

  try {
    const login = document.getElementById("loginBtn");
    // const auth = await getFirebaseAuth();

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
          alert("Error: " + errorMessage + "\n" + errorCode);
        });
    });
  } catch (error) {
    console.error("Error in logIn:", error);
  }
}
