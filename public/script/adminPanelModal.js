import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getAuth,
  deleteUser,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

import firebaseConfig from "./config.js";

import { updateRecipeInDB } from './adminPanelLogic.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function adminPanelModal(recipe) {
  console.log(recipe);
  const modal = document.querySelector("#recipeModal");
  const closeBtn = modal.querySelector(".close");
  const modalForm = modal.querySelector("#editRecipeForm");
  const ingredientsConteiner = document.querySelector("#ingredientsContainer");
  const directionsContainer = document.querySelector("#directionsContainer");

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

  // Display the modal
  modal.style.display = "block";

  closeBtn.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Add new ingredient input
  document.getElementById("addIngredientBtn").onclick = () => {
    addIngredientField(ingredientsConteiner);
  };

  // Add new direction input
  document.getElementById("addDirectionBtn").onclick = () => {
    addDirectionField(directionsContainer);
  };

  // Save button handler
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

    console.log(recipe.id);

    await updateRecipeInDB(recipe.id, updateRecipe);

    // Close the modal after saving
    modal.style.display = "none";
  };

  closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
  });
}

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

// Function to update the recipe in Firestore
// async function updateRecipeInDB(recipeId, updatedRecipe) {
//   try {
//     await updateDoc(doc(db, "recipes", recipeId), updatedRecipe);
//     alert(`Recipe with ID: ${recipeId} has been updated.`);
//     // Reload the recipes tab
//     location.reload();
//   } catch (error) {
//     console.log("Error updating recipe: ", error);
//   }
// }

// Function to open the modal with recipe data when "View" is clicked
