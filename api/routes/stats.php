<?php
require_once __DIR__ . '/../middleware.php';

function handleStats($method, $statKey) {
    $userId = authenticate();
    $db = getDB();
    $profileId = $_GET['profile_id'] ?? null;

    switch ($method) {
        case 'GET':
            if ($statKey) {
                $stmt = $db->prepare(
                    'SELECT stat_key, data_json FROM user_stats
                     WHERE user_id = :uid AND profile_id <=> :pid AND stat_key = :sk'
                );
                $stmt->execute([':uid' => $userId, ':pid' => $profileId, ':sk' => $statKey]);
                $row = $stmt->fetch();
                echo json_encode($row ? json_decode($row['data_json'], true) : null);
            } else {
                $stmt = $db->prepare(
                    'SELECT stat_key, data_json FROM user_stats
                     WHERE user_id = :uid AND profile_id <=> :pid'
                );
                $stmt->execute([':uid' => $userId, ':pid' => $profileId]);
                $rows = $stmt->fetchAll();
                $result = [];
                foreach ($rows as $row) {
                    $result[$row['stat_key']] = json_decode($row['data_json'], true);
                }
                echo json_encode($result);
            }
            break;

        case 'PUT':
            if (!$statKey) {
                http_response_code(400);
                echo json_encode(['error' => 'stat_key required in URL']);
                return;
            }
            $data = json_decode(file_get_contents('php://input'), true);
            if ($data === null) {
                http_response_code(400);
                echo json_encode(['error' => 'JSON body required']);
                return;
            }
            $stmt = $db->prepare(
                'INSERT INTO user_stats (user_id, profile_id, stat_key, data_json)
                 VALUES (:uid, :pid, :sk, :data)
                 ON DUPLICATE KEY UPDATE data_json = :data2, updated_at = CURRENT_TIMESTAMP'
            );
            $json = json_encode($data);
            $stmt->execute([
                ':uid'   => $userId,
                ':pid'   => $profileId,
                ':sk'    => $statKey,
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
