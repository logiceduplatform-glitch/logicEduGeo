<?php
require_once __DIR__ . '/../middleware.php';

function handleQuizzes($method, $quizClientId) {
    $userId = authenticate();
    $db = getDB();

    switch ($method) {
        case 'GET':
            $stmt = $db->prepare(
                'SELECT client_id, title, questions_json, created_at, updated_at
                 FROM custom_quizzes WHERE user_id = :uid ORDER BY updated_at DESC'
            );
            $stmt->execute([':uid' => $userId]);
            $rows = $stmt->fetchAll();
            $result = [];
            foreach ($rows as $row) {
                $result[] = [
                    'id'        => $row['client_id'],
                    'title'     => $row['title'],
                    'questions' => json_decode($row['questions_json'], true),
                    'createdAt' => $row['created_at'],
                    'updatedAt' => $row['updated_at'],
                ];
            }
            echo json_encode($result);
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            if (empty($data['id']) || empty($data['title']) || empty($data['questions'])) {
                http_response_code(400);
                echo json_encode(['error' => 'id, title, and questions are required']);
                return;
            }
            $stmt = $db->prepare(
                'INSERT INTO custom_quizzes (user_id, client_id, title, questions_json)
                 VALUES (:uid, :cid, :title, :questions)
                 ON DUPLICATE KEY UPDATE
                   title = :title2, questions_json = :questions2, updated_at = CURRENT_TIMESTAMP'
            );
            $questionsJson = json_encode($data['questions']);
            $stmt->execute([
                ':uid'        => $userId,
                ':cid'        => $data['id'],
                ':title'      => $data['title'],
                ':questions'  => $questionsJson,
                ':title2'     => $data['title'],
                ':questions2' => $questionsJson,
            ]);
            echo json_encode(['ok' => true]);
            break;

        case 'DELETE':
            if (!$quizClientId) {
                http_response_code(400);
                echo json_encode(['error' => 'Quiz id required']);
                return;
            }
            $stmt = $db->prepare('DELETE FROM custom_quizzes WHERE user_id = :uid AND client_id = :cid');
            $stmt->execute([':uid' => $userId, ':cid' => $quizClientId]);
            echo json_encode(['ok' => true]);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
}
