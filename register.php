<?php
// ===== USER REGISTRATION =====
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
$fullname = trim($input['fullname'] ?? '');
$prn = trim($input['prn'] ?? '');
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

// Validate input
if (empty($fullname) || empty($prn) || empty($email) || empty($password)) {
    echo json_encode([
        'success' => false,
        'message' => 'All fields are required'
    ]);
    exit();
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email format'
    ]);
    exit();
}

// Validate college email domain
if (!str_contains($email, '@gst.sies.edu.in')) {
    echo json_encode([
        'success' => false,
        'message' => 'Please use your college email (@gst.sies.edu.in)'
    ]);
    exit();
}

// Check if email already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        'success' => false,
        'message' => 'This email is already registered'
    ]);
    $stmt->close();
    exit();
}
$stmt->close();

// Check if PRN already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE prn = ?");
$stmt->bind_param("s", $prn);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        'success' => false,
        'message' => 'This PRN is already registered'
    ]);
    $stmt->close();
    exit();
}
$stmt->close();

// Hash password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Insert user into database
$stmt = $conn->prepare("INSERT INTO users (fullname, prn, email, password) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $fullname, $prn, $email, $hashed_password);

if ($stmt->execute()) {
    // Set session variables
    $_SESSION['user_id'] = $conn->insert_id;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_fullname'] = $fullname;
    $_SESSION['logged_in'] = true;
    
    echo json_encode([
        'success' => true,
        'message' => 'Registration successful',
        'user' => [
            'fullname' => $fullname,
            'email' => $email
        ]
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Registration failed. Please try again.'
    ]);
}

$stmt->close();
closeConnection();
?>