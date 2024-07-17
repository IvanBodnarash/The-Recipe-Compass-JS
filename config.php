<?php

//Get Heroku ClearDB connection information

$cleardb_server = getenv('DB_SERVER');
$cleardb_username = getenv('DB_USERNAME');
$cleardb_password = getenv('DB_PASSWORD');
$cleardb_db = getenv('DB_NAME');

//Get Heroku ClearDB connection information

// $cleardb_server = 'localhost';
// $cleardb_username = 'test';
// $cleardb_password = 'test159951test!';
// $cleardb_db = 'recipe';

// Filestack api key

$filestack_api_key = getenv('FS_API_KEY');

// Connecting to database

$conn = new mysqli($cleardb_server, $cleardb_username, $cleardb_password, $cleardb_db);

// Checking connection

if ($conn->connect_error) {
    die("Connection to db error: " . $conn->connect_error);
}

?>