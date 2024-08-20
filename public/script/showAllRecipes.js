import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

import firebaseConfig from "./firebaseConfig.js";
// import firebaseConfig from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const recipesRef = collection(db, "recipes");
const usersRef = collection(db, "users");

// Function to get user name
async function getUserName(userId) {
  const userDoc = await getDoc(doc(usersRef, userId));
  if (userDoc.exists()) {
    return userDoc.data().userName;
  } else {
    console.log(`User with ID ${userId} not found.`);
    return "Unknown";
  }
}

// Function to get recipes and their displaying
export default async function loadRecipes(
  sortField = "recipeTitle",
  sortOrder = "asc"
) {
  console.log("Loading recipes...");
  const spinner = document.querySelector("#loadingSpinner");
  const pageContent = document.querySelector(".main-recipe-block");
  spinner.style.display = "flex";
  pageContent.style.display = "none";

  try {
    let recipesQuery;
    if (sortField === "userName") {
      recipesQuery = query(recipesRef);
    } else {
      recipesQuery = query(recipesRef, orderBy(sortField, sortOrder));
    }

    // const q = query(recipesRef, orderBy(sortField, sortOrder));
    const querySnapshot = await getDocs(recipesQuery);
    const recipesWrapper = document.querySelector(".recipes-wrapper");
    console.log("Query snapshot:", querySnapshot);
    console.log(`Number of recipes found: ${querySnapshot.size}`);
    console.log("Query executed successfully");

    // Conteiner cleaning
    recipesWrapper.innerHTML = "";

    let recipes = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const recipe = doc.data();
        console.log("Recipe found:", recipe.recipeTitle, doc.id);
        const userName = await getUserName(recipe.userId);
        return { id: doc.id, ...recipe, userName };
      })
    );

    if (sortOrder === "userName") {
      recipes.sort((a, b) => {
        if (sortOrder === "asc") {
          return a.userName.localeCompare(b.userName);
        } else {
          return b.userName.localeCompare(a.userName);
        }
      });
    }

    const recipesHtml = recipes.map((recipe) => {
      const shortenedDescription =
        recipe.shortDescription.length > 50
          ? recipe.shortDescription.substring(0, 100) + "..."
          : recipe.shortDescription;
      console.log("Recipe:", recipe.recipeTitle, recipe.id);
      return `
                <div class="recipe-block">
                    <a href="index.html?content=showrecipe&id=${recipe.id}">
                        <div class="overlay">
                            <p>Open</p>
                        </div>
                        <div class="content-wrapper">
                            <h3>${recipe.recipeTitle}</h3>
                            <img src="${recipe.imageUrl}" alt="Recipe img" />
                            <div class="text-block">
                                <span>${shortenedDescription}</span>
                                <div class="text-inner-block">
                                    <hr />
                                    <div class="text-inner" style="display: flex">
                                        <p>Posted by</p>
                                        <span>&nbsp;${recipe.userName}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            `;
    });

    // Adding recipe to the page
    recipesWrapper.innerHTML += recipesHtml.join("");
  } catch (error) {
    console.error("Error loading recipes:", error);
  } finally {
    spinner.style.display = "none";
    pageContent.style.display = "block";
  }
}

// Adding sorting handlers
// document.addEventListener("DOMContentLoaded", function () {
//   document
//     .querySelector(".sort-block")
//     .addEventListener("click", function (event) {
//       if (event.target.tagName === "A") {
//         event.preventDefault();
//         const sortField = event.target
//           .getAttribute("href")
//           .split("sort")[1]
//           .split("&")[0];
//         const sortOrder = event.target.getAttribute("href").split("order")[1];
//         loadRecipes(sortField, sortOrder);
//       }
//     });
// });
