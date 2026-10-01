-- Complete MindOS Database Schema
-- Run this to create all tables

-- Users table (already exists, but here for reference)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Mind Entries - Mental state check-ins
CREATE TABLE IF NOT EXISTS mind_entries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    energy INT NOT NULL CHECK (energy BETWEEN 1 AND 10),
    clarity INT NOT NULL CHECK (clarity BETWEEN 1 AND 10),
    stress INT NOT NULL CHECK (stress BETWEEN 1 AND 10),
    mood VARCHAR(50) NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_created (user_id, created_at)
);

-- Thoughts - Personal thoughts and reflections
CREATE TABLE IF NOT EXISTS thoughts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255),
    content TEXT NOT NULL,
    mood VARCHAR(50),
    category VARCHAR(100),
    tags VARCHAR(500),
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_created (user_id, created_at),
    INDEX idx_category (category),
    INDEX idx_favorite (is_favorite)
);

-- Focus Sessions - Productivity tracking
CREATE TABLE IF NOT EXISTS focus_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL,
    started_at TIMESTAMP NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    interruptions INT DEFAULT 0,
    productivity_rating INT CHECK (productivity_rating BETWEEN 1 AND 5),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, started_at),
    INDEX idx_completed (completed)
);

-- Filters - Thought categorization and filtering
CREATE TABLE IF NOT EXISTS filters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    thought TEXT NOT NULL,
    category ENUM('important', 'action-needed', 'idea', 'concern', 'gratitude', 'other') NOT NULL,
    reality TEXT,
    action TEXT,
    priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
    status ENUM('pending', 'in-progress', 'completed', 'archived') DEFAULT 'pending',
    due_date DATE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_status (user_id, status),
    INDEX idx_priority (priority),
    INDEX idx_due_date (due_date)
);

-- Reprograms - Intentional routines and affirmations
CREATE TABLE IF NOT EXISTS reprograms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    affirmation TEXT NOT NULL,
    frequency ENUM('daily', 'weekly', 'monthly', 'custom') DEFAULT 'daily',
    reminder_time TIME,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    streak_count INT DEFAULT 0,
    last_completed_date DATE,
    total_completions INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_completed (user_id, completed),
    INDEX idx_frequency (frequency)
);

-- Reprogram Completions - Track completion history
CREATE TABLE IF NOT EXISTS reprogram_completions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reprogram_id INT NOT NULL,
    user_id INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (reprogram_id) REFERENCES reprograms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_reprogram_date (reprogram_id, completed_at)
);

-- Explore - Questions, ideas, and explorations
CREATE TABLE IF NOT EXISTS explorations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('question', 'idea', 'problem', 'insight', 'goal') NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status ENUM('exploring', 'researching', 'answered', 'implemented', 'archived') DEFAULT 'exploring',
    tags VARCHAR(500),
    related_links TEXT,
    insights TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_type (user_id, type),
    INDEX idx_status (status)
);

-- User Settings - Preferences and configuration
CREATE TABLE IF NOT EXISTS user_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    theme VARCHAR(50) DEFAULT 'light',
    timezone VARCHAR(100) DEFAULT 'UTC',
    email_notifications BOOLEAN DEFAULT TRUE,
    daily_reminder BOOLEAN DEFAULT TRUE,
    reminder_time TIME DEFAULT '09:00:00',
    default_mood VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tags - Reusable tags for organization
CREATE TABLE IF NOT EXISTS tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6',
    use_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_tag (user_id, name)
);

-- Health check endpoint data
CREATE TABLE IF NOT EXISTS health_checks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'healthy'
);