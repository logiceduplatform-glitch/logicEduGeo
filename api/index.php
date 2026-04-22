<?php
require_once __DIR__ . '/config.php';

// CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, ALLOWED_ORIGINS, true)) {
    header("Access-Control-Allow-Origin: $origin");
} elseif (!empty(ALLOWED_ORIGINS)) {
    header("Access-Control-Allow-Origin: " . ALLOWED_ORIGINS[0]);
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Parse request
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Strip /api prefix if present
$uri = preg_replace('#^/api#', '', $uri);
$uri = '/' . trim($uri, '/');

// Simple router
$segments = explode('/', trim($uri, '/'));
$resource = $segments[0] ?? '';
$param = $segments[1] ?? null;

switch ($resource) {
    case 'auth':
        require_once __DIR__ . '/routes/auth.php';
        handleAuth($method);
        break;

    case 'profiles':
        require_once __DIR__ . '/routes/profiles.php';
        handleProfiles($method, $param);
        break;

    case 'progress':
        require_once __DIR__ . '/routes/progress.php';
        handleProgress($method, $param);
        break;

    case 'favorites':
        require_once __DIR__ . '/routes/favorites.php';
        handleFavorites($method, $param);
        break;

    case 'quizzes':
        require_once __DIR__ . '/routes/quizzes.php';
        handleQuizzes($method, $param);
        break;

    case 'stats':
        require_once __DIR__ . '/routes/stats.php';
        handleStats($method, $param);
        break;

    case 'sync':
        require_once __DIR__ . '/routes/sync.php';
        handleSync($method);
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Not found', 'uri' => $uri]);
        break;
}
