import { auth } from "../config/firebaseConfig.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import displayUsername from "../utils/displayUser.js";
import initRegister from "../pages/register.js";
import logIn from "../pages/login.js";
import { showCustomAlert } from "../utils/alert.js";

// Check if user is logged in
window.onload = async function () {
  try {
    onAuthStateChanged(auth, async function (user) {
      if (user) {
        await displayUsername(user.uid);
        toggleAddRecipeButton(true);
      } else {
        toggleAddRecipeButton(false);
      }
    });
  } catch (error) {
    console.log("Error getting data from firebase:", error);
  }
};

async function handleLogout() {
  try {
    // localStorage.setItem("logoutAlert", "Logout Successful");

    // console.log("Logout message saved in storage:", localStorage.getItem("logoutAlert"));

    showCustomAlert("Logout Successful", "info");
    await signOut(auth);

    localStorage.removeItem("valid_recipe_user");
    localStorage.removeItem("userName");
    localStorage.removeItem("hasSeenWelcomeAlert");
    localStorage.removeItem("hasAdminNavItem");

    document.getElementById("displayUserName").textContent = "";
    
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  } catch (error) {
    console.log("Error logging out:", error);
  }
}

function toggleAddRecipeButton(isEnabled) {
  const addRecipeButton = document.getElementById("addRecipeBtn");
  if (addRecipeButton) {
    addRecipeButton.href = isEnabled
      ? "index.html?content=newrecipe"
      : "index.html?content=login";
  } else {
    console.error("Element with id 'addRecipeBtn' not found");
  }
}

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  const content = new URLSearchParams(window.location.search).get("content");

  if (content === "register") {
    initRegister();
  } else if (content === "login") {
    logIn();
  } else if (content === "logout") {
    handleLogout();
  }

  const logoutMessage = localStorage.getItem("logoutAlert");
  
  console.log("Logout message in storage:", logoutMessage);  // Вивести у консоль

  if (logoutMessage) {
    showCustomAlert(logoutMessage, "info");  // Виклик алерту
    localStorage.removeItem("logoutAlert");  // Очищення після показу
  }
});
