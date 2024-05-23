CREATE DATABASE `user_db`;

USE `user_db`;

-- user profile
CREATE TABLE `user_db`.`profile` (
  `id` char(50) NOT NULL COMMENT 'user_id',
  `account_type` tinyint unsigned NOT NULL COMMENT 'account type 1: email 2: google',
  `email` varchar(255) NOT NULL COMMENT 'email',
  `passphrase` varchar(255) NOT NULL COMMENT 'password or token',
  `status` tinyint unsigned NOT NULL COMMENT 'user status 1: enable 2: disable',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update time',
  PRIMARY KEY (`id`)
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
