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

import firebaseConfig from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const recipesRef = collection(db, "recipes");
const usersRef = collection(db, "users");

// Function to create a card element for each recipe using template
function createCard(recipe, userName, template) {
  const card = template.cloneNode(true);
  card.querySelector(
    "a"
  ).href = `index.html?content=showrecipe&id=${recipe.id}`;
  card.querySelector("h3").textContent = recipe.recipeTitle;
  card.querySelector("img").src = recipe.imageUrl;
  card.querySelector(".text-block span").textContent = recipe.shortDescription;
  card.querySelector(".text-inner span").textContent = userName;

  return card;
}

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

// Function to get the latest 6 recipes from the database
export default async function displayRecipes() {
  console.log("Displaying latest recipes...");
  fetch("./partials/latestRecipes.html")
    .then((response) => response.text())
    .then(async (templateString) => {
      const parser = new DOMParser();
      const templateDoc = parser.parseFromString(templateString, "text/html");
      const template = templateDoc.querySelector(".recipe-block");

      if (!template) {
        console.error("Template not found");
        return;
      }

      console.log("Template loaded successfully");

      const q = query(recipesRef, orderBy("timestamp", "desc"), limit(6));
      const querySnapshot = await getDocs(q);

      const recipesContainer = document.getElementById("recipeContainer");
      console.log("Query executed successfully.");
      if (querySnapshot.empty) {
        console.log("No matching documents.");
        return;
      }

      querySnapshot.forEach(async (doc) => {
        console.log(doc.id, " => ", doc.data());
        const recipe = doc.data();
        recipe.id = doc.id; // Add doc id to the recipe object

        const spinner = document.querySelector("#loadingSpinner");
        spinner.style.display = "flex";

        try {
          const userName = await getUserName(recipe.userId);
          const card = createCard(recipe, userName, template);
          console.log("Card created successfully: ", card);
          recipesContainer.appendChild(card);
          console.log("Card appended successfully");
        } catch (error) {
          console.error("Error creating card or appending ", error);
        } finally {
          spinner.style.display = "none";
        }
      });
    })
    .catch((error) => {
      console.error("Error loading template: ", error);
    });
}
