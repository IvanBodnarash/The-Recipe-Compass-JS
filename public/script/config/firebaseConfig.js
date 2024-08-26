import {
  initializeApp,
  getApps,
  getApp,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import {
  doc,
  getDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";


const firebaseConfig = {
    apiKey: "AIzaSyDtBv4M4rc0OTQdQAgQS_53mz4LoF0yp7I",
    authDomain: "the-recipe-compass.firebaseapp.com",
    projectId: "the-recipe-compass",
    storageBucket: "the-recipe-compass.appspot.com",
    messagingSenderId: "819128965055",
    appId: "1:819128965055:web:bb74d8179a3a014153730a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);
