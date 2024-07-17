<?php
require 'config.php';

// Creating connection with db

if ($conn->connect_error) {
    echo "<h2>Sorry, we cannot process your request at this time, please try again later</h2>\n";
    echo "<a href=\"index.php\">Return to Home</a>\n";
    exit;
}

// Retrieving row for searching

$search = $_GET['searchFor'];
$search = mysqli_real_escape_string($conn, $search);
$search = htmlspecialchars($search);
$words = explode(" ", $search);

// Turning each word into an expression with LIKE

$conditions = array();
foreach ($words as $word) {
    $conditions[] = "title LIKE '%$word%'";
}
$whereClause = implode(" OR ", $conditions);

$query = "SELECT recipeid, poster, title, shortdesc, image_path FROM recipes WHERE $whereClause";
$result = $conn->query($query);

if (mysqli_num_rows($result) == 0) {
    echo "<div class=\"no-user-banner\">
            <h1>Sorry, no recipes were found with '$search' in them</h1>
            <div class=\"no-user-banner-inner\">
                <a href=\"index.php\">Try again</a>
            </div>
        </div>\n";
} else {
    echo "<div class=\"search-block-wrapper\">";
    echo "<h1>Search Results</h1>\n";
    if ($search == '') {
        echo "<p class=\"description\">Incidunt at doloremque optio tenetur sit amet consectetur, adipisicing elit. Tenetur, dolorum</p>";
    } else {
        echo "<p class=\"description\">All search results with keyword <b>$search<b></p>";
    }
    echo "<div class=\"search-block\">";

    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
        $recipeid = $row['recipeid'];
        $poster = $row['poster'];
        $title = $row['title'];
        $shortdesc = $row['shortdesc'];

        $maxLengthWords = 20;
        $words = str_word_count($shortdesc, 1);

        if (count($words) > $maxLengthWords) {
            $words = array_slice($words, 0, $maxLengthWords);

            $shortdesc = implode(' ', $words) . '...';
        }

        $image = $row['image_path'];

        // Checking if `image_path` is `NULL` and setting the path to `default.jpg` if so
        
        if ($image == null) {
            $image = 'img/default.jpg';
        }

        echo "<div class=\"recipe-block\"\n>
                <a href=\"index.php?content=showrecipe&id=$recipeid\">
                    <div class=\"overlay\">
                        <p>Open</p>
                    </div>
                    <div class=\"content-wrapper\">
                        <h3>$title</h3>
                        <img src=\"$image\" alt=\"Recipe img\">\n
                        <div class=\"text-block\">
                            <span>$shortdesc</span>
                            <div class=\"text-inner-block \">
                                <hr>
                                <div class=\"text-inner\" style=\"display: flex;\">
                                    <p>Posted by</p>
                                    <span>&nbsp;$poster</span>
                                </div>
                            </div>
                        </div>
                    </div>\n
                </a>\n
            </div>";
    }
    echo "</div>";
    echo "</div>";
}
$conn->close();
?>
<div class="newsletter-block">
    <?php
    include('newsletter.inc.php');
    ?>
</div>