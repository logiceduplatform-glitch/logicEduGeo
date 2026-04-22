<?php
require_once __DIR__ . '/stripe-config.php';

header('Content-Type: application/json');

$payload = file_get_contents('php://input');
$sigHeader = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

// Verify Stripe webhook signature
if (STRIPE_WEBHOOK_SECRET && STRIPE_WEBHOOK_SECRET !== 'whsec_XXXXXXXXXXXXXXXXXXXXXXXX') {
    $elements = [];
    foreach (explode(',', $sigHeader) as $part) {
        $kv = explode('=', $part, 2);
        if (count($kv) === 2) {
            $elements[trim($kv[0])] = trim($kv[1]);
        }
    }

    $timestamp = $elements['t'] ?? '';
    $signature = $elements['v1'] ?? '';
    $signedPayload = $timestamp . '.' . $payload;
    $expected = hash_hmac('sha256', $signedPayload, STRIPE_WEBHOOK_SECRET);

    if (!hash_equals($expected, $signature)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid signature']);
        exit;
    }

    if (abs(time() - (int)$timestamp) > 300) {
        http_response_code(400);
        echo json_encode(['error' => 'Timestamp too old']);
        exit;
    }
}

$event = json_decode($payload, true);
if (!$event || empty($event['type'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid event']);
    exit;
}

$type = $event['type'];
$object = $event['data']['object'] ?? [];

switch ($type) {
    case 'checkout.session.completed':
        $firebaseUid = $object['metadata']['firebase_uid'] ?? $object['client_reference_id'] ?? null;
        $plan = $object['metadata']['plan'] ?? 'premium';
        if ($firebaseUid) {
            updateFirestoreSubscription($firebaseUid, $plan, 'active');
        }
        break;

    case 'customer.subscription.updated':
        $firebaseUid = $object['metadata']['firebase_uid'] ?? null;
        $plan = $object['metadata']['plan'] ?? 'premium';
        $status = $object['status'] ?? 'active';

        if ($firebaseUid) {
            if ($status === 'active' || $status === 'trialing') {
                updateFirestoreSubscription($firebaseUid, $plan, 'active', $object['current_period_end'] ?? null);
            } else {
                updateFirestoreSubscription($firebaseUid, 'free', 'cancelled');
            }
        }
        break;

    case 'customer.subscription.deleted':
        $firebaseUid = $object['metadata']['firebase_uid'] ?? null;
        if ($firebaseUid) {
            updateFirestoreSubscription($firebaseUid, 'free', 'cancelled');
        }
        break;

    default:
        break;
}

http_response_code(200);
echo json_encode(['received' => true]);


// ─── Helper functions ────────────────────────────────────────

/**
 * Get a Google OAuth2 access token from the service account.
 * Uses JWT to request a short-lived token from Google's OAuth endpoint.
 */
function getFirebaseAccessToken() {
    static $cached = null;
    static $expiry = 0;

    if ($cached && time() < $expiry - 60) {
        return $cached;
    }

    $saPath = FIREBASE_SERVICE_ACCOUNT_PATH;
    if (!file_exists($saPath)) {
        error_log("[Webhook] Service account file not found at: $saPath");
        return null;
    }

    $sa = json_decode(file_get_contents($saPath), true);
    if (!$sa || empty($sa['client_email']) || empty($sa['private_key'])) {
        error_log("[Webhook] Invalid service account JSON");
        return null;
    }

    $now = time();
    $header = base64UrlEncode(json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
    $claims = base64UrlEncode(json_encode([
        'iss' => $sa['client_email'],
        'scope' => 'https://www.googleapis.com/auth/datastore',
        'aud' => 'https://oauth2.googleapis.com/token',
        'iat' => $now,
        'exp' => $now + 3600,
    ]));

    $toSign = "$header.$claims";
    $signature = '';
    openssl_sign($toSign, $signature, $sa['private_key'], OPENSSL_ALGO_SHA256);
    $jwt = $toSign . '.' . base64UrlEncode($signature);

    $ch = curl_init('https://oauth2.googleapis.com/token');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query([
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion' => $jwt,
        ]),
        CURLOPT_TIMEOUT => 10,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $resp = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        error_log("[Webhook] OAuth2 token request failed ($httpCode): $resp");
        return null;
    }

    $tokenData = json_decode($resp, true);
    $cached = $tokenData['access_token'] ?? null;
    $expiry = $now + ($tokenData['expires_in'] ?? 3600);
    return $cached;
}

function base64UrlEncode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

/**
 * Update the user's subscription document in Firestore via authenticated REST API.
 */
function updateFirestoreSubscription($uid, $plan, $status, $periodEnd = null) {
    $projectId = FIREBASE_PROJECT_ID;
    $docPath = "users/$uid/data/subscription";
    $url = "https://firestore.googleapis.com/v1/projects/$projectId/databases/(default)/documents/$docPath";

    $fields = [
        'tier' => ['stringValue' => $plan],
        'status' => ['stringValue' => $status],
        'updatedAt' => ['stringValue' => date('c')],
    ];

    if ($periodEnd) {
        $fields['periodEnd'] = ['stringValue' => date('c', $periodEnd)];
    }

    if ($plan !== 'free') {
        $fields['subscribedAt'] = ['stringValue' => date('c')];
    }

    $body = json_encode(['fields' => $fields]);

    $headers = ['Content-Type: application/json'];

    $token = getFirebaseAccessToken();
    if ($token) {
        $headers[] = "Authorization: Bearer $token";
    } else {
        error_log("[Webhook] WARNING: No service account token, Firestore write may fail due to security rules");
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => 'PATCH',
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode >= 400) {
        error_log("[Webhook] Firestore update failed for $uid (HTTP $httpCode): $response");
    }

    return $httpCode < 400;
}
