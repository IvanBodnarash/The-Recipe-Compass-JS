<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="style/print.css" />
    <link rel="icon" href="img/brand-logo.png" type="image/x-icon">
    <title>The Recipe Compass</title>

    <script>
        window.print();
    </script>
</head>
<body>
    <?php

    require 'config.php';

    // // Connecting to db
    
    if ($conn->connect_error) {
        echo "<h2>Sorry, we cannot process your request at this time, please try again later</h2>\n";
        echo "<a href=\"index.php\">Return to Home</a>\n";
        exit;
    }
    
    $recipeid = $_GET['id'];
    
    $query = "SELECT title, poster, shortdesc, ingredients, directions, image_path, date FROM recipes WHERE recipeid = $recipeid";

    $result = $conn->query($query);
    $row = $result->fetch_array(MYSQLI_ASSOC);

    $title = $row['title'];
    $poster = $row['poster'];
    $shortdesc = $row['shortdesc'];
    $ingredients = $row['ingredients'];
    $directions = $row['directions'];
    $image = $row['image_path'];
    $ingredients = nl2br($ingredients);
    $directions = nl2br($directions);

    $datePost = $row['date'];
    $datePostFormatted = date("d F, Y", strtotime($datePost));

    if($image == null) {
        $image = 'img/default.jpg';
    }

    echo "<div class=\"page-banner\">
            <h1>$title</h1>
        </div>";

    echo "<div class=\"page-content\">";
    echo "<div class=\"recipe-block-single\">";
    echo "<div class=\"recipe-block-wrapper\">
            <div class=\"img-recipe\">
                <img src=\"$image\" alt=\"img\">
            </div>
            <div class=\"sidebar-wrapper\">
                <div class=\"recipe-sidebar\">
                    <h1>Author / User</h1>
                    <div class=\"author-block\">
                        <div class=\"author-inner-block\">
                            <img src=\"img/cook.jpg\" style=\"width: 30px\" alt=\"cookimg\">
                            <h2>$poster</h2>
                        </div>
                        <span>Posted On: $datePostFormatted</span>
                    </div>
                </div>


            </div>
        </div>";
    echo "<div class=\"recipe-sidebar\">
            <span class=\"description\">$shortdesc</span>
        </div>";

    // INGREDIENTS BLOCK
    
    echo "<div class=\"ingredients-block\">";
    echo "<div class=\"ingredients-block-container\">
            <i class=\"fa-solid fa-seedling\"></i>
            <h1>Ingredients</h1>
        </div>";

    if(!empty($row['ingredients'])) {
        $ingredients = unserialize($row['ingredients']);

        $i = 1;

        foreach($ingredients as $ingredient) {
            echo "<div class=\"form-check\">
                    <input type=\"checkbox\" class=\"form-check-input\" id=\"ing$i\" onchange=\"toggleStrikethrough('ing$i')\">
                    <label for=\"ing$i\" id=\"label_ing$i\">$ingredient</label>
                </div>";
            $i++;
        }
    }
    echo "</div>";

    echo "<hr>";

    // DIRECTIONS BLOCK
    
    echo "<div class=\"directions-block\">";
    echo "<div class=\"directions-block-container\">
            <i class=\"fa-solid fa-layer-group\"></i>
            <h1>Directions</h1>
        </div>";
    echo "<div class=\"sequence\">";

    if(!empty($row['directions'])) {
        $directions = unserialize($row['directions']);

        echo "<ol class=\"directions-list\">";

        foreach($directions as $direction) {
            echo "<li class=\"directions-item\">$direction</li>";
        }

        echo "</ol>";
    }
    echo "</div>";
    echo "</div>";

    echo "</div>";

    $conn->close();
    ?>
    <script src="//static.filestackapi.com/filestack-js/3.x.x/filestack.min.js"></script>
    <script src="script/app.js"></script>
    <script src="script/script.js"></script>
</body>
</html>