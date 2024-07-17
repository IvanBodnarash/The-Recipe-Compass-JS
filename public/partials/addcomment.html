<?php
require 'config.php';

if (isset($_SESSION['valid_recipe_user']) && $_SESSION['can_post_comments'] === true) {

    // The user has the right to add comments
    // Get the comment data from the form, for example $comment
    // Get the username from the session if available

    $poster = isset($_SESSION['valid_recipe_user']) ? $_SESSION['valid_recipe_user'] : "Anonymous";

    // Checking connection

    if ($conn->connect_error) {
        die("Database connection error: " . $conn->connect_error);
    }

    // Retrieving data

    $recipeid = $_POST['recipeid'];
    $comment = htmlspecialchars($_POST['comment']);
    $date = date("Y-m-d");

    $query = "INSERT INTO comments (recipeid, poster, date, comment) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("isss", $recipeid, $poster, $date, $comment);

    if ($stmt->execute()) {
        echo "<h2>Comment posted</h2>\n";
        echo "<a href=\"index.php\">Return to Home</a>\n";
    } else {
        echo "<h2>Sorry, there was a problem posting your comment</h2>\n";
        echo "<a href=\"index.php?content=showrecipe&id=$recipeid\">Return to recipe</a>\n";
    }

    $stmt->close();
    $conn->close();
} else {

    // The user does not have the right to add comments
    
    echo "<h2>Sorry, you do not have permission to post comments</h2>";
    echo "<a href=\"index.php\">Return to Home</a>\n";
}
?>