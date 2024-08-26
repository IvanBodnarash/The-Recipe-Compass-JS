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
// import unsplashAPIKey from "./config/unsplashConfig";

let firebaseConfigCache = null;
let appInstance = null;

export async function getUnsplashApiKey() {
  console.log("Fetching Unsplash api key from db...");

  try {
    const app = await initializeFirebase();
    const db = getFirestore(app);

    const unsplashDoc = await getDoc(doc(db, "config", "unsplashAuth"));

    if (unsplashDoc.exists()) {
      const unsplashAPIKey = unsplashDoc.data().unsplashAPIKey;
      console.log("Unsplash API Key succesfully fetched:", unsplashAPIKey);
      return unsplashAPIKey;
    } else {
      throw new Error("Unsplash API Key document not found");
    }
  } catch (error) {
    console.error("Error fetching unsplash key:", error);
  }
}

async function getFirebaseConfig() {
  console.log("Fetching Firebase config...");

  if (firebaseConfigCache) {
    console.log("Using cached Firebase config:", firebaseConfigCache);
    return firebaseConfigCache;
  }

  const apps = getApps();
  let firestoreDb;

  try {
    if (apps.length) {
      //   console.log("Firebase app already initialized", getApp());
      const app = getApp();
      firestoreDb = getFirestore(app);
    } else {
      console.log("No initialized Firebase apps found");
      firestoreDb = getFirestore();
    }

    const configDoc = await getDoc(
      doc(firestoreDb, "config", "firebaseConfig")
    );

    if (configDoc.exists()) {
      firebaseConfigCache = configDoc.data();
      console.log("Firebase config successfully fetched");
      return firebaseConfigCache;
    } else {
      throw new Error("Firebase config doc not found");
    }
  } catch (error) {
    console.error("Error fetching Firebase config:", error);
    throw error;
  }
}

async function initializeFirebase() {
  console.log("Initializing Firebase...");

  if (!appInstance) {
    try {
      const firebaseConfig = await getFirebaseConfig();
      if (getApps().length === 0) {
        appInstance = initializeApp(firebaseConfig);
        console.log("Firebase initialized successfully", appInstance);
      } else {
        appInstance = getApp();
        console.log("Firebase app already exists, using existing app");
      }
    } catch (error) {
      console.error("Failed to initialize Firebase", error);
      throw error;
    }
  }
  return appInstance;
}

export async function getFirebaseAuth() {
  console.log("Fetching Firebase auth...");
  try {
    const app = await initializeFirebase();
    return getAuth(app);
  } catch (error) {
    console.error("Error fetching Firebase auth:", error);
    throw error;
  }
}

export async function getFirebaseFirestore() {
  console.log("Fetching Firebase firestore...");
  try {
    const app = await initializeFirebase();
    return getFirestore(app);
  } catch (error) {
    console.error("Error fetching Firebase firestore:", error);
    throw error;
  }
}

export async function getFirebaseStorage() {
  console.log("Fetching Firebase storage...");
  try {
    const app = await initializeFirebase();
    return getStorage(app);
  } catch (error) {
    console.error("Error fetching Firebase storage:", error);
    throw error;
  }
}
