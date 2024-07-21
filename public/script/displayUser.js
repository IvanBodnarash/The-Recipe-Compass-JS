import { auth } from "./firebase.js";

export function displayUsername() {
    console.log('Attempting to display username');
    const usernameSpan = document.querySelector("#usernameSpan");
    if (!usernameSpan) {
        console.error("Element with id 'usernameSpan' not found");
        return;
    }

    const username = localStorage.getItem("valid_recipe_user");
    console.log('Checking auth state...');
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('User is authenticated:', user.username);
            usernameSpan.textContent = user.username;
        } else {
            console.log('User is not authenticated');
            usernameSpan.textContent = "";
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    displayUsername();
});