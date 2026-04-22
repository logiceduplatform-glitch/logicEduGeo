<?php
require_once __DIR__ . '/../middleware.php';

/**
 * Bulk sync endpoint - pulls all user data in a single request.
 * POST /api/sync  (with optional body to push local data)
 * GET  /api/sync  (pull all cloud data)
 */
function handleSync($method) {
    $userId = authenticate();
    $db = getDB();

    if ($method === 'GET') {
        $profileId = $_GET['profile_id'] ?? null;

        // Profiles
        $stmt = $db->prepare('SELECT * FROM child_profiles WHERE user_id = :uid');
        $stmt->execute([':uid' => $userId]);
        $profiles = $stmt->fetchAll();

        // Favorites
        $stmt = $db->prepare('SELECT game_id FROM favorites WHERE user_id = :uid AND profile_id <=> :pid');
        $stmt->execute([':uid' => $userId, ':pid' => $profileId]);
        $favorites = array_column($stmt->fetchAll(), 'game_id');

        // Progress
        $stmt = $db->prepare('SELECT game_id, data_json FROM game_progress WHERE user_id = :uid AND profile_id <=> :pid');
        $stmt->execute([':uid' => $userId, ':pid' => $profileId]);
        $progressRows = $stmt->fetchAll();
        $progress = [];
        foreach ($progressRows as $row) {
            $progress[$row['game_id']] = json_decode($row['data_json'], true);
        }

        // Stats
        $stmt = $db->prepare('SELECT stat_key, data_json FROM user_stats WHERE user_id = :uid AND profile_id <=> :pid');
        $stmt->execute([':uid' => $userId, ':pid' => $profileId]);
        $statsRows = $stmt->fetchAll();
        $stats = [];
        foreach ($statsRows as $row) {
            $stats[$row['stat_key']] = json_decode($row['data_json'], true);
        }

        // Custom quizzes
        $stmt = $db->prepare('SELECT client_id, title, questions_json FROM custom_quizzes WHERE user_id = :uid');
        $stmt->execute([':uid' => $userId]);
        $quizRows = $stmt->fetchAll();
        $quizzes = [];
        foreach ($quizRows as $row) {
            $quizzes[] = [
                'id'        => $row['client_id'],
                'title'     => $row['title'],
                'questions' => json_decode($row['questions_json'], true),
            ];
        }

        echo json_encode([
            'profiles'  => $profiles,
            'favorites' => $favorites,
            'progress'  => $progress,
            'stats'     => $stats,
            'quizzes'   => $quizzes,
        ]);
        return;
    }

    if ($method === 'POST') {
        $body = json_decode(file_get_contents('php://input'), true);
        if (!$body) {
            http_response_code(400);
            echo json_encode(['error' => 'JSON body required']);
            return;
        }

        $profileId = $body['profile_id'] ?? null;

        $db->beginTransaction();
        try {
            // Sync profiles
            if (!empty($body['profiles']) && is_array($body['profiles'])) {
                foreach ($body['profiles'] as $p) {
                    if (empty($p['client_id']) || empty($p['name'])) continue;
                    $stmt = $db->prepare(
                        'INSERT INTO child_profiles (user_id, client_id, name, age, avatar, objective)
                         VALUES (:uid, :cid, :name, :age, :avatar, :obj)
                         ON DUPLICATE KEY UPDATE
                           name = :name2, age = :age2, avatar = :avatar2, objective = :obj2'
                    );
                    $stmt->execute([
                        ':uid' => $userId, ':cid' => $p['client_id'],
                        ':name' => $p['name'], ':age' => $p['age'] ?? null,
                        ':avatar' => $p['avatar'] ?? null, ':obj' => $p['objective'] ?? null,
                        ':name2' => $p['name'], ':age2' => $p['age'] ?? null,
                        ':avatar2' => $p['avatar'] ?? null, ':obj2' => $p['objective'] ?? null,
                    ]);
                }
            }

            // Sync favorites
            if (isset($body['favorites']) && is_array($body['favorites'])) {
                // Replace all favorites for this profile
                $stmt = $db->prepare('DELETE FROM favorites WHERE user_id = :uid AND profile_id <=> :pid');
                $stmt->execute([':uid' => $userId, ':pid' => $profileId]);
                foreach ($body['favorites'] as $gameId) {
                    $stmt = $db->prepare('INSERT INTO favorites (user_id, profile_id, game_id) VALUES (:uid, :pid, :gid)');
                    $stmt->execute([':uid' => $userId, ':pid' => $profileId, ':gid' => $gameId]);
                }
            }

            // Sync progress
            if (!empty($body['progress']) && is_array($body['progress'])) {
                foreach ($body['progress'] as $gameId => $data) {
                    $stmt = $db->prepare(
                        'INSERT INTO game_progress (user_id, profile_id, game_id, data_json)
                         VALUES (:uid, :pid, :gid, :data)
                         ON DUPLICATE KEY UPDATE data_json = :data2, updated_at = CURRENT_TIMESTAMP'
                    );
                    $json = json_encode($data);
                    $stmt->execute([
                        ':uid' => $userId, ':pid' => $profileId,
                        ':gid' => $gameId, ':data' => $json, ':data2' => $json,
                    ]);
                }
            }

            // Sync stats
            if (!empty($body['stats']) && is_array($body['stats'])) {
                foreach ($body['stats'] as $key => $data) {
                    $stmt = $db->prepare(
                        'INSERT INTO user_stats (user_id, profile_id, stat_key, data_json)
                         VALUES (:uid, :pid, :sk, :data)
                         ON DUPLICATE KEY UPDATE data_json = :data2, updated_at = CURRENT_TIMESTAMP'
                    );
                    $json = json_encode($data);
                    $stmt->execute([
                        ':uid' => $userId, ':pid' => $profileId,
                        ':sk' => $key, ':data' => $json, ':data2' => $json,
                    ]);
                }
            }

            // Sync custom quizzes
            if (!empty($body['quizzes']) && is_array($body['quizzes'])) {
                foreach ($body['quizzes'] as $q) {
                    if (empty($q['id']) || empty($q['title'])) continue;
                    $stmt = $db->prepare(
                        'INSERT INTO custom_quizzes (user_id, client_id, title, questions_json)
                         VALUES (:uid, :cid, :title, :q)
                         ON DUPLICATE KEY UPDATE title = :title2, questions_json = :q2, updated_at = CURRENT_TIMESTAMP'
                    );
                    $qJson = json_encode($q['questions'] ?? []);
                    $stmt->execute([
                        ':uid' => $userId, ':cid' => $q['id'],
                        ':title' => $q['title'], ':q' => $qJson,
                        ':title2' => $q['title'], ':q2' => $qJson,
                    ]);
                }
            }

            $db->commit();
            echo json_encode(['ok' => true]);
        } catch (\Exception $e) {
            $db->rollBack();
            http_response_code(500);
            echo json_encode(['error' => 'Sync failed: ' . $e->getMessage()]);
        }
        return;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
