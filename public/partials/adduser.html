<?php
require 'config.php';

// // Connecting to db

if ($conn->connect_error) {
    echo "<div class=\"no-user-banner\">
            <h1>Sorry, we cannot process your request at this time, please try again later</h1>
            <div class=\"no-user-banner-inner\">
                <a href=\"index.php\">Home</a>
            </div>
        </div>\n";
    exit;
}

// Input validation and data processing

$userid = $_POST['userid'];
$password = $_POST['password'];
$password2 = $_POST['password2'];
$fullname = $_POST['fullname'];
$email = $_POST['email'];

if (empty($userid) || empty($password) || empty($password2)) {
    echo "<div class=\"no-user-banner\">
            <h1>Sorry, you must fill in all required fields</h1>
            <div class=\"no-user-banner-inner\">
                <a href=\"index.php?content=register\">Try again</a>
                <p>&ensp;/&ensp;</p>
                <a href=\"index.php\">Home</a>
            </div>
        </div>\n";
    include("footer.inc.php");
    exit;
}

if ($password != $password2) {
    echo "<div class=\"no-user-banner\">
            <h1>Sorry, the passwords you entered did not match</h1>
            <div class=\"no-user-banner-inner\">
                <a href=\"index.php?content=register\">Try again</a>
                <p>&ensp;/&ensp;</p>
                <a href=\"index.php\">Home</a>
            </div>
        </div>\n";
    include("footer.inc.php");
    exit;
}

// Checking if the user exists

$query = "SELECT userid FROM users WHERE userid = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $userid);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if ($row !== null && isset($row['userid']) && $row['userid'] == $userid) {
    echo "<div class=\"no-user-banner\">
        <h1>Sorry, that user name is already taken</h1>
        <div class=\"no-user-banner-inner\">
            <a href=\"index.php?content=register\">Try again</a>
            <p>&ensp;/&ensp;</p>
            <a href=\"index.php\">Home</a>
        </div>
    </div>\n";
    include("footer.inc.php"); 
    exit;
}

// Inserting a user into the database

$query = "INSERT INTO users (userid, password, fullname, email) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("ssss", $userid, $hashed_password, $fullname, $email);

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

if ($stmt->execute()) {
    $_SESSION['valid_recipe_user'] = $userid;
    echo "<div class=\"no-user-banner\">
            <h1>Your registration request has been approved, and you are now logged in!</h1>
            <div class=\"no-user-banner-inner\">
                <a href=\"index.php\">Home</a>
            </div>
        </div>\n";
        include("footer.inc.php"); 
} else {
    echo "<div class=\"no-user-banner\">
            <h1>Sorry, there was a problem processing your registration request</h1>
            <div class=\"no-user-banner-inner\">
                <a href=\"index.php?content=register\">Try again</a>
                <p>&ensp;/&ensp;</p>
                <a href=\"index.php\">Home</a>
            </div>
        </div>\n";
        include("footer.inc.php"); 
}
$stmt->close();
$conn->close();
?>


<div class="newsletter-block">
    <?php
    include('newsletter.inc.php');
    ?>
</div>
<div id="footer">
    <?php
    include("footer.inc.php");
    ?>
</div>