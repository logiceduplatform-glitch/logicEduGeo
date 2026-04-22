<?php
require_once __DIR__ . '/../middleware.php';

function handleProfiles($method, $profileClientId) {
    $userId = authenticate();
    $db = getDB();

    switch ($method) {
        case 'GET':
            $stmt = $db->prepare('SELECT * FROM child_profiles WHERE user_id = :uid ORDER BY created_at');
            $stmt->execute([':uid' => $userId]);
            echo json_encode($stmt->fetchAll());
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            if (empty($data['client_id']) || empty($data['name'])) {
                http_response_code(400);
                echo json_encode(['error' => 'client_id and name are required']);
                return;
            }
            $stmt = $db->prepare(
                'INSERT INTO child_profiles (user_id, client_id, name, age, avatar, objective)
                 VALUES (:uid, :cid, :name, :age, :avatar, :obj)
                 ON DUPLICATE KEY UPDATE
                   name = :name2, age = :age2, avatar = :avatar2, objective = :obj2,
                   updated_at = CURRENT_TIMESTAMP'
            );
            $stmt->execute([
                ':uid'     => $userId,
                ':cid'     => $data['client_id'],
                ':name'    => $data['name'],
                ':age'     => $data['age'] ?? null,
                ':avatar'  => $data['avatar'] ?? null,
                ':obj'     => $data['objective'] ?? null,
                ':name2'   => $data['name'],
                ':age2'    => $data['age'] ?? null,
                ':avatar2' => $data['avatar'] ?? null,
                ':obj2'    => $data['objective'] ?? null,
            ]);
            echo json_encode(['ok' => true, 'client_id' => $data['client_id']]);
            break;

        case 'PUT':
            if (!$profileClientId) {
                http_response_code(400);
                echo json_encode(['error' => 'Profile client_id required']);
                return;
            }
            $data = json_decode(file_get_contents('php://input'), true);
            $fields = [];
            $params = [':uid' => $userId, ':cid' => $profileClientId];

            foreach (['name', 'age', 'avatar', 'objective'] as $field) {
                if (isset($data[$field])) {
                    $fields[] = "$field = :$field";
                    $params[":$field"] = $data[$field];
                }
            }

            if (empty($fields)) {
                http_response_code(400);
                echo json_encode(['error' => 'No fields to update']);
                return;
            }

            $sql = 'UPDATE child_profiles SET ' . implode(', ', $fields) . ' WHERE user_id = :uid AND client_id = :cid';
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            echo json_encode(['ok' => true]);
            break;

        case 'DELETE':
            if (!$profileClientId) {
                http_response_code(400);
                echo json_encode(['error' => 'Profile client_id required']);
                return;
            }
            $stmt = $db->prepare('DELETE FROM child_profiles WHERE user_id = :uid AND client_id = :cid');
            $stmt->execute([':uid' => $userId, ':cid' => $profileClientId]);
            echo json_encode(['ok' => true]);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
}
