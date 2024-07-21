// // Initializing Filestack with API key

// const client = filestack.init('AwxQNt5QZCr9LcJtnxGBQz');
// const imageInput = document.getElementById('upload-button');
// const imageUrlInput = document.getElementById('image-url');

// // Attaching an image upload event

// imageInput.addEventListener('change', (e) => {
//     const file = e.target.files[0];

//     // Image uploading via Filestack

//     client.upload(file).then((response) => {
//         const imageUrl = response.url;
//         console.log("URL: " + imageUrl);

//         // Save url into hidden input

//         imageUrlInput.value = imageUrl;
//         console.log("URL: " + imageUrlInput.value);
//     }).catch((error) => {
//         console.log(error);
//     });
// });

// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
// } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
// import {
//   getFirestore,
//   setDoc,
//   doc,
// } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// import firebaseConfig from "./config.js";