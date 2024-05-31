CREATE DATABASE `user_db`;

USE `user_db`;

-- user profile
CREATE TABLE `user_db`.`profile` (
  `id` char(50) NOT NULL COMMENT 'user_id',
  `auth_level` tinyint unsigned NOT NULL COMMENT 'auth level 1: User 2: Admin',
  `account_type` tinyint unsigned NOT NULL COMMENT 'account type 1: Email 2: Google',
  `username` varchar(255) NOT NULL COMMENT 'username',
  `email` varchar(255) NOT NULL COMMENT 'email',
  `passphrase` varchar(255) NOT NULL COMMENT 'password or token',
  `status` tinyint unsigned NOT NULL COMMENT 'user status 1: Enable 2: Disable 3: Unverified',
  `last_session_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'user last session at',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update time',
  PRIMARY KEY (`id`),
  UNIQUE KEY(`email`),
  UNIQUE KEY(`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='user profile';

-- user login record
CREATE TABLE `user_db`.`login_record` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'record_id',
  `user_id` char(50) NOT NULL COMMENT 'user_id',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update time',
  PRIMARY KEY (`id`),
  KEY `ID_User_ID`(`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='user login record';

-- user session report
CREATE TABLE `user_db`.`user_session_report` (
  `user_id` char(50) NOT NULL COMMENT 'user_id',
  `start_time` timestamp NOT NULL DEFAULT  '0000-00-00 00:00:00' COMMENT 'user session start time',
  `end_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT 'user session end time',
  `session_count` bigint unsigned NOT NULL COMMENT 'user session counts',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update time',
  PRIMARY KEY (`user_id`, `start_time`, `end_time`),
  KEY `ID_User_ID`(`user_id`),
  KEY `ID_TimePeriod`(`start_time`, `end_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='user session report';
