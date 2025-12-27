<?php
// ===== CHECK AUTHENTICATION STATUS =====
session_start();

// Set JSON header
header('Content-Type: application/json');

// Check if user is logged in
if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    echo json_encode([
        'success' => true,
        'logged_in' => true,
        'user' => [
            'fullname' => $_SESSION['user_fullname'] ?? '',
            'email' => $_SESSION['user_email'] ?? ''
        ]
    ]);
} else {
    echo json_encode([
        'success' => true,
        'logged_in' => false
    ]);
}
?>