import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// import firebaseConfig from "./config.js";
import firebaseConfig from "./config/firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const recipesRef = collection(db, "recipes");
const usersRef = collection(db, "users");

// Function to creade full recipe page
// function createRecipeLayout()

// Function to get the user name from the database
async function getUserName(userId) {
  const userDoc = await getDoc(doc(usersRef, userId));
  if (userDoc.exists()) {
    return userDoc.data().userName;
  } else {
    console.log(`User with ID ${userId} not found.`);
    return "Unknown";
  }
}

export default async function showRecipe(recipeId) {
  const spinner = document.querySelector("#loadingSpinner");
  const pageContent = document.querySelector(".recipe-block-main");
  spinner.style.display = "flex";
  pageContent.style.display = "none";

  try {
    const recipeDoc = await getDoc(doc(recipesRef, recipeId));
    console.log(recipesRef);
    if (!recipesRef) {
      console.log("Recipe Not Found!");
      return;
    }

    const recipe = recipeDoc.data();
    const userName = await getUserName(recipe.userId);

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
