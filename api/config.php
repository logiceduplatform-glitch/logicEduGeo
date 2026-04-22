<?php
/**
 * Database & API configuration.
 * Update these values with your hosting's MySQL credentials.
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'geo_platform');
define('DB_USER', 'your_db_username');
define('DB_PASS', 'your_db_password');

define('FIREBASE_PROJECT_ID', 'logic-education-platform');

// Allowed origins for CORS (add your production domain)
define('ALLOWED_ORIGINS', [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:4173',
    // 'https://yourdomain.com',
]);
