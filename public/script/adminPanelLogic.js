import { getFirebaseAuth, getFirebaseFirestore } from "./firebaseInit.js";
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

// import firebaseConfig from "./config.js";
// import firebaseConfig from "./config/firebaseConfig.js";

import adminPanelModal from "./adminPanelModal.js";

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
let db = null;

// Storing data in memory after first loading
let cachedRecipes = null;
let cachedComments = null;
let cachedUsers = null;

// Function to show spinner
function showSpinner() {
  const spinner = document.querySelector("#loadingSpinner");
  spinner.style.display = "flex";
  console.log("showSpinner");
  console.log(spinner);
}

// Function to hide spinner
function hideSpinner() {
    const spinner = document.querySelector("#loadingSpinner");
    spinner.style.display = "none";
    console.log("hideSpinner");
    console.log(spinner);
}

// Function to get user name
async function getUserName(userId) {
  // Check if userId exists
  if (!userId) {
    console.log("User ID is undefined or null.");
    return "Unknown";
  }

  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data().userName;
    } else {
      console.log(`User with ID ${userId} not found.`);
      return "Unknown";
    }
  } catch (error) {
    console.error("Error fetching user name:", error);
    return "Unknown";
  }
}

export default async function adminPanelLogic() {
  // Firestore initialization
  db = await getFirebaseFirestore();

  // If db is not initialized
  if (!db) {
    console.log("Firestore instance is not initialized.");
    return;
  }
  // Primary recipes tabs loading
  loadingRecipesTab();

  const recipeTabButton = document.querySelector("#recipesTab");
  const commentTabButton = document.querySelector("#commentsTab");
  const usersTabButton = document.querySelector("#usersTab");

  const recipesContent = document.querySelector("#recipes-content");
  const commentsContent = document.querySelector("#comments-content");
  const usersContent = document.querySelector("#users-content");

  recipeTabButton.addEventListener("click", () => {
    console.log("Recipe button clicked!");
    setActiveTab(
      recipeTabButton,
      recipesContent,
      loadingRecipesTab,
      cachedRecipes
    );
  });

  commentTabButton.addEventListener("click", () => {
    console.log("Comments button clicked!");
    setActiveTab(
      commentTabButton,
      commentsContent,
      loadingCommentsTab,
      cachedComments
    );
  });

  usersTabButton.addEventListener("click", () => {
    console.log("Users button clicked!");
    setActiveTab(usersTabButton, usersContent, loadingUsersTab, cachedUsers);
  });
}

function setActiveTab(button, content, loadFunction, cache) {
  document
    .querySelectorAll(".tab-button")
    .forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");

  document
    .querySelectorAll(".tab-content")
    .forEach((cont) => (cont.style.display = "none"));
  content.style.display = "block";

  if (!cache) {
    loadFunction().catch((error) => {
        console.error("Error loading tab content:", error);
    })
  }
}

