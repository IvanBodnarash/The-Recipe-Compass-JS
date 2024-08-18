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

import adminPanelModal from "./adminPanelModal.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Storing data in memory after first loading
let cachedRecipes = null;
let cachedComments = null;
let cachedUsers = null;

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
    commentsContent.style.display = "none";
    usersContent.style.display = "none";
    // loadingRecipesTab();
    recipesContent.style.display = "block";

    // Load if it hasn't in cache
    if (!cachedRecipes) {
      loadingRecipesTab();
    }
  });

  commentTabButton.addEventListener("click", () => {
    console.log("Comments button clicked!");
    recipesContent.style.display = "none";
    usersContent.style.display = "none";
    loadingCommentsTab();
    commentsContent.style.display = "block";
  });

  usersTabButton.addEventListener("click", () => {
    console.log("Users button clicked!");
    recipesContent.style.display = "none";
    commentsContent.style.display = "none";
    loadingUsersTab();
    usersContent.style.display = "block";
  });
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

  console.log("Fetcheng recipes from Firestore");
  const recipesRef = collection(db, "recipes");
  const recipesSnapshot = await getDocs(recipesRef);
  cachedRecipes = recipesSnapshot.docs.map((doc) => ({
    id: doc.id,
    data: doc.data(),
  }));
  renderRecipesTable(cachedRecipes);
}

async function renderRecipesTable(recipes) {
  const recipesTableBody = document.querySelector("#recipeTableBody");
  const newRecipesTableBody = recipesTableBody.cloneNode(false);
  recipesTableBody.replaceWith(newRecipesTableBody);

  //   let rows = [];

  //   for (const doc of recipesSnapshot.docs) {
  //     const recipe = doc.data();

  //     const userName = await getUserName(recipe.userId);

  //     const row = `
  //         <tr data-id="${doc.id}">
  //         <td>${recipe.recipeTitle}</td>
  //         <td>${userName}</td>
  //         <td>${dateFormater(recipe)}</td>
  //         <td class="actions-btns">
  //         <button class="action-btn delete">Delete</button>
  //         <button class="action-btn view">View</button>
  //         </td>
  //         </tr>
  //         `;
  //     rows.push(row);
  //   }

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
      // adminPanelModal(recipeId);
    }
  });
}

// async function loadingRecipesTab() {
//   const recipesRef = collection(db, "recipes");
//   const recipesSnapshot = await getDocs(recipesRef);
//   const recipesTableBody = document.querySelector("#recipeTableBody");

//   const newRecipesTableBody = recipesTableBody.cloneNode(false);
//   recipesTableBody.replaceWith(newRecipesTableBody);

//   let rows = [];

//   for (const doc of recipesSnapshot.docs) {
//     const recipe = doc.data();

//     const userName = await getUserName(recipe.userId);

//     const row = `
//         <tr data-id="${doc.id}">
//         <td>${recipe.recipeTitle}</td>
//         <td>${userName}</td>
//         <td>${dateFormater(recipe)}</td>
//         <td class="actions-btns">
//         <button class="action-btn delete">Delete</button>
//         <button class="action-btn view">View</button>
//         </td>
//         </tr>
//         `;
//     rows.push(row);
//   }
//   newRecipesTableBody.innerHTML = rows.join("");
//   newRecipesTableBody.addEventListener("click", (event) => {
//     const target = event.target;
//     console.log(target);
//     const recipeId = target.closest("tr").dataset.id;
//     if (target.classList.contains("delete")) {
//       deleteRecipe(recipeId);
//     } else if (target.classList.contains("view")) {
//         console.log("View");
//         const recipe = recipesSnapshot.docs.find((doc) => doc.id === recipeId).data();
//         adminPanelModal({ ...recipe, id: recipeId });
//         // adminPanelModal(recipeId);
//     }
//   });
// }

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
// // Functioon to delete recipe
// function deleteRecipe(recipeId) {
//   console.log("deleteRecipe func was called");
//   console.log(recipeId);
//   const recipeRef = doc(db, "recipes", recipeId);
//   if (confirm("Are you sure you want to delete this recipe?")) {
//     deleteDoc(recipeRef).then(() => {
//       alert("Recipe deleted");
//       loadingRecipesTab();
//     });
//   }
// }

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
    loadingRecipesTab(); // Заново завантажуємо таб з актуальними даними
  } catch (error) {
    console.log("Error updating recipe: ", error);
  }
}

async function loadingCommentsTab() {
  const commentsRef = collection(db, "comments");
  const commentsSnapshot = await getDocs(commentsRef);
  const commentsTableBody = document.querySelector("#commentsTableBody");
  //   commentsTableBody.innerHTML = "";
  const newCommentsTableBody = commentsTableBody.cloneNode(false);
  commentsTableBody.replaceWith(newCommentsTableBody);

  let rows = [];

  for (const doc of commentsSnapshot.docs) {
    const comment = doc.data();

    const userName = await getUserName(comment.userId);

    console.log(doc.id);

    // const userName = await getUserName(comment.userId);

    const row = `
        <tr data-id="${doc.id}">
        <td>${comment.text}</td>
        <td>${userName}</td>
        <td>${dateFormater(comment)}</td>
        <td class="actions-btns">
        <button id="commentDeleteBtn" class="action-btn delete">Delete</button>
        </td>
        </tr>
        `;

    rows.push(row);
  }
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
      loadingCommentsTab();
    });
  }
}

async function loadingUsersTab() {
  const usersRef = collection(db, "users");
  const usesSnapshot = await getDocs(usersRef);
  const usersTableBody = document.querySelector("#usersTableBody");

  const newUsersTableBody = usersTableBody.cloneNode(false);
  usersTableBody.replaceWith(newUsersTableBody);

  let rows = [];

  for (const doc of usesSnapshot.docs) {
    const user = doc.data();

    const row = `
            <tr data-id="${doc.id}">
                <td>${user.userName}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td class="actions-btns">
                    <button class="action-btn delete">Delete</button>
                </td>
            </tr>
        `;

    rows.push(row);
  }
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
      loadingUsersTab();
    });
  }
}
