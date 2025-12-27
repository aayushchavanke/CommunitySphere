<?php
// ===== USER LOGOUT =====
session_start();

// Set JSON header
header('Content-Type: application/json');

// Destroy all session data
$_SESSION = array();

// Destroy the session cookie
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/');
}

// Destroy the session
session_destroy();

// Return success response
echo json_encode([
    'success' => true,
    'message' => 'Logged out successfully'
]);
?>