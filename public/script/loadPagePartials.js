function loadNewsletterBlock() {
  let mainDiv = document.getElementById("main");
  if (!mainDiv) {
    console.error("Element with id 'main' not found.");
    return;
  }

  // Condition for displaying content (test)
  let testCondition = true;

  // Load newsletter.html after home.html
  let newsletterBlock = mainDiv.querySelector(".newsletter-block");
  if (!newsletterBlock) {
    console.error(
      "Element with class 'newsletter-block' not found in home.html."
    );
    return;
  }

  // Load home.html first
  fetch("pages/newsletter.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then(newsletterData => {
      newsletterBlock.innerHTML = newsletterData;
    })
    .catch((error) => {
      console.error("Error loading page:", error);
      newsletterBlock.innerHTML = "<div>Error loading page</div>";
    });
}

document.addEventListener("DOMContentLoaded", function () {
  // loadNewsletterBlock();
});
// function loadNewsletterBlock() {
//     let mainDiv = document.getElementById("main");
//     if (!mainDiv) {
//       console.error("Element with id 'main' not found.");
//       return;
//     }

//     // Condition for displaying content (test)
//     let testCondition = true;

//     // Load home.html first
//     fetch("pages/home.html")
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return response.text();
//       })
//       .then((data) => {
//         mainDiv.innerHTML = data;

//         // Load newsletter.html after home.html
//         let newsletterBlock = mainDiv.querySelector(".newsletter-block");
//         if (!newsletterBlock) {
//           console.error(
//             "Element with class 'newsletter-block' not found in home.html."
//           );
//           return;
//         }

//         // Load content of newsletter.html
//         if (testCondition) {
//           fetch("partials/newsletter.html")
//             .then((response) => {
//               if (!response.ok) {
//                 throw new Error("Network response was not ok");
//               }
//               return response.text();
//             })
//             .then((newsletterData) => {
//               newsletterBlock.innerHTML = newsletterData;
//             })
//             .catch((error) => {
//               console.error("Error loading page:", error);
//               newsletterBlock.innerHTML = "<div>Error loading page</div>";
//             });
//         } else {
//           newsletterBlock.innerHTML = "<div>No content</div>";
//         }
//       })
//       .catch((error) => {
//         console.error("Error loading page:", error);
//         mainDiv.innerHTML = "<div>Error loading page</div>";
//       });
//   }

//   document.addEventListener("DOMContentLoaded", function() {
//     loadNewsletterBlock();
//   });
