<?php
require_once __DIR__ . '/../middleware.php';

function handleFavorites($method, $gameId) {
    $userId = authenticate();
    $db = getDB();
    $profileId = $_GET['profile_id'] ?? null;

    switch ($method) {
        case 'GET':
            $stmt = $db->prepare(
                'SELECT game_id FROM favorites WHERE user_id = :uid AND profile_id <=> :pid ORDER BY created_at'
            );
            $stmt->execute([':uid' => $userId, ':pid' => $profileId]);
            $rows = $stmt->fetchAll();
            echo json_encode(array_column($rows, 'game_id'));
            break;

        case 'POST':
            if (!$gameId) {
                http_response_code(400);
                echo json_encode(['error' => 'game_id required in URL']);
                return;
            }
            $stmt = $db->prepare(
                'INSERT IGNORE INTO favorites (user_id, profile_id, game_id) VALUES (:uid, :pid, :gid)'
            );
            $stmt->execute([':uid' => $userId, ':pid' => $profileId, ':gid' => $gameId]);
            echo json_encode(['ok' => true]);
            break;

        case 'DELETE':
            if (!$gameId) {
                http_response_code(400);
                echo json_encode(['error' => 'game_id required in URL']);
                return;
            }
            $stmt = $db->prepare(
                'DELETE FROM favorites WHERE user_id = :uid AND profile_id <=> :pid AND game_id = :gid'
            );
            $stmt->execute([':uid' => $userId, ':pid' => $profileId, ':gid' => $gameId]);
            echo json_encode(['ok' => true]);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
}
