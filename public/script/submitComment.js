// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirebaseFirestore, getFirebaseAuth } from "./firebaseInit.js";
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

// import firebaseConfig from "./config.js";
// import firebaseConfig from "./config/firebaseConfig.js";


// Function to get the user name from the database
async function getUserName(usersRef, userId) {
  const userDoc = await getDoc(doc(usersRef, userId));
  if (userDoc.exists()) {
    return userDoc.data().userName;
  } else {
    console.log(`User with ID ${userId} not found.`);
    return "Unknown";
  }
}

export default async function commentLogic(recipeId) {
  try {
    const auth = await getFirebaseAuth();
    const db = await getFirebaseFirestore();
    
    const usersRef = collection(db, "users");
    const commentsRef = collection(db, "comments");

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
  
          await submitComment(usersRef, commentsRef, recipeId, commentText, auth);
        });
  
      loadComments(usersRef, commentsRef, recipeId);
    });
  } catch (error) {
    console.error("Error in commentLogic:", error);
  }
}
async function submitComment(usersRef, commentsRef, recipeId, commentText, auth) {
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
    document.querySelector("#commentText").value = "";
    loadComments(usersRef, commentsRef, recipeId);
  } catch (error) {
    console.error("Error while adding a comment");
    alert("Failed to add comment. Please try again later.");
  }
}

async function loadComments(usersRef, commentsRef, recipeId) {
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

    const userName = await getUserName(usersRef, comment.userId);
    console.log("userName:", userName);

    return {
      commentId,
      userName,
      comment,
    };
  });

  console.log("commentPromises:", commentPromises);

  // Executing all promises in parallel using Promise.all
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
