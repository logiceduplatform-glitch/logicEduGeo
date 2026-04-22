<?php
require_once __DIR__ . '/../middleware.php';

function handleProgress($method, $gameId) {
    $userId = authenticate();
    $db = getDB();
    $profileId = $_GET['profile_id'] ?? null;

    switch ($method) {
        case 'GET':
            if ($gameId) {
                $stmt = $db->prepare(
                    'SELECT game_id, data_json, updated_at FROM game_progress
                     WHERE user_id = :uid AND profile_id <=> :pid AND game_id = :gid'
                );
                $stmt->execute([':uid' => $userId, ':pid' => $profileId, ':gid' => $gameId]);
                $row = $stmt->fetch();
                echo json_encode($row ? array_merge(['game_id' => $row['game_id']], json_decode($row['data_json'], true)) : null);
            } else {
                $stmt = $db->prepare(
                    'SELECT game_id, data_json, updated_at FROM game_progress
                     WHERE user_id = :uid AND profile_id <=> :pid'
                );
                $stmt->execute([':uid' => $userId, ':pid' => $profileId]);
                $rows = $stmt->fetchAll();
                $result = [];
                foreach ($rows as $row) {
                    $result[$row['game_id']] = json_decode($row['data_json'], true);
                }
                echo json_encode($result);
            }
            break;

        case 'PUT':
            if (!$gameId) {
                http_response_code(400);
                echo json_encode(['error' => 'game_id required in URL']);
                return;
            }
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                http_response_code(400);
                echo json_encode(['error' => 'JSON body required']);
                return;
            }
            $stmt = $db->prepare(
                'INSERT INTO game_progress (user_id, profile_id, game_id, data_json)
                 VALUES (:uid, :pid, :gid, :data)
                 ON DUPLICATE KEY UPDATE data_json = :data2, updated_at = CURRENT_TIMESTAMP'
            );
            $json = json_encode($data);
            $stmt->execute([
                ':uid'   => $userId,
                ':pid'   => $profileId,
                ':gid'   => $gameId,
                ':data'  => $json,
                ':data2' => $json,
            ]);
            echo json_encode(['ok' => true]);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
}
