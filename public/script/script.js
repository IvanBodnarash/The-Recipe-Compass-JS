"use strict";

const isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    return (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows()
    );
  },
};

if (isMobile.any()) {
  document.body.classList.add("_touch");
  console.log("added class _touch");
} else {
  document.body.classList.add("_pc");
  console.log("added class _pc");
}

// Menu

// const iconMenu = document.querySelector(".menu-icon");

// console.log(iconMenu);
// if (iconMenu) {
//   const navbarMenu = document.querySelector(".navbar-nav");
//   iconMenu.addEventListener("click", function (e) {
//     console.log("clicked");
//     document.body.classList.toggle("_lock");
//     iconMenu.classList.toggle("_active");
//     navbarMenu.classList.toggle("_active");
//   });
// }


document.addEventListener("DOMContentLoaded", function () {
  
  // Scroll arrow
  let scrollButton = document.getElementById("scroll-to-top");

  window.onscroll = function () {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      scrollButton.classList.remove("hidden");
    } else {
      scrollButton.classList.add("hidden");
    }
  };

  scrollButton.addEventListener("click", function () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });
});

// ADDING/REMOVING INGREDIENTS TO ARRAY AND ITS LOGIC

function addIngredient() {
  let container = document.querySelector("#ingredients-container");

  let input = document.createElement("input");
  input.name = "ingredients[]";
  input.type = "text";

  let removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.innerHTML = "Remove";
  removeButton.onclick = function () {
    removeIngredient(input, removeButton);
  };

  let div = document.createElement("div");
  div.classList.add("ingredient-item");
  div.appendChild(input);
  input.classList.add("input-field");
  div.appendChild(removeButton);

  container.appendChild(div);
}

function removeIngredient(input) {
  let container = document.querySelector("#ingredients-container");
  container.removeChild(input.parentNode);
}

// ADDING/REMOVING DIRECTIONS TO ARRAY AND ITS LOGIC

function addDirection() {
  let container = document.querySelector("#directions-container");

  let textarea = document.createElement("textarea");
  textarea.name = "directions[]";

  let removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.innerHTML = "Remove";
  removeButton.onclick = function () {
    removeDirection(textarea, removeButton);
  };

  let div = document.createElement("div");
  div.classList.add("direction-item");
  div.appendChild(textarea);
  textarea.classList.add("input-field");
  div.appendChild(removeButton);

  container.appendChild(div);
}

function removeDirection(textarea, button) {
  let container = document.querySelector("#directions-container");
  container.removeChild(textarea.parentNode);
}

// CHECKBOX STRIKETHROUGH

function toggleStrikethrough(checkboxId) {
  let labelId = "label_" + checkboxId;
  let labelElement = document.getElementById(labelId);

  if (labelElement.classList.contains("strikethrough")) {
    labelElement.classList.remove("strikethrough");
  } else {
    labelElement.classList.add("strikethrough");
  }
}

// RECIPE PRINTING

function printRecipe() {
  window.print();
}

// function displayFileName() {
//   let fileInput = document.getElementById("uploadImgButton");
//   let fileNameDisplay = document.getElementById("fileName");

//   setTimeout(() => {
//     if (fileInput.files.length > 0) {
//       let fileName = fileInput.files[0].name;

//       if (fileName.length > 25) {
//         fileName = fileName.substring(0, 22) + "...";
//       }

//       fileNameDisplay.textContent = fileName;
//     } else {
//       fileNameDisplay.textContent = "";
//     }
//   }, 1500);
// }