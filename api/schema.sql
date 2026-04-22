-- Geo Platform Database Schema
-- Run this in phpMyAdmin or via MySQL CLI

CREATE DATABASE IF NOT EXISTS geo_platform
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE geo_platform;

-- Users table (linked to Firebase Auth)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firebase_uid VARCHAR(128) NOT NULL UNIQUE,
  email VARCHAR(255) DEFAULT NULL,
  display_name VARCHAR(255) DEFAULT NULL,
  photo_url TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_firebase_uid (firebase_uid)
) ENGINE=InnoDB;

-- Child profiles
CREATE TABLE IF NOT EXISTS child_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  client_id VARCHAR(64) NOT NULL,
  name VARCHAR(100) NOT NULL,
  age VARCHAR(20) DEFAULT NULL,
  avatar VARCHAR(10) DEFAULT NULL,
  objective TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_client (user_id, client_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- Game progress (stores all progress data as JSON per game)
CREATE TABLE IF NOT EXISTS game_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  profile_id VARCHAR(64) DEFAULT NULL,
  game_id VARCHAR(255) NOT NULL,
  data_json JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_profile_game (user_id, profile_id, game_id),
  INDEX idx_user_game (user_id, game_id)
) ENGINE=InnoDB;

-- Favorites
CREATE TABLE IF NOT EXISTS favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  profile_id VARCHAR(64) DEFAULT NULL,
  game_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_profile_fav (user_id, profile_id, game_id),
  INDEX idx_user_favs (user_id, profile_id)
) ENGINE=InnoDB;

-- Custom quizzes
CREATE TABLE IF NOT EXISTS custom_quizzes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  client_id VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  questions_json JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_quiz (user_id, client_id),
  INDEX idx_user_quizzes (user_id)
) ENGINE=InnoDB;

-- User stats (streak, XP, achievements, overall stats as single JSON blob per user)
CREATE TABLE IF NOT EXISTS user_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  profile_id VARCHAR(64) DEFAULT NULL,
  stat_key VARCHAR(100) NOT NULL,
  data_json JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_profile_stat (user_id, profile_id, stat_key),
  INDEX idx_user_stats (user_id, profile_id)
) ENGINE=InnoDB;
