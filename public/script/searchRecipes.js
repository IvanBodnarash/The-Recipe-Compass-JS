// import { getFirebaseFirestore } from "./firebaseInit.js";
import { db } from "./config/firebaseConfig.js";
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// import firebaseConfig from "./config.js";
// import firebaseConfig from "./config/firebaseConfig.js";

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// Function to get user name
async function getUserName(usersRef, userId) {
  const userDoc = await getDoc(doc(usersRef, userId));
  if (userDoc.exists()) {
    return userDoc.data().userName;
  } else {
    console.log(`User with ID ${userId} not found.`);
    return "Unknown";
  }
}

// Function to get recipes and their displaying
export default async function searchRecipes() {
  try {
    // const db = await getFirebaseFirestore();

    const recipesRef = collection(db, "recipes");
    const usersRef = collection(db, "users");

    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get("searchFor");

    const recipesQuery = query(recipesRef);
    const querySnapshot = await getDocs(recipesQuery);

    const searchedRecipesWrapper = document.querySelector(".search-block");
    const searchBlock = document.querySelector(".search-block-wrapper");
    const descriptionParagraph = document.querySelector("#keywordSearch");

    if (searchTerm === "") {
      descriptionParagraph.textContent = "All recipes";
    } else {
      console.log(searchTerm);
      descriptionParagraph.textContent = `All search results with keyword "${searchTerm}"`;
    }

    console.log("Query snapshot:", querySnapshot);
    console.log(`Number of recipes found: ${querySnapshot.size}`);
    console.log("Query executed successfully");

    searchedRecipesWrapper.innerHTML = "";

    let foundRecipes = false;

    let searchedRecipesHtml = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const recipe = doc.data();
        console.log("Recipe found:", recipe.recipeTitle, doc.id);
        const userName = await getUserName(usersRef, recipe.userId);
        const shortenedDescription =
          recipe.shortDescription.length > 50
            ? recipe.shortDescription.substring(0, 100) + "..."
            : recipe.shortDescription;
        // return { id: doc.id, ...recipe, userName };
        if (
          recipe.recipeTitle.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          foundRecipes = true;
          return `
                  <div class="recipe-block">
                      <a href="index.html?content=showrecipe&id=${doc.id}">
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
                                          <span>&nbsp;${userName}</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </a>
                  </div>
              `;
        }
        return "";
      })
    );
    if (!foundRecipes) {
      searchBlock.innerHTML = "";
      searchBlock.innerHTML = `
          <div class="no-user-banner">
              <h1>Sorry, no recipes were found with '${searchTerm}' in them</h1>
              <div class="no-user-banner-inner2">
                  <a href="index.html">Try again</a>
              </div>
          </div>`;
    } else {
      searchedRecipesWrapper.innerHTML = searchedRecipesHtml.join("");
    }
  } catch (error) {
    console.error("Fetching recipes for searchRecipes failed:", error);
  }
}
