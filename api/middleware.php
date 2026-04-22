<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

/**
 * Verify Firebase ID token by calling Google's tokeninfo endpoint.
 * Returns the decoded token payload or null on failure.
 */
function verifyFirebaseToken($idToken) {
    if (empty($idToken)) return null;

    $url = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' . urlencode($idToken);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200 || !$response) return null;

    $payload = json_decode($response, true);
    if (!$payload || empty($payload['sub'])) return null;

    // Verify the token was issued for our Firebase project
    $expectedAud = FIREBASE_PROJECT_ID;
    if (isset($payload['aud']) && strpos($payload['aud'], $expectedAud) === false) {
        return null;
    }

    return $payload;
}

/**
 * Authenticate the request. Returns the internal user_id or sends 401.
 */
function authenticate() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (!preg_match('/^Bearer\s+(.+)$/i', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => 'Missing or invalid Authorization header']);
        exit;
    }

    $idToken = $matches[1];
    $payload = verifyFirebaseToken($idToken);

    if (!$payload) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid or expired token']);
        exit;
    }

    $firebaseUid = $payload['sub'];
    $email = $payload['email'] ?? null;
    $name = $payload['name'] ?? null;
    $photo = $payload['picture'] ?? null;

    $db = getDB();

    // Upsert user
    $stmt = $db->prepare(
        'INSERT INTO users (firebase_uid, email, display_name, photo_url)
         VALUES (:uid, :email, :name, :photo)
         ON DUPLICATE KEY UPDATE
           email = COALESCE(:email2, email),
           display_name = COALESCE(:name2, display_name),
           photo_url = COALESCE(:photo2, photo_url),
           updated_at = CURRENT_TIMESTAMP'
    );
    $stmt->execute([
        ':uid'    => $firebaseUid,
        ':email'  => $email,
        ':name'   => $name,
        ':photo'  => $photo,
        ':email2' => $email,
        ':name2'  => $name,
        ':photo2' => $photo,
    ]);

    // Get the user's internal ID
    $stmt = $db->prepare('SELECT id FROM users WHERE firebase_uid = :uid');
    $stmt->execute([':uid' => $firebaseUid]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to resolve user']);
        exit;
    }

    return (int) $user['id'];
}
