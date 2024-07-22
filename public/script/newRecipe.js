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

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

export default function postRecipe() {
  console.log("postRecipe called");

    document.getElementById("newRecipeForm").addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("button clicked");

    const userId = auth.currentUser.uid;
    const recipeTitle = document.getElementById("recipeTitle").value;
    const shortDescription = document.getElementById("recipeShortDescription").value;
    const ingredients = Array.from(document.querySelectorAll("input[name='ingredients[]']")).map((input) => input.value);
    const directions = Array.from(document.querySelectorAll("textarea[name='directions[]']")).map((textarea) => textarea.value);
    const fileInput = document.getElementById("uploadImgButton");
    const img = fileInput ? fileInput.files[0] : null;

    console.log("recipeTitle:", recipeTitle);
    console.log("shortDescription:", shortDescription);
    console.log("ingredients:", ingredients);
    console.log("directions:", directions);
    console.log("userId:", userId);
    console.log("img:", img);

    // // Event listener for image upload
    // document.getElementById("uploadImgButton").addEventListener("change", (event) => {

        
    //     if (file) {
    //         console.log("file:", file);
    //     } else {
    //         console.log("No file selected");
    //     }
    // });
  });
}

// let postRecipeBtn = document.getElementById("postRecipeBtn");
// if (postRecipeBtn) {
//   postRecipeBtn.addEventListener("click", postRecipe);
// } else {
//   console.error("Element with id 'postRecipeBtn' not found");
// }
