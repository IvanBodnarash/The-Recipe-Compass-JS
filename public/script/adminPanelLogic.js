import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to get user name
async function getUserName(userId) {
  const userDoc = await getDoc(doc(db, "users", userId));
  if (userDoc.exists()) {
    return userDoc.data().userName;
  } else {
    console.log(`User with ID ${userId} not found.`);
    return "Unknown";
  }
}

export default async function adminPanelLogic() {
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
    loadingRecipesTab();
    recipesContent.style.display = "block";
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
  const date = timestamp.toDate();
  const formattedDate = date.toLocaleString("us", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return formattedDate;
}

async function loadingRecipesTab() {
  const recipesRef = collection(db, "recipes");
  const recipesSnapshot = await getDocs(recipesRef);
  const recipesTableBody = document.querySelector("#recipeTableBody");
  recipesTableBody.innerHTML = "";

  let rows = [];

  for (const doc of recipesSnapshot.docs) {
    const recipe = doc.data();

    const userName = await getUserName(recipe.userId);

    const row = `
        <tr>
        <td>${recipe.recipeTitle}</td>
        <td>${userName}</td>
        <td>${dateFormater(recipe)}</td>
        <td>
        <button class="action-btn delete">Delete</button>
        <button class="action-btn">View</button>
        </td>
        </tr>
        `;
    rows.push(row);
  }
  recipesTableBody.innerHTML = rows.join("");
  rows = [];
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
        <td>
        <button id="commentDeleteBtn" class="action-btn delete">Delete</button>
        </td>
        </tr>
        `;

    rows.push(row);
  }
  newCommentsTableBody.innerHTML += rows.join("");
//   rows = [];

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

// Functioon to delete comment
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
  usersTableBody.innerHTML = "";

  let rows = [];

  for (const doc of usesSnapshot.docs) {
    const user = doc.data();

    // const userName = await getUserName(comment.userId);

    const row = `
            <tr>
                <td>${user.userName}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button class="action-btn delete" onclick="deleteUserFromAdminPanel('${doc.id}')">Delete</button>
                </td>
            </tr>
        `;

    rows.push(row);
  }
  usersTableBody.innerHTML += rows.join("");
  rows = [];
}

// const usersTableBody = document.querySelector("#usersTableBody");
