import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

import firebaseConfig from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// const recipesRef = collection(db, "recipes");
const usersRef = collection(db, "users");
const commentsRef = collection(db, "comments");

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

export default async function commentLogic(recipeId) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      document.querySelector(
        ".please-log-in"
      ).innerHTML = `Please <a href="index.html?content=login">log in</a> to leave a comment`;
    }
    document
      .querySelector("#commentForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        const commentText = document.getElementById("commentText").value;
        //   const parentId = document.getElementById("parentId").value || null;

        console.log(recipeId, commentText);

        await submitComment(recipeId, commentText);
      });

    loadComments(recipeId);
  });
}
async function submitComment(recipeId, commentText) {
  console.log(recipeId, commentText);
  console.log("submitComment func was called");
  const user = auth.currentUser;

  //   if (!user) {
  //     alert("You must to enter the account to leave a comment");
  //     document.querySelector("#commentText").value = "";
  //     document.querySelector(".please-log-in").innerHTML = `Please <a href="index.html?content=login">log in</a> to leave a comment`;
  //   }

  try {
    await addDoc(commentsRef, {
      recipeId: recipeId,
      text: commentText,
      userId: user.uid,
      timestamp: serverTimestamp(),
    });
    alert("Comment added!");
    document.querySelector("#commentText").value = "";
    loadComments(recipeId);
  } catch (error) {
    console.error("Error while adding a comment");
    alert("Failed to add comment. Please try again later.");
  }
}

async function loadComments(recipeId) {
  console.log("loadComments func was called");

  const commentsQuery = query(
    commentsRef,
    where("recipeId", "==", recipeId),
    orderBy("timestamp", "desc")
  );

  const commentsSnapshot = await getDocs(commentsQuery);

  console.log("commentsSnapshot.docs:", commentsSnapshot.docs);

  const commentsContainer = document.querySelector(".comment-container-block");
  commentsContainer.innerHTML = "";

  // Ініціалізація commentPromises
  const commentPromises = commentsSnapshot.docs.map(async (commentDoc) => {
    const comment = commentDoc.data();
    const commentId = commentDoc.id;

    const userName = await getUserName(comment.userId);
    console.log("userName:", userName);

    return {
      commentId,
      userName,
      comment,
    };
  });

  console.log("commentPromises:", commentPromises);

  // Виконання всіх промісів одночасно
  const commentsData = await Promise.all(commentPromises);

  console.log("commentsData:", commentsData);

  const commentCountSpan = document.querySelector("#commentCount");
  if (commentsData.length === 0) {
    commentCountSpan.textContent = "No comments yet";
  } else {
    commentCountSpan.textContent = commentsData.length + " comments posted";
  }

  commentsData.forEach(({ userName, comment }) => {
    const commentElement = document.createElement("div");
    commentElement.classList.add("comment-container");
    commentElement.innerHTML = `
        <div class="comment-author">
          <h2>${userName}</h2>
        </div>
        <div class="comment-text">
          <p>${comment.text}</p>
        </div>
        <div class="date-posted">
          <p>${comment.timestamp.toDate().toLocaleString()}</p>
        </div>
      `;

    commentsContainer.appendChild(commentElement);
  });
}
