<?php
// ===== DATABASE CONNECTION =====
// This file creates and manages the MySQL connection

// Include configuration file
require_once 'config.php';

// Create database connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    // Log error and return JSON response
    error_log("Database connection failed: " . $conn->connect_error);
    
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed'
    ]);
    exit();
}

// Set charset to UTF-8 for proper character handling
$conn->set_charset("utf8mb4");

// Function to close database connection
function closeConnection() {
    global $conn;
    if ($conn) {
        $conn->close();
    }
}
?>