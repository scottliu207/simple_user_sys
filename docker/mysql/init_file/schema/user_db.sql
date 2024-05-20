CREATE DATABASE `user_db`;

USE `user_db`;

-- user_profile
CREATE TABLE `user_db`.`profile` (
  `id` char(50) NOT NULL COMMENT 'user_id',
  `account_type` tinyint unsigned NOT NULL COMMENT 'account type 1: email 2: google',
  `account` varchar(50) NOT NULL COMMENT 'account',
  `email` varchar(255) NOT NULL COMMENT 'email',
  `passpharse` varchar(255) NOT NULL COMMENT 'passpharse',
  `status` tinyint unsigned NOT NULL COMMENT 'user status 1: enable 2: disable',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='user profile';
