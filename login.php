<?php
// ===== USER LOGIN =====
session_start();

// Include database connection
require_once 'db.php';

// Set JSON header
header('Content-Type: application/json');

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

// Extract and sanitize input
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

// Validate input
if (empty($email) || empty($password)) {
    echo json_encode([
        'success' => false,
        'message' => 'Email and password are required'
    ]);
    exit();
}

// Validate college email domain
if (!str_contains($email, '@gst.sies.edu.in')) {
    echo json_encode([
        'success' => false,
        'message' => 'Please use a valid college email'
    ]);
    exit();
}

// Query database for user
$stmt = $conn->prepare("SELECT id, fullname, email, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid credentials'
    ]);
    $stmt->close();
    exit();
}

// Get user data
$user = $result->fetch_assoc();
$stmt->close();

// Verify password
if (!password_verify($password, $user['password'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid credentials'
    ]);
    exit();
}

// Set session variables
$_SESSION['user_id'] = $user['id'];
$_SESSION['user_email'] = $user['email'];
$_SESSION['user_fullname'] = $user['fullname'];
$_SESSION['logged_in'] = true;

// Return success response
echo json_encode([
    'success' => true,
    'message' => 'Login successful',
    'user' => [
        'fullname' => $user['fullname'],
        'email' => $user['email']
    ]
]);

closeConnection();
?>