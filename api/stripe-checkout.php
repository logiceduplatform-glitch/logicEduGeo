<?php
require_once __DIR__ . '/stripe-config.php';

// CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, STRIPE_ALLOWED_ORIGINS, true)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: " . FRONTEND_URL);
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Verify Firebase token
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
if (!preg_match('/^Bearer\s+(.+)$/i', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(['error' => 'Missing Authorization header']);
    exit;
}

$idToken = $matches[1];
$tokenUrl = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' . urlencode($idToken);
$ch = curl_init($tokenUrl);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_SSL_VERIFYPEER => true,
]);
$tokenResp = curl_exec($ch);
$tokenHttp = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($tokenHttp !== 200) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid token']);
    exit;
}

$tokenData = json_decode($tokenResp, true);
$firebaseUid = $tokenData['sub'] ?? null;
$email = $tokenData['email'] ?? null;

if (!$firebaseUid) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid token payload']);
    exit;
}

// Parse request
$body = json_decode(file_get_contents('php://input'), true);
$plan = $body['plan'] ?? '';
$period = $body['period'] ?? 'monthly';

$priceKey = $plan . '_' . $period;
$priceId = STRIPE_PRICES[$priceKey] ?? null;

if (!$priceId || $priceId === 'price_XXXXXXXX') {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid plan or period', 'key' => $priceKey]);
    exit;
}

// Create Stripe Checkout Session via API
$stripeData = http_build_query([
    'mode' => 'subscription',
    'line_items[0][price]' => $priceId,
    'line_items[0][quantity]' => 1,
    'success_url' => SUCCESS_URL . '&session_id={CHECKOUT_SESSION_ID}',
    'cancel_url' => CANCEL_URL,
    'customer_email' => $email,
    'client_reference_id' => $firebaseUid,
    'metadata[firebase_uid]' => $firebaseUid,
    'metadata[plan]' => $plan,
    'metadata[period]' => $period,
    'subscription_data[metadata][firebase_uid]' => $firebaseUid,
    'subscription_data[metadata][plan]' => $plan,
]);

$ch = curl_init('https://api.stripe.com/v1/checkout/sessions');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $stripeData,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . STRIPE_SECRET_KEY,
        'Content-Type: application/x-www-form-urlencoded',
    ],
    CURLOPT_TIMEOUT => 30,
    CURLOPT_SSL_VERIFYPEER => true,
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode < 200 || $httpCode >= 300) {
    http_response_code(500);
    echo json_encode(['error' => 'Stripe API error', 'details' => json_decode($response, true)]);
    exit;
}

$session = json_decode($response, true);
echo json_encode(['url' => $session['url'] ?? null, 'session_id' => $session['id'] ?? null]);
