<?php
// ===== DELETE CLUB POST =====
session_start();

// Include database connection
require_once 'db.php';

// Set JSON header
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode([
        'success' => false,
        'message' => 'Please login to delete posts'
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
$post_id = (int)($input['post_id'] ?? 0);

// Validate input
if (empty($club) || $post_id <= 0) {
    echo json_encode([
        'success' => false,
        'message' => 'Club and post ID are required'
    ]);
    exit();
}

// Determine table name based on club
$table_name = '';
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

// Delete post
$stmt = $conn->prepare("DELETE FROM $table_name WHERE id = ?");
$stmt->bind_param("i", $post_id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Post deleted successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Post not found'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to delete post'
    ]);
}

$stmt->close();
closeConnection();
?>