<?php
// ===== FETCH CLUB MESSAGES =====
session_start();

// Include database connection
require_once 'db.php';

// Set JSON header
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode([
        'success' => false,
        'message' => 'Please login to view posts'
    ]);
    exit();
}

// Get club parameter from URL
$club = trim($_GET['club'] ?? '');

// Validate club parameter
if (empty($club)) {
    echo json_encode([
        'success' => false,
        'message' => 'Club parameter is required'
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

// Fetch messages from appropriate club table
$query = "SELECT id, username, message, likes, UNIX_TIMESTAMP(created_at) * 1000 as timestamp 
          FROM $table_name 
          ORDER BY created_at DESC";

$result = $conn->query($query);

if ($result === false) {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch posts'
    ]);
    exit();
}

// Build posts array
$posts = [];
while ($row = $result->fetch_assoc()) {
    $posts[] = [
        'id' => (int)$row['id'],
        'username' => $row['username'],
        'content' => $row['message'],
        'timestamp' => (int)$row['timestamp'],
        'likes' => (int)$row['likes']
    ];
}

// Return success response with posts
echo json_encode([
    'success' => true,
    'posts' => $posts
]);

closeConnection();
?>