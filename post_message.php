<?php
ini_set('display_errors', 0);
ini_set('log_errors', 1);

session_start();

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = null;

if (file_exists('db.php')) {
    require_once 'db.php';
} elseif (file_exists('config.php')) {
    require_once 'config.php';
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
} else {
    echo json_encode(['success' => false, 'message' => 'Database configuration file not found.']);
    exit();
}

if (!$conn || $conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB Connection Failed']);
    exit();
}

if (!isset($_SESSION['user_fullname'])) {
    echo json_encode(['success' => false, 'message' => 'Please login to post']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

$club = trim($input['club'] ?? '');
$message = trim($input['message'] ?? '');
$username = $_SESSION['user_fullname']; 

if (empty($club) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Club and message are required']);
    exit();
}

$valid_tables = [
    'technical' => 'club_tech',
    'cultural' => 'club_cultural',
    'sports' => 'club_sports'
];

if (!array_key_exists($club, $valid_tables)) {
    echo json_encode(['success' => false, 'message' => 'Invalid club name']);
    exit();
}

$table_name = $valid_tables[$club];

$stmt = $conn->prepare("INSERT INTO $table_name (username, message) VALUES (?, ?)");

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
    exit();
}

$stmt->bind_param("ss", $username, $message);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Post created successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to execute: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
