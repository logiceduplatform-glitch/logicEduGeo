# Deployment Guide - Geo Platform with MySQL Backend

## Prerequisites

- Shared hosting with PHP 7.4+ and MySQL 5.7+
- cPanel access (or phpMyAdmin)
- Firebase project (already configured)

---

## Step 1: Create MySQL Database

1. Login to your cPanel
2. Go to **MySQL Databases**
3. Create a new database (e.g. `geo_platform`)
4. Create a new MySQL user and assign it to the database with **ALL PRIVILEGES**
5. Note down: database name, username, password

---

## Step 2: Import Schema

1. Go to **phpMyAdmin** in cPanel
2. Select your new database
3. Click the **Import** tab
4. Upload the file `api/schema.sql`
5. Click **Go** - this creates all the required tables

---

## Step 3: Configure API

Edit `api/config.php` with your database credentials:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_cpanel_user_geo_platform');  // usually cpaneluser_dbname
define('DB_USER', 'your_cpanel_user_dbuser');
define('DB_PASS', 'your_password');

define('FIREBASE_PROJECT_ID', 'logic-education-platform');

define('ALLOWED_ORIGINS', [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
]);
```

---

## Step 4: Build Frontend

On your local machine:

```bash
npm run build
```

This creates the `dist/` folder with optimized static files.

---

## Step 5: Upload to Hosting

Upload the following to your hosting's `public_html` (or subdirectory):

```
public_html/
├── api/                    ← Upload the entire api/ folder
│   ├── .htaccess
│   ├── index.php
│   ├── config.php
│   ├── db.php
│   ├── middleware.php
│   └── routes/
│       ├── auth.php
│       ├── profiles.php
│       ├── progress.php
│       ├── favorites.php
│       ├── quizzes.php
│       ├── stats.php
│       └── sync.php
├── assets/                 ← From dist/assets/
├── index.html              ← From dist/
├── .htaccess               ← From dist/ (copied from public/.htaccess during build)
└── ... other dist files
```

**Important:** Do NOT upload `schema.sql` or `config.php` with real credentials to a public location. The `.htaccess` in the `api/` folder blocks access to `.sql` files, but be cautious.

---

## Step 6: Verify

1. Visit `https://yourdomain.com` - the React app should load
2. Visit `https://yourdomain.com/api/` - should return `{"error":"Not found","uri":"/"}`
3. Try signing in with Google - data should now sync to MySQL

---

## Local Development

To test the API locally, you need PHP installed:

```bash
# Terminal 1: Start PHP development server for the API
cd api/
php -S localhost:8000

# Terminal 2: Start Vite dev server (proxies /api to PHP)
npm run dev
```

The Vite config already proxies `/api/*` requests to `http://localhost:8000`.

---

## How Sync Works

1. **On login:** The app registers the user in MySQL and performs a full bi-directional sync
2. **During play:** Every progress update, favorite toggle, or quiz save is pushed to the API in the background
3. **Offline fallback:** If the API is unreachable, data is saved locally and synced on next login
4. **Guest mode:** Guests only use localStorage (no cloud sync)

---

## Troubleshooting

- **CORS errors:** Make sure your domain is listed in `ALLOWED_ORIGINS` in `config.php`
- **500 errors:** Check PHP error logs in cPanel. Common causes: wrong DB credentials, missing PHP extensions (curl, pdo_mysql)
- **Firebase token errors:** Ensure `FIREBASE_PROJECT_ID` matches your Firebase project
- **mod_rewrite not enabled:** Contact your hosting provider to enable Apache's mod_rewrite module
