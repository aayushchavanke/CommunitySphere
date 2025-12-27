<?php
// ===== CREATE CLUB POST =====
session_start();

// Include database connection
require_once 'db.php';

// Set JSON header
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user_fullname'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Please login to post'
    ]);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Extract input
$club = trim($input['club'] ?? '');
$message = trim($input['message'] ?? '');
$username = $_SESSION['user_fullname'];

// Validate input
if (empty($club) || empty($message)) {
    echo json_encode([
        'success' => false,
        'message' => 'Club and message are required'
    ]);
    exit();
}

// Determine table name
switch ($club) {
    case 'technical':
        $table_name = 'club_tech';
        break;
    case 'cultural':
        $table_name = 'club_cultural';
        break;
    case 'sports':
        $table_name = 'club_sports';
        break;
    default:
        echo json_encode([
            'success' => false,
            'message' => 'Invalid club name'
        ]);
        exit();
}

// Insert message
$stmt = $conn->prepare("INSERT INTO $table_name (username, message) VALUES (?, ?)");
$stmt->bind_param("ss", $username, $message);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Post created successfully'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to create post'
    ]);
}

$stmt->close();
$conn->close();
