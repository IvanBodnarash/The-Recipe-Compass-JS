// import { getFirebaseAuth, getFirebaseFirestore } from "./firebaseInit.js";
import { db } from "../config/firebaseConfig.js";
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
import { getUserNameAdminPanel } from "../utils/getUserName.js";
import { showCustomAlert } from "../utils/alert.js";
import { showCustomConfirm } from "../utils/confirm.js";

// import firebaseConfig from "./config.js";
// import firebaseConfig from "./config/firebaseConfig.js";

import adminPanelModal from "./adminPanelModal.js";

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
let databaseCache = null;

// Storing data in memory after first loading
let cachedRecipes = null;
let cachedComments = null;
let cachedUsers = null;

// Function to show spinner
function showSpinner() {
  const spinner = document.querySelector("#loadingSpinner");
  spinner.style.display = "flex";
}

// Function to hide spinner
function hideSpinner() {
  const spinner = document.querySelector("#loadingSpinner");
  spinner.style.display = "none";
}

// Function to get user name

export default async function adminPanelLogic() {
  // Firestore initialization
  // databaseCache = db;

  // If db is not initialized
  // if (!databaseCache) {
  //   console.log("Firestore instance is not initialized.");
  //   return;
  // }
  // Primary recipes tabs loading
  loadingRecipesTab();

  const recipeTabButton = document.querySelector("#recipesTab");
  const commentTabButton = document.querySelector("#commentsTab");
  const usersTabButton = document.querySelector("#usersTab");

  const recipesContent = document.querySelector("#recipes-content");
  const commentsContent = document.querySelector("#comments-content");
  const usersContent = document.querySelector("#users-content");

  recipeTabButton.addEventListener("click", () => {
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
    });
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
    renderRecipesTable(cachedRecipes);
    return;
  }

  try {
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
    const userName = await getUserNameAdminPanel(data.userId);
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
      const recipe = cachedRecipes.find((r) => r.id === recipeId).data;
      adminPanelModal({ ...recipe, id: recipeId });
    }
  });
}

// Functioon to delete recipe
function deleteRecipe(recipeId) {
  const recipeRef = doc(db, "recipes", recipeId);
  showCustomConfirm("Are you sure you want to delete this recipe?", () => {
    deleteDoc(recipeRef).then(() => {
      showCustomAlert("Recipe deleted", "info");
      cachedRecipes = cachedRecipes.filter((recipe) => recipe.id !== recipeId);
      loadingRecipesTab();
    });
  });
}

export async function updateRecipeInDB(recipeId, updatedRecipe) {
  try {
    await updateDoc(doc(db, "recipes", recipeId), updatedRecipe);
    showCustomAlert(`Recipe with ID: ${recipeId} has been updated.`, "success");
    const recipeIndex = cachedRecipes.findIndex(
      (recipe) => recipe.id === recipeId
    );
    if (recipeIndex !== -1) {
      cachedRecipes[recipeIndex].data = updatedRecipe;
    }
    loadingRecipesTab();
  } catch (error) {
    showCustomAlert(`Error updating recipe: ${error}`, "error");
  }
}

async function loadingCommentsTab(forceReload = false) {
  if (!forceReload && cachedComments) {
    renderCommentsTable(cachedComments);
    return;
  }

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
    const userName = await getUserNameAdminPanel(data.userId);
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

    if (target.classList.contains("delete")) {
      deleteComment(commentId);
    }
  });
}

// Function to delete comment
function deleteComment(commentId) {
  const commentRef = doc(db, "comments", commentId);
  showCustomConfirm("Are you sure you want to delete this comment?", () => {
    deleteDoc(commentRef).then(() => {
      showCustomAlert("Comment deleted", "info");
      cachedComments = cachedComments.filter(
        (comment) => comment.id !== commentId
      );
      loadingCommentsTab();
    });
  });
}

async function loadingUsersTab(forceReload = false) {
  if (!forceReload && cachedUsers) {
    console.log("Loading users from cache");
    renderUsersTable(cachedUsers);
    return;
  }

  try {
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);
    cachedUsers = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));
    renderUsersTable(cachedUsers);
  } catch (error) {
    console.error("Error fetching users: ", error);
  }
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
  const usersRef = doc(db, "users", userId);
  showCustomConfirm("Are you sure you want to delete this user profile from db?", () => {
    deleteDoc(usersRef).then(() => {
      showCustomAlert("User profile deleted", "info");
      cachedUsers = cachedUsers.filter((user) => user.id !== userId);
      loadingUsersTab();
    });
  });
}