function dateFormater(table) {
  // Date formatting
  const timestamp = table.timestamp;
  if (timestamp && typeof timestamp.toDate === "function") {
    const date = timestamp.toDate();
    return date.toLocaleString("us", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } else {
    return "Invalid Date";
  }
}

async function loadingRecipesTab(forceReload = false) {
  if (!forceReload && cachedRecipes) {
    console.log("loading recipes from cache");
    renderRecipesTable(cachedRecipes);
    return;
  }

  try {
      console.log("Fetching recipes from Firestore");
      const recipesRef = collection(db, "recipes");
      const recipesSnapshot = await getDocs(recipesRef);
      cachedRecipes = recipesSnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      renderRecipesTable(cachedRecipes);
  } catch (error) {
    console.error("Error fetching recipes: ", error);
  }
}

async function renderRecipesTable(recipes) {

showSpinner();

  const recipesTableBody = document.querySelector("#recipeTableBody");
  const newRecipesTableBody = recipesTableBody.cloneNode(false);
  recipesTableBody.replaceWith(newRecipesTableBody);

  let rows = [];

  for (const { id, data } of recipes) {
    const userName = await getUserName(data.userId);
    const row = `
      <tr data-id="${id}">
        <td>${data.recipeTitle}</td>
        <td>${userName}</td>
        <td>${dateFormater(data)}</td>
        <td class="actions-btns">
          <button class="action-btn delete">Delete</button>
          <button class="action-btn view">View</button>
        </td>
      </tr>
    `;
    rows.push(row);
  }

  hideSpinner();

  newRecipesTableBody.innerHTML = rows.join("");
  newRecipesTableBody.addEventListener("click", (event) => {
    const target = event.target;
    console.log(target);
    const recipeId = target.closest("tr").dataset.id;
    if (target.classList.contains("delete")) {
      deleteRecipe(recipeId);
    } else if (target.classList.contains("view")) {
      console.log("View");
      const recipe = cachedRecipes.find((r) => r.id === recipeId).data;
      adminPanelModal({ ...recipe, id: recipeId });
    }
  });
}

// Functioon to delete recipe
function deleteRecipe(recipeId) {
  console.log("deleteRecipe func was called");
  console.log(recipeId);
  const recipeRef = doc(db, "recipes", recipeId);
  if (confirm("Are you sure you want to delete this recipe?")) {
    deleteDoc(recipeRef).then(() => {
      alert("Recipe deleted");
      cachedRecipes = cachedRecipes.filter((recipe) => recipe.id !== recipeId);
      loadingRecipesTab();
    });
  }
}

export async function updateRecipeInDB(recipeId, updatedRecipe) {
  try {
    await updateDoc(doc(db, "recipes", recipeId), updatedRecipe);
    alert(`Recipe with ID: ${recipeId} has been updated.`);
    const recipeIndex = cachedRecipes.findIndex(
      (recipe) => recipe.id === recipeId
    );
    if (recipeIndex !== -1) {
      cachedRecipes[recipeIndex].data = updatedRecipe;
    }
    loadingRecipesTab();
  } catch (error) {
    console.log("Error updating recipe: ", error);
  }
}

async function loadingCommentsTab(forceReload = false) {
  if (!forceReload && cachedComments) {
    console.log("loading comments from cache");
    renderCommentsTable(cachedComments);
    return;
  }

  console.log("Fetching comments from Firestore");
  const commentsRef = collection(db, "comments");
  const commentsSnapshot = await getDocs(commentsRef);
  cachedComments = commentsSnapshot.docs.map((doc) => ({
    id: doc.id,
    data: doc.data(),
  }));
  renderCommentsTable(cachedComments);
}

async function renderCommentsTable(comments) {
  showSpinner();
  const commentsTableBody = document.querySelector("#commentsTableBody");
  const newCommentsTableBody = commentsTableBody.cloneNode(false);
  commentsTableBody.replaceWith(newCommentsTableBody);

  let rows = [];

  for (const { id, data } of comments) {
    const userName = await getUserName(data.userId);
    const row = `
          <tr data-id="${id}">
          <td>${data.text}</td>
          <td>${userName}</td>
          <td>${dateFormater(data)}</td>
          <td class="actions-btns">
          <button id="commentDeleteBtn" class="action-btn delete">Delete</button>
          </td>
          </tr>
          `;

    rows.push(row);
  }

  hideSpinner();
  newCommentsTableBody.innerHTML = rows.join("");
  newCommentsTableBody.addEventListener("click", (event) => {
    const target = event.target;

    // Getting id of the comment wrom data-id from parent element
    const commentId = target.closest("tr").dataset.id;

    console.log(commentId);

    if (target.classList.contains("delete")) {
      deleteComment(commentId);
    }
  });
}

// Function to delete comment
function deleteComment(commentId) {
  console.log("deleteComment func was called");
  console.log(commentId);
  const commentRef = doc(db, "comments", commentId);
  if (confirm("Are you sure you want to delete this comment?")) {
    deleteDoc(commentRef).then(() => {
      alert("Comment deleted");
      cachedComments = cachedComments.filter(
        (comment) => comment.id !== commentId
      );
      loadingCommentsTab();
    });
  }
}

async function loadingUsersTab(forceReload = false) {
  if (!forceReload && cachedUsers) {
    console.log("Loading users from cache");
    renderUsersTable(cachedUsers);
    return;
  }

  console.log("Fetching users from Firestore");
  const usersRef = collection(db, "users");
  const usesSnapshot = await getDocs(usersRef);
  cachedUsers = usesSnapshot.docs.map((doc) => ({
    id: doc.id,
    data: doc.data(),
  }));
  renderUsersTable(cachedUsers);
}

async function renderUsersTable(users) {
showSpinner();
  const usersTableBody = document.querySelector("#usersTableBody");
  const newUsersTableBody = usersTableBody.cloneNode(false);
  usersTableBody.replaceWith(newUsersTableBody);

  let rows = [];

  for (const { id, data } of users) {
    const row = `
              <tr data-id="${id}">
                  <td>${data.userName}</td>
                  <td>${data.email}</td>
                  <td>${data.role}</td>
                  <td class="actions-btns">
                      <button class="action-btn delete">Delete</button>
                  </td>
              </tr>
          `;

    rows.push(row);
  }

  hideSpinner();
  newUsersTableBody.innerHTML = rows.join("");
  newUsersTableBody.addEventListener("click", (event) => {
    const target = event.target;
    const userId = target.closest("tr").dataset.id;
    if (target.classList.contains("delete")) {
      deleteUserFromDB(userId);
    }
  });
}

// Function to delete user
function deleteUserFromDB(userId) {
  console.log("deleteUser func was called");
  console.log(userId);
  const usersRef = doc(db, "users", userId);
  if (confirm("Are you sure you want to delete this user profile from db?")) {
    deleteDoc(usersRef).then(() => {
      alert("User profile deleted");
      cachedUsers = cachedUsers.filter((user) => user.id !== userId);
      loadingUsersTab();
    });
  }
}

// TODO: Add spinner while loading tabs // DONE
// TODO: Add cache logic to another tabs // DONE
// TODO: Refactor the code and separate logic from ui generation logic
