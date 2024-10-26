# The Recipe Compass

<p align="center">
  <img src="./public/img/the-recipe-compass-mockup.png" alt="Project Screenshot" width="600"/>
</p>

## Table of contents

1. [Description](#description)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Demo and Links](#demo-and-links)
5. [Running the Project Locally](#running-the-project-locally)
6. [Firebase Configuration](#firebase-configuration)
7. [Color Palette](#color-palette)
8. [Author](#author)

## Description

**The Recipe Compass** is a recipe management system that allows users to post their own recipes, comment on other users recipes, search, edit and create personal accounts. The app has two roles: user and admin. With admin access you can edit and delete recipes. Also admin can delete users or comments

Originally built with PHP, MySQL, and hosted on Heroku, the project was later revamped with HTML, CSS, JavaScript, Firebase for the backend, Unsplash API for image integration and deployed on Firebase Hosting.

## Tech Stack

- HTML, CSS, JavaScript – for building the user interface
- Firebase – as the backend for data handling, storing user images, hosting and authorize users
- Unsplash API – for recipe image search and integration

## Features

- **Authentication and Registration:** Users can create accounts or log in
- **Image Search via Unsplash API:** Add relevant images to recipes (or user can upload their image from local storage)
- **Add and Edit Recipes:** Create, update, or delete recipes
- **Commenting:** Users can comment on each other's recipes
- **Admin Panel:** Manage recipes, comments, and user accounts
- **Sorting Options:** Sort recipes by alphabetical order, author, or date added
- **Search:** Easily find recipes using keywords
- **Print Recipes:** Print any recipe directly from the app for offline use

## Demo and Links

- View Live: [The Recipe Compass](https://the-recipe-compass.web.app/)
- GitHub Repository: [GitHub Repository](https://github.com/IvanBodnarash/The-Recipe-Compass-JS/)

## Running the Project Locally

### Prerequisites

- **Node.js** installed
- A **Firebase account** with a configured project (if you plan to deploy)

### Steps

1. **Install the Live Server extension:**

   - Open **Visual Studio Code (VS Code)** or another code editor that supports extensions.
   - Go to the **Extensions** tab on the left sidebar.
   - Search for **Live Server** and install it.

2. **Open the Project:**

   - Open your project folder in VS Code.
   - In the folder, locate the file `index.html` (usually in the root or in a `public` folder).

3. **Start Live Server:**

   - Right-click on `index.html` and select **Open with Live Server.**
   - This action will open a new browser tab with your project loaded and running locally.

4. **Testing and Auto-Reloading:**

   - As you make changes in your code, **Live Server** will automatically reload the page in your browser, allowing you to instantly see the results without needing to refresh manually.

## Firebase Configuration

To run the project, Firebase configuration must be set up.

Change a `firebaseConfig.js` file in `/public/script/config` directory of the project.
Add your Firebase configuration data:

```js
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
};
```

You can find these details in the Firebase Console after creating your project. Replace your-api-key, your-auth-domain, and others with your specific data.

## Color Palette

Here’s the color palette used in The Recipe Compass:

| Color Name      | Hex Code  | Color Sample                         |
|-----------------|-----------|--------------------------------------|
| Primary Color   | `#D0E7D2` | <span style="color:#D0E7D2">⬤</span> |
| Secondary Color | `#EDF9ED` | <span style="color:#EDF9ED">⬤</span> |
| Background      | `#618264` | <span style="color:#618264">⬤</span> |
| Text Color      | `#454545` | <span style="color:#454545">⬤</span> |
| Light Accent    | `#CCE7CD` | <span style="color:#CCE7CD">⬤</span> |

## Author
Designed and built by Ivan Bodnarash.