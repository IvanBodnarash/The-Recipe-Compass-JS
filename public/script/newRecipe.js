// Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirebaseAuth, getFirebaseFirestore, getFirebaseStorage, getUnsplashApiKey } from "./firebaseInit.js";
import { auth, db, storage } from "./config/firebaseConfig.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

// import firebaseConfig from "./config/firebaseConfig.js";
// import firebaseConfig from "./config.js";
// import unsplashAPIKey from "./unsplashConfig.js";
// import unsplashAPIKey from "./unsplashAuth.js";
import unsplashAPIKey from "./config/unsplashAuth.js";


// const app = initializeApp(firebaseConfig);
// const auth = getAuth();
// const db = getFirestore(app);
// const storage = getStorage(app);

export default async function postRecipe() {
  console.log("postRecipe page function called");

  // const auth = await getFirebaseAuth();
  // const db = await getFirebaseFirestore();
  // const storage = await getFirebaseStorage();
  // const unsplashAPIKey = await getUnsplashApiKey();

  document.getElementById("uploadImgButton").addEventListener("change", (event) => {
    console.log("File input changed");
    const fileNameDisplay = document.getElementById("fileName");
    const file = event.target.files[0].name;
    console.log(file);

    const fileNameParts = file.split(".");
    const name = fileNameParts.slice(0, -1).join(".");
    const extension = fileNameParts.pop();

    if (file.length > 20) {
      const shortenedFileName = name.substring(0, 22) + "..." + extension;
      fileNameDisplay.textContent = shortenedFileName;
      console.log("Shortened file name:", shortenedFileName);
    } else {
      fileNameDisplay.textContent = file;
    }

    console.log("File name length:", file.length);
  });


  // Add new recipe to database and get image URL
  document
    .getElementById("newRecipeForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      console.log("button clicked");

      const userId = auth.currentUser.uid;
      const recipeTitle = document.getElementById("recipeTitle").value;
      const shortDescription = document.getElementById(
        "recipeShortDescription"
      ).value;
      const ingredients = Array.from(
        document.querySelectorAll("input[name='ingredients[]']")
      ).map((input) => input.value);
      const directions = Array.from(
        document.querySelectorAll("textarea[name='directions[]']")
      ).map((textarea) => textarea.value);
      
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
        const validFileTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "image/jpg",
          "image/svg",
        ];
        const maxFileSize = 2 * 1024 * 1024; // 2 MB in bytes

        if (!validFileTypes.includes(img.type)) {
          console.log(
            "Please select a valid image file (JPEG, PNG, GIF, WEBP, JPG, SVG)."
          );
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
        imageUrl = await searchImagesOnUnsplash(recipeTitle, unsplashAPIKey);

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
async function searchImagesOnUnsplash(query, unsplashAPIKey) {
  const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${unsplashAPIKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    if (data.results && data.results.length > 0) {
      console.log(data.results[0].urls.regular);
      return data.results[0].urls.regular; // Return the first image URL
    } else {
      return null; // Return null if no image is found
    }
  } catch (error) {
    console.error("Error searching Unsplash:", error);
    return null;
  }
}