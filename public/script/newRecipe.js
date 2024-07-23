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
import unsplashAPIKey from "./unsplashAuth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);

export default function postRecipe() {
  console.log("postRecipe called");

    document.getElementById("newRecipeForm").addEventListener("submit", async function (event) {
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

        let imageUrl = null;

        if (img) {
            const validFileTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/jpg", "image/svg"];
            const maxFileSize = 2 * 1024 * 1024; // 2 MB in bytes

            if (!validFileTypes.includes(img.type)) {
                console.log("Please select a valid image file (JPEG, PNG, GIF, WEBP, JPG, SVG).");
                return;
            }

            if (img.size > maxFileSize) {
                console.log("Please select an image smaller than 2 MB.");
                return;
            }

            try {
                // Upload image to Firebase Storage
                const storageRef = ref(storage, `recipes/${userId}/${img.name}`);
                await uploadBytes(storageRef, img);
                imageUrl = await getDownloadURL(storageRef);
                console.log("File available at", imageUrl);
            } catch (error) {
                console.error("Error uploading image:", error);
                return;
            }
        } else {
            console.log("No image selected, searching Unsplash...");
            imageUrl = await searchImagesOnUnsplash(recipeTitle);

            if (!imageUrl) {
                console.log("No image found on Unsplash");
                return;
            }
        }

        try {
            // Create new recipe document in Firestore
            const docRef = await addDoc(collection(db, "recipes"), {
                userId,
                recipeTitle,
                shortDescription,
                ingredients,
                directions,
                imageUrl,
                timestamp: serverTimestamp(),
            });

            console.log("Recipe document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }

        window.location.href = "index.html";
    });
}

// Function for searching image with Unsplash API
async function searchImagesOnUnsplash(query) {
    const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${unsplashAPIKey}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    if (data.results && data.results.length > 0) {
        console.log(data.results[0].urls.regular);
        return data.results[0].urls.regular; // Return the first image URL
    } else {
      return null; // Return null if no image is found
    }
}
