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
  collection,
  addDoc,
  serverTimestamp,
  setDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

import firebaseConfig from "./config.js";
import displayUsername from "./displayUser.js";
import initRegister from "./register.js";
import logIn from "./login.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

// Check if user is logged in
window.onload = function () {
  onAuthStateChanged(auth, function (user) {
    if (user) {
      displayUsername(user.uid);
      toggleAddRecipeButton(true);
    } else {
      toggleAddRecipeButton(false);
    }
  });

  // Initialize Logout
  const logout = document.getElementById("logoutBtn");
  if (logout) {
    logout.addEventListener("click", function () {
      signOut(auth);
      alert("Logout Successful");
      localStorage.removeItem("valid_recipe_user");
      window.location.href = "index.html";
    });
  } else {
    console.error("Element with id 'logoutBtn' not found");
  }
};

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


// // Handle image upload
// async function uploadImage(file) {
//     const storageRef = ref(storage, `images/${file.name}`);
  
//     try {
//       const snapshot = await uploadBytes(storageRef, file); // Upload the image to Firebase Storage(file);
//       const downloadURL = await getDownloadURL(snapshot.ref);
//       console.log("Image uploaded successfully: ", downloadURL);
//       alert("Image uploaded successfully");
//       document.getElementById("imageUrl").value = downloadURL;
//       return downloadURL;
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       alert("Error uploading image");
//     }
// }

// // Event listener for image upload
// document.getElementById("uploadImgButton").addEventListener("change", async (event) => {
//   const file = event.target.files[0];

//   console.log(file);

//   if (file) {
//     await uploadImage(event);
//   }
// });

// // Handle recipe form submission
// document.getElementById("newRecipeForm").addEventListener("submit", async (event) => {
//   event.preventDefault();

//   const fileInput = document.getElementById("uploadImgButton");
//   const file = fileInput.files[0];
//   const imageUrl = '';

//   if (file) {
//     try {
//       imageUrl = await uploadImage(file);
//     } catch {
//       alert("Error uploading image");
//       return;
//     }
//   }

//   const userId = auth.currentUser.uid;
//   const recipeTitle = document.getElementById("recipeTitle").value;
//   const shortDescription = document.getElementById("recipeShortDescription").value;
//   const ingredients = Array.from(document.querySelectorAll("input[name='ingredients[]']")).map((input) => input.value);
//   const directions = Array.from(document.querySelectorAll("textarea[name='directions[]']")).map((textarea) => textarea.value);
//   // const imageUrl = document.getElementById("imageUrl").value;

//   try {
//     await addDoc(collection(db, "recipes"),{
//       userId,
//       recipeTitle,
//       shortDescription,
//       ingredients,
//       directions,
//       imageUrl,
//       createdAt: serverTimestamp(),
//     });
//     alert("Recipe added successfully");
//     window.location.href = "index.html";
//   } catch (error) {
//     console.error("Error adding recipe:", error);
//     alert("Error adding recipe");
//   }
// });

// Post Recipe Function
// export function postRecipe() {
//   const recipeTitle = document.getElementById("recipeTitle").value;
//   const shortDescription = document.getElementById("recipeShortDescription").value;
//   const ingredients = Array.from(document.querySelectorAll("input[name='ingredients[]']")).map((input) => input.value);
//   const directions = Array.from(document.querySelectorAll("textarea[name='directions[]']")).map((textarea) => textarea.value);
//   const imageUrl = document.getElementById("imageUrl").files[0];
//   const userId = auth.currentUser.uid;

//   if (!userId) {
//     alert("You must be logged in to post a recipe");
//     return;
//   }

//   const storageRef = storage.ref("recipes/" + imageUrl.name);
//   const uploadTask = storageRef.put(imageUrl);

//   uploadTask.on("state_changed", (snapshot) => {}, (error) => {
//     console.error("Error uploading image:", error);
//     alert("Error uploading image");
//   }, () => {
//     uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
//       addDoc(collection(db, "recipes"), {
//         userId,
//         recipeTitle,
//         shortDescription,
//         ingredients,
//         directions,
//         imageUrl: downloadURL,
//         createdAt: serverTimestamp(),
//       });
//       alert("Recipe added successfully");
//       window.location.href = "index.html";
//     });
//   });
// }


// function postRecipe() {
//   console.log("postRecipe called");

//   //   document.getElementById("newRecipeForm").addEventListener("submit", function (event) {
//   //   event.preventDefault();
//   //   console.log("button clicked");
//   // });
// }

// let postRecipeBtn = document.getElementById("postRecipeBtn");
// if (postRecipeBtn) {
//   postRecipeBtn.addEventListener("click", postRecipe);
// } else {
//   console.error("Element with id 'postRecipeBtn' not found");
// }

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  const content = new URLSearchParams(window.location.search).get("content");
  if (content === "register") {
    initRegister();
  } else if (content === "login") {
    logIn();
  }
});
