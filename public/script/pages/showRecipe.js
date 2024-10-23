import { auth, db } from "../config/firebaseConfig.js";
import {
  collection,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { authorPanelModal } from "../modals/editModal.js";
import { getUserName } from "../utils/getUserName.js";

// Function to get the user name from the database

export default async function showRecipe(recipeId) {
  const spinner = document.querySelector("#loadingSpinner");
  const pageContent = document.querySelector(".recipe-block-main");
  spinner.style.display = "flex";
  pageContent.style.display = "none";

  try {
    const recipesRef = collection(db, "recipes");
    const usersRef = collection(db, "users");

    const recipeDoc = await getDoc(doc(recipesRef, recipeId));

    console.log(recipesRef);
    if (!recipesRef) {
      console.log("Recipe Not Found!");
      return;
    }

    const recipe = recipeDoc.data();
    console.log(recipe);
    const userName = await getUserName(usersRef, recipe.userId);

    const user = auth.currentUser;

    if (user && user.uid === recipe.userId) {
      document.getElementById("editBtnContainer").style.display = "block";
      document.getElementById("editRecipeBtn").addEventListener("click", () => {
        authorPanelModal({ ...recipe, id: recipeId });
      })
    }

    // Getting ingredient and direction arrays
    const ingredients = recipe.ingredients;
    const directions = recipe.directions;

    function renderArrays(ingredients, directions) {
      const ingredientsConteiner = document.querySelector(
        ".ingredients-block-inner"
      );
      const directionsContainer = document.querySelector(".directions-list");

      ingredientsConteiner.innerHTML = ingredients
        .map(
          (ingredient, index) => `
            <div class="form-check">
                <input type="checkbox" class="form-check-input" id="ing${index}" onchange="toggleStrikethrough('ing${index}')">
                <label for="ing${index}" id="label_ing${index}">${ingredient}</label>
            </div>`
        )
        .join("");
      directionsContainer.innerHTML = directions
        .map((direction) => `<li class="directions-item">${direction}</li>`)
        .join("");
    }

    // Date formatting
    const timestamp = recipe.timestamp;
    const date = timestamp.toDate();
    const formattedDate = date.toLocaleString("us", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    console.log("showRecipe func was called");
    const title = document.querySelectorAll("#recipeTitle");
    title.forEach((element) => {
      element.textContent = recipe.recipeTitle;
      console.log(recipe.recipeTitle);
    });
    document.getElementById("recipeAuthor").textContent = userName;
    document.getElementById("recipeImg").src = recipe.imageUrl;
    document.getElementById("desc").textContent = recipe.shortDescription;
    document.getElementById(
      "timeStamp"
    ).textContent = `Posted On: ${formattedDate}`;
    renderArrays(ingredients, directions);
  } catch (error) {
    console.error();
  } finally {
    spinner.style.display = "none";
    pageContent.style.display = "block";
  }
}
