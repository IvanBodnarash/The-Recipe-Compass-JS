<div class="main-recipe-block">
    <h1 class="header-text">Discover all recipes</h1>
    <p class="description">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tenetur, dolorum! Incidunt at doloremque optio tenetur</p>
    <div class="sort-block-wrapper">
        <div class="sort-block">
            <a href="index.php?content=recipes&sort=title&order=asc">Sort by Title</a>
            <a href="index.php?content=recipes&sort=poster&order=asc">Sort by Poster</a>
            <a href="index.php?content=recipes&sort=date&order=desc">Sort by Date</a>
        </div>
        <div class="sorted-by-block">
            <?php
            $sort = isset($_GET['sort']) ? $_GET['sort'] : 'date';
            $order = isset($_GET['order']) && $_GET['order'] === 'asc' ? 'asc' : 'desc';

            $sortText = '';

            switch ($sort) {
                case 'title':
                    $sortText = 'Sorted by Title';
                    break;
                case 'poster':
                    $sortText = 'Sorted by Poster';
                    break;
                case 'date':
                    $sortText = 'Sorted by Date';
                    break;
                default:
                    $sortText = 'Sorted by Alphabet';
                    break;
            }

            echo "<p>$sortText</p>"; ?>
        </div>
    </div>
    <div class="recipes-wrapper">
        <?php
        require 'config.php';

        // Connection check

        if ($conn->connect_error) {
            echo "<div class=\"no-user-banner\">
                    <h1>Sorry, we cannot process your request at this time, please try again later</h1>
                    <div class=\"no-user-banner-inner\">
                        <a href=\"index.php?content=login\">Login</a>
                        <p>&ensp;/&ensp;</p>
                        <a href=\"index.php\">Home</a>
                    </div>
                </div>\n";
            exit;
        }
        
        // Defining the sort option (if set in the URL)

        $sortOptions = array('user' => 'poster', 'title' => 'title', 'date' => 'date');
        $sort = isset($_GET['sort']) && isset($sortOptions[$_GET['sort']]) ? $sortOptions[$_GET['sort']] : 'date';

        $query = "SELECT recipeid, poster, title, shortdesc, image_path, date FROM recipes ORDER BY $sort $order";

        $result = $conn->query($query);
        
        if (mysqli_num_rows($result) == 0) {
            echo "<div class=\"no-user-banner\">
                    <h1>Sorry, there are no recipes posted at this time, please try back later</h1>
                    <div class=\"no-user-banner-inner\">
                        <a href=\"index.php\">Home</a>
                    </div>
                </div>\n";
        } else {
            while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
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
        }

        $conn->close();
        ?>
    </div>
    <div class="add-new-recipe-block">
        <h1>Add new recipe</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti possimus veniam deserunt aut sint quidem, illo cum veritatis animi a magni harum impedit iste dolorum.</p>
        <div class="add-new-recipe-btn-block">
            <a href="index.php?content=newrecipe" class="add-new-recipe-btn">
                <i class="fas fa-plus"></i> Add New Recipe</a>
        </div>
    </div>
</div>