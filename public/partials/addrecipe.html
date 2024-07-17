<?php
require 'config.php';
require 'vendor/autoload.php';

// Auth check

session_start();
if (!isset($_SESSION['valid_recipe_user'])) {
    echo "<div class=\"no-user-banner\">
            <h1>Sorry, you must be logged in to post a recipe</h1>
            <div class=\"no-user-banner-inner\">
                <a href=\"index.php?content=login\">Try again</a>
                <p>&ensp;/&ensp;</p>
                <a href=\"index.php\">Home</a>
            </div>
        </div>\n";
    exit;
}


// Connecting to db

if ($conn->connect_error) {
    echo "<div class=\"no-user-banner\">
            <h1>Sorry, we cannot process your request at this time, please try again later</h1>
            <div class=\"no-user-banner-inner\">
                <a href=\"index.php\">Home</a>
            </div>
        </div>\n";
    exit;
}

// Obtaining the ID of the authorized user

$userId = $_SESSION['valid_recipe_user'];

// Input validation and data processing

$title = $_POST['title'];
$poster = $_SESSION['valid_recipe_user'];
$shortdesc = $_POST['shortdesc'];
$ingredients = $_POST['ingredients'];
$directions = $_POST['directions'];

$ingredientsString = serialize($ingredients);
$directionsString = serialize($directions);

$date = date("Y-m-d");


// File upload processing

if (isset($_POST['image_url'])) {
    $imageUrl = $_POST['image_url'];
    $data = $conn->prepare("INSERT INTO recipes (title, poster, shortdesc, ingredients, directions, image_path, date) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $data->bind_param("sssssss", $title, $poster, $shortdesc, $ingredientsString, $directionsString, $imageUrl, $date);

    if ($data->execute()) {

        // Getting ID of new recipe

        $recipeId = $data->insert_id;

        // Execute the query

        echo "<script>
        window.location.href = 'index.php?content=showrecipe&id=$recipeId';
        setTimeout(function() {
        });
        </script>";
    } else {
        echo "Error: file was not uploaded";
    }
} else {

    // Handle the case when no image URL is provided

    echo "Error: Image URL is missing";
}

$data->close();
$conn->close();
?>