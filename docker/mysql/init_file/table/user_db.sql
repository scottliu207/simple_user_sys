--  User
CREATE DATABASE `user_db`;

USE `user_db`;


CREATE TABLE `user_db`.`profile` (
  `petition_count` int unsigned NOT NULL COMMENT '陳情案件數',
  `construction_count` int unsigned NOT NULL COMMENT '地方會勘與建設數',
  `interpellation_count` int unsigned NOT NULL COMMENT '質詢數',
  `proposal_count` int unsigned NOT NULL COMMENT '提案數',
  `view_count` int unsigned NOT NULL COMMENT '網頁瀏覽數',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新時間'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='後台主頁';

-- 管理員
CREATE TABLE `sys_db`.`admin` (
  `id` varchar(50) NOT NULL COMMENT 'user id',
  `account` varchar(50) NOT NULL COMMENT 'user account',
  `email` varchar(255) NOT NULL COMMENT '信箱',
  `password` varchar(255) NOT NULL COMMENT '密碼',
  `auth_level` tinyint unsigned NOT NULL COMMENT '權限等級',
  `status` tinyint unsigned NOT NULL COMMENT '狀態 1: 啟用 2: 停用',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新時間',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='管理員';

-- 會員
CREATE TABLE `sys_db`.`member` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '流水號',
  `name` varchar(50) NOT NULL COMMENT '名稱',
  `phone` varchar(255) NOT NULL COMMENT '電話',
  `address` varchar(255) NOT NULL COMMENT '地址',
  `email` varchar(255) NOT NULL COMMENT '信箱',
  `password` varchar(255) NOT NULL COMMENT '密碼',
  `birth` varchar(255) NOT NULL COMMENT '生日',
  `line_id` varchar(255) NOT NULL COMMENT 'LineID',
  `status` tinyint unsigned NOT NULL COMMENT '狀態 1: 啟用 2: 停用',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新時間',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='會員';

-- 主頁
CREATE TABLE `sys_db`.`home` (
  `image_path` json NOT NULL DEFAULT (_utf8mb4'[]') COMMENT '圖檔位置',
  `image_setting` json NOT NULL DEFAULT (_utf8mb4'[]') COMMENT '圖檔設定',
  `sort` int unsigned NOT NULL COMMENT '排序',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新時間'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='主頁';

-- 類別
CREATE TABLE `sys_db`.`category` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '流水號',
  `type` tinyint unsigned NOT NULL COMMENT '類別(1: 陳情 2: 成果 3: 公布)',
  `name`  varchar(255) NOT NULL COMMENT '名稱',
  `parent_id` int unsigned NOT NULL COMMENT '父層ID',
  `sort` int unsigned NOT NULL COMMENT '排序',
  `status` tinyint unsigned NOT NULL COMMENT '狀態 1: 啟用 2: 停用',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='類別';

-- 陳情資料
CREATE TABLE `sys_db`.`petition` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '流水號',
  `category_id` int unsigned NOT NULL COMMENT '類別ID',
  `title` varchar(255) NOT NULL COMMENT '標題',
  `content` text NOT NULL COMMENT '內文',
  `member_id` int unsigned NOT NULL COMMENT '會員ID',
  `name` varchar(50) NOT NULL COMMENT '名稱',
  `email` varchar(255) NOT NULL COMMENT '信箱',
  `phone` varchar(50) NOT NULL COMMENT '電話',
  `address` varchar(255) NOT NULL COMMENT '地址',
  `district` int NOT NULL COMMENT '區, 參考public.district',
  `village` int NOT NULL COMMENT '村(里), 參考public.district',
  `status` tinyint unsigned NOT NULL DEFAULT '1' COMMENT '狀態 1:未審核 2:處理中 3:不受理 4:已結案 5: 隱藏',
  `reply` text NOT NULL DEFAULT '' COMMENT '回覆',
  `image_path` text NOT NULL COMMENT '圖檔位置',
  `image_status` tinyint unsigned NOT NULL DEFAULT '2' COMMENT '圖片狀態 1: 顯示 2: 不顯示',
  `reply_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '回覆時間',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新時間',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='陳情資料';


-- 活動設定
CREATE TABLE `sys_db`.`event` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '流水號',
  `type` tinyint unsigned NOT NULL COMMENT '類別(1: 連署 2: 活動)',
  `title` varchar(255) NOT NULL COMMENT '標題',
  `start_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '開始時間',
  `end_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '結束時間',
  `status` tinyint unsigned NOT NULL COMMENT '狀態 1: 啟用 2: 停用',
  `detail` json NOT NULL DEFAULT (_utf8mb4'{}') COMMENT '內文細項',
  `extra_info` text NOT NULL COMMENT '額外資訊',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新時間',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='活動設定';

-- 關於
CREATE TABLE `sys_db`.`about` (
  `detail` json NOT NULL DEFAULT (_utf8mb4'{}') COMMENT '內文細項',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新時間'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='關於';


-- 活動參與資料
CREATE TABLE `sys_db`.`event_participant` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '流水號',
  `event_id` int unsigned NOT NULL COMMENT '活動ID',
  `name` varchar(50) NOT NULL COMMENT '名稱',
  `phone` varchar(50) NOT NULL COMMENT '電話',
  `district` int NOT NULL COMMENT '區, 參考public.district',
  `village` int NOT NULL COMMENT '村(里), 參考public.district',
  `address` varchar(255) NOT NULL COMMENT '地址',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='活動參與資料';

-- 議會成果
CREATE TABLE `sys_db`.`achievement` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '流水號',
  `category_id` tinyint unsigned NOT NULL COMMENT '類別 mapping category.id',
  `title` varchar(255) NOT NULL COMMENT '標題',
  `content` text NOT NULL COMMENT '內文',
  `district` int NOT NULL COMMENT '區, 參考public.district',
  `village` int NOT NULL COMMENT '村(里), 參考public.district',
  `sort` int unsigned NOT NULL COMMENT '排序',
  `status` tinyint unsigned NOT NULL COMMENT '狀態 1: 上架 2: 下架',
  `home_status` tinyint unsigned NOT NULL COMMENT '主頁顯示狀態 1:顯示 2:不顯示',
  `image_path` json NOT NULL DEFAULT (_utf8mb4'[]') COMMENT '圖檔位置',
  `image_setting` json NOT NULL DEFAULT (_utf8mb4'[]') COMMENT '圖檔設定',
  `launch_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '上架時間',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新時間',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='議會成果';

-- 資訊公布
CREATE TABLE `sys_db`.`announcement` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '流水號',
  `category_id` tinyint unsigned NOT NULL COMMENT '類別 mapping category.id',
  `title` varchar(255) NOT NULL COMMENT '標題',
  `status` tinyint unsigned NOT NULL COMMENT '狀態 1: 啟用 2: 停用',
  `home_status` tinyint unsigned NOT NULL COMMENT '主頁顯示狀態 1:顯示 2:不顯示',
  `sort` int unsigned NOT NULL COMMENT '排序',
  `image_path` text NOT NULL COMMENT '圖檔位置',
  `detail` json NOT NULL DEFAULT (_utf8mb4'{}') COMMENT '內文細項',
  `launch_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '上架時間',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '建立時間',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新時間',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='資訊公布';

-- 聯絡資訊
CREATE TABLE `sys_db`.`contact` (
  `main_phone` varchar(255) NOT NULL COMMENT '主要電話',
  `second_phone` varchar(255) NOT NULL COMMENT '次要電話',
  `main_address` varchar(255) NOT NULL COMMENT '主要地址',
  `second_address` varchar(255) NOT NULL COMMENT '次要地址',
  `main_fax` varchar(255) NOT NULL COMMENT '主要傳真',
  `second_fax` varchar(255) NOT NULL COMMENT '次要傳真',
  `email` varchar(255) NOT NULL COMMENT '信箱',
  `facebook` varchar(255) NOT NULL COMMENT 'facebook',
  `register_title` varchar(255) NOT NULL COMMENT '註冊頁面標題',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新時間'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='聯絡資訊';
