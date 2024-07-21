import { initRegister } from './firebase.js';
import { logIn } from './firebase.js';
// import { logout } from './firebase.js';

// Function for loading a page
function loadPage(containerId, url, callback) {
  fetch(url)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.text();
      })
      .then(data => {
          document.getElementById(containerId).innerHTML = data;

          // Call callback after successful loading of page, if provided.
          if (callback) callback();
      })
      .catch(error => {
          console.error('Error loading page:', error);
          document.getElementById(containerId).innerHTML = '<div>Error loading page</div>';
      });
}

// NEWSLETTER BLOCK ELEMENT LOADING

// Function for loading the newsletter block
function loadNewsletterBlock() {
  let mainDiv = document.getElementById("main");
  if (!mainDiv) {
      console.error("Element with id 'main' not found.");
      return;
  }

  // Check if the newsletter block exists in the loaded content
  let newsletterBlock = mainDiv.querySelector(".newsletter-block");
  if (!newsletterBlock) {
      console.error("Element with class 'newsletter-block' not found in the loaded content.");
      return;
  }

  // Load newsletter.html
  fetch("partials/newsletter.html")
      .then(response => {
          if (!response.ok) {
              throw new Error("Network response was not ok");
          }
          return response.text();
      })
      .then(newsletterData => {
          newsletterBlock.innerHTML = newsletterData;
      })
      .catch(error => {
          console.error("Error loading newsletter:", error);
          newsletterBlock.innerHTML = "<div>Error loading newsletter</div>";
      });
}

// Call loadPage() when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
  loadPage("header", "partials/header.html");
  loadPage("footer", "partials/footer.html");
  const content = new URLSearchParams(window.location.search).get("content") || "home";
  loadPage("main", `pages/${content}.html`, function() {
      // Call loadNewsletterBlock() if the content is "home"
      if (content === "home") {
          loadNewsletterBlock();
      } else if (content === "register") {
          initRegister();
      } else if (content === "login") {
          logIn();
      } else if (content === "logout") {
          // logout();
          window.location.href = "index.html";
      }
  });
});

