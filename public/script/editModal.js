import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";
import {
  updateDoc,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { storage, db } from "./config/firebaseConfig.js";
import {
  searchImagesOnUnsplash,
  displayUnsplashImages,
} from "./utils/unsplash.js";
import { uploadNewImg } from "./utils/uploadNewImg.js";
// import { shortenedImgName } from "./utils/imgDisplayShortener.js";

export function authorPanelModal(recipe) {
  const modal = document.getElementById("recipeModal");
  const modalForm = document.getElementById("editRecipeForm");
  const uploadImgInput = document.getElementById("uploadNewImg");
  const ingredientsConteiner = document.getElementById("ingredientsContainer");
  const directionsContainer = document.getElementById("directionsContainer");
  const unsplashSearchInput = document.getElementById("unsplashSearchInput");
  const unsplashSearchBtn = document.getElementById("unsplashSearchBtn");
  const deleteRecipeButton = document.getElementById("deleteRecipeButton");

  const currentRecipeImage = document.getElementById("currentRecipeImage");
  currentRecipeImage.src = recipe.imageUrl || "";

  // Populate the recipe title in the modal
  modalForm.recipeTitle.value = recipe.recipeTitle || "";

  // Populate the recipe description
  modalForm.shortDescription.value = recipe.shortDescription || "";

  // Populate ingredients
  ingredientsConteiner.innerHTML = "";
  (recipe.ingredients || []).forEach((ingredient, index) => {
    addIngredientField(ingredientsConteiner, ingredient, index);
  });

  // Populate directions
  directionsContainer.innerHTML = "";
  (recipe.directions || []).forEach((direction, index) => {
    addDirectionField(directionsContainer, direction, index);
  });

  // Searching images on Unsplash
  unsplashSearchBtn.addEventListener("click", async () => {
    const query = unsplashSearchInput.value;
    if (query) {
      const unsplashResults = await searchImagesOnUnsplash(query);
      displayUnsplashImages(unsplashResults);
    }
  });

  uploadNewImg();

  modalForm.onsubmit = async (e) => {
    e.preventDefault();

    const updateRecipe = {
      recipeTitle: modalForm.recipeTitle.value,
      shortDescription: modalForm.shortDescription.value,
      ingredients: Array.from(
        ingredientsConteiner.querySelectorAll("input[name^='ingredient-']")
      ).map((input) => input.value),
      directions: Array.from(
        directionsContainer.querySelectorAll("textarea[name^='direction-']")
      ).map((textarea) => textarea.value),
    };

    // If uploaded new image
    const file = uploadImgInput.files[0];
    let imageUrl = document.getElementById("selectedImageUrl").value;

    if (file && !imageUrl) {
      const storageRef = ref(storage, `recipes/${recipe.userId}/${file.name}`);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }

    if (imageUrl) {
      updateRecipe.imageUrl = imageUrl;
    }

    // Update recipe in Firebase
    try {
      await updateDoc(doc(db, "recipes", recipe.id), updateRecipe);
      alert("Recipe updated successfully!");
      modal.style.display = "none";
      location.reload();
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  deleteRecipeButton.addEventListener("click", async () => {
    const confirmed = confirm("Are you sure you want to delete this recipe?");
    if (confirmed) {
      try {
        // Delete recipe from Firestore
        await deleteDoc(doc(db, "recipes", recipe.id));

        // Delete image from Firebase Storage
        if (recipe.imageUrl && recipe.imageUrl.startWith()) {
          const imageRef = ref(storage, recipe.imageUrl);
          await deleteObject(imageRef);
        }

        alert("Recipe deleted successfully!");
        modal.style.display = "block";
        window.location.href = "index.html";
      } catch (error) {
        console.error("Error deleting recipe:", error);
      }
    }
  });

  // Display the modal
  modal.style.display = "block";

  document.querySelector(".close").addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Add new ingredient input
  document.getElementById("addIngredientBtn").onclick = () => {
    addIngredientField(ingredientsConteiner);
  };

  // Add new direction input
  document.getElementById("addDirectionBtn").onclick = () => {
    addDirectionField(directionsContainer);
  };

  // Function to add an ingridient field
  function addIngredientField(container, value = "", index = null) {
    const fieldWrapper = document.createElement("div");
    fieldWrapper.classList.add("ingredient-field");

    const input = document.createElement("input");
    input.type = "text";
    input.name =
      index !== null
        ? `ingredient-${index}`
        : `ingredient-${container.children.length}`;
    input.value = value;
    input.required = true;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Remove";
    deleteButton.onclick = () => {
      fieldWrapper.remove();
    };

    fieldWrapper.appendChild(input);
    fieldWrapper.appendChild(deleteButton);
    container.appendChild(fieldWrapper);
  }

  // Function to add an direction field
  function addDirectionField(container, value = "", index = null) {
    const fieldWrapper = document.createElement("div");
    fieldWrapper.classList.add("direction-field");

    const textarea = document.createElement("textarea");
    textarea.name =
      index !== null
        ? `direction-${index}`
        : `direction-${container.children.length}`;
    textarea.rows = 3;
    textarea.value = value;
    textarea.required = true;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Remove";
    deleteButton.onclick = () => {
      fieldWrapper.remove();
    };

    fieldWrapper.appendChild(textarea);
    fieldWrapper.appendChild(deleteButton);
    container.appendChild(fieldWrapper);
  }
}
