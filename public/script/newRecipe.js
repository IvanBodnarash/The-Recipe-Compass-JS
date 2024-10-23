// Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
// import { getFirebaseAuth, getFirebaseFirestore, getFirebaseStorage, getUnsplashApiKey } from "./firebaseInit.js";
import { auth, db, storage } from "./config/firebaseConfig.js";
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
import { searchImagesOnUnsplash, displayUnsplashImages } from "./utils/unsplash.js";

export default async function postRecipe() {
  document
    .getElementById("uploadImgButton")
    .addEventListener("change", (event) => {
      console.log("File input changed");
      const file = event.target.files[0];
      const fileNameDisplay = document.getElementById("fileName");
      document.getElementById("selectedImageContainerWrapper").style.display =
        "block";
      console.log(file);

      if (file) {
        const reader = new FileReader();

        const validFileTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "image/jpg",
          "image/svg",
        ];
        const maxFileSize = 2 * 1024 * 1024; // 2 MB in bytes

        if (!validFileTypes.includes(file.type)) {
          console.log(
            "Please select a valid image file (JPEG, PNG, GIF, WEBP, JPG, SVG)."
          );
          return;
        }

        if (file.size > maxFileSize) {
          console.log("Please select an image smaller than 2 MB.");
          return;
        }
        reader.onload = function (e) {
          const selectedImageContainer =
            document.getElementById("selectedImage");
          selectedImageContainer.src = e.target.result;

          document.getElementById("selectedImageUrl").value = "";
          fileNameDisplay.textContent = file.name;
        };

        reader.readAsDataURL(file);
      }

      // const fileNameParts = file.split(".");
      // const name = fileNameParts.slice(0, -1).join(".");
      // const extension = fileNameParts.pop();

      // if (file.length > 20) {
      //   const shortenedFileName = name.substring(0, 22) + "..." + extension;
      //   fileNameDisplay.textContent = shortenedFileName;
      //   console.log("Shortened file name:", shortenedFileName);
      // } else {
      //   fileNameDisplay.textContent = file;
      // }

      // console.log("File name length:", file.length);
    });

  document
    .getElementById("unsplashSearchBtn")
    .addEventListener("click", async function () {
      const query = document.getElementById("unsplashSearchInput").value;
      if (query) {
        const unsplashResults = await searchImagesOnUnsplash(query);
        if (unsplashResults.length > 0) {
          displayUnsplashImages(unsplashResults);
          checkGalleryOverflow();
        } else {
          console.log("No images found on Unsplash for the query");
        }
      } else {
        console.log("Please enter a search query");
      }
    });

  // Handle scrolling the gallery with buttons
  document.getElementById("scrollLeftBtn").addEventListener("click", () => {
    const gallery = document.getElementById("imageGallery");
    gallery.scrollBy({
      left: -gallery.clientWidth / 3,
      behavior: "smooth",
    });
  });
  3;

  document.getElementById("scrollRightBtn").addEventListener("click", () => {
    const gallery = document.getElementById("imageGallery");
    gallery.scrollBy({
      left: gallery.clientWidth / 3,
      behavior: "smooth",
    });
  });

  // Check if the gallery overflows and hide/show scroll buttons
  function checkGalleryOverflow() {
    const gallery = document.getElementById("imageGallery");
    const scrollLeftBtn = document.getElementById("scrollLeftBtn");
    const scrollRightBtn = document.getElementById("scrollRightBtn");

    if (gallery.scrollWidth > gallery.clientWidth) {
      scrollLeftBtn.style.display = "block";
      scrollRightBtn.style.display = "block";
    } else {
      scrollLeftBtn.style.display = "none";
      scrollRightBtn.style.display = "none";
    }
  }

  window.addEventListener("resize", checkGalleryOverflow);
  checkGalleryOverflow();

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
      let imageUrl = document.getElementById("selectedImageUrl").value;

      if (img && !imageUrl) {
        // If the user has uploaded their own image
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
      } else if (!imd && !imageUrl) {
        console.log("No image found or uploaded!");
        return;
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
