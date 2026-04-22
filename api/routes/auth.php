<?php
require_once __DIR__ . '/../middleware.php';

function handleAuth($method) {
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }

    $userId = authenticate();

    $db = getDB();
    $stmt = $db->prepare('SELECT id, firebase_uid, email, display_name, photo_url, created_at FROM users WHERE id = :id');
    $stmt->execute([':id' => $userId]);
    $user = $stmt->fetch();

    echo json_encode(['ok' => true, 'user' => $user]);
}
