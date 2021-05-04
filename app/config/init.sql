-- creating database
DROP DATABASE IF EXISTS db_matcha;
CREATE DATABASE IF NOT EXISTS db_matcha DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
SET @@SESSION.time_zone = '+01:00';
SET @@GLOBAL.time_zone = '+01:00';

-- adding users table
CREATE TABLE IF NOT EXISTS db_matcha.users (
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	email TEXT,
	username TEXT,
	firstname TEXT,
	lastname TEXT,
	password TEXT,
	status BOOLEAN NOT NULL DEFAULT FALSE,
	latitude DECIMAL(10, 8),
	longitude DECIMAL(11, 8),
	last_seen TIMESTAMP,
	date_of_birth DATE,
	gender TEXT,
	sexual_orientation VARCHAR(255) DEFAULT 'bisexual',
	bio TEXT,
	popularity_score INT,
	admin BOOLEAN NOT NULL DEFAULT FALSE
);

-- adding interests table
CREATE TABLE IF NOT EXISTS db_matcha.interests (
	user_id INT NOT NULL,
	interest TEXT
);

-- adding images table
CREATE TABLE IF NOT EXISTS db_matcha.images (
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	user_id INT NOT NULL,
	image TEXT
);

-- adding notifications table
CREATE TABLE IF NOT EXISTS db_matcha.notifications (
	user_id INT NOT NULL,
	target_id INT NOT NULL,
	details TEXT,
	`read` BOOLEAN NOT NULL DEFAULT FALSE,
	`date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- adding likes table
CREATE TABLE IF NOT EXISTS db_matcha.likes (
	user_id	INT NOT NULL,
	target_id INT NOT NULL,
	`date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- adding view table
CREATE TABLE IF NOT EXISTS db_matcha.views (
	user_id	INT NOT NULL,
	target_id INT NOT NULL,
	`date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- adding reports table
CREATE TABLE IF NOT EXISTS db_matcha.reports (
	user_id INT NOT NULL,
	target_id INT NOT NULL,
	reason TEXT,
	details TEXT DEFAULT NULL,
	`date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- adding blocks table
CREATE TABLE IF NOT EXISTS db_matcha.blocks (
	user_id	INT NOT NULL,
	target_id INT NOT NULL,
	`date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- adding tokens table
CREATE TABLE IF NOT EXISTS db_matcha.tokens (
	user_id	INT NOT NULL,
	token TEXT,
	expiration_date TIMESTAMP DEFAULT (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY)),
	`type` TEXT
);

-- adding chats table
CREATE TABLE IF NOT EXISTS db_matcha.chats (
	id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	first_user INT NOT NULL,
	second_user INT NOT NULL,
	first_user_name text,
	second_user_name text,
	`date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- adding messages table
CREATE TABLE IF NOT EXISTS db_matcha.messages (
	user_id INT NOT NULL,
	chat_id INT NOT NULL,
	message TEXT,
	`date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
