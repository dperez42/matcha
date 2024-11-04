CREATE DATABASE IF NOT EXISTS `matcha_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE `matcha_db`;

-- 
-- CREATING TABLES
--
CREATE TABLE `users` (
  `uuid` varchar(36) NOT NULL,
  `username` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(60) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `gender` varchar(255) NOT NULL DEFAULT '',
  `sexual` varchar(255) NOT NULL DEFAULT 'bisexual',
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `first` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `last` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `bio` mediumtext,
  `rating` int NOT NULL DEFAULT '0',
  `tags` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `verificated` tinyint(1) NOT NULL DEFAULT '0', 
  `completed` tinyint(1) NOT NULL DEFAULT '0',   
  `address` varchar(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `city` varchar(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `state` varchar(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `zip` varchar(5) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `country` varchar(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `nat` varchar(5) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `longitude` decimal(10,8) DEFAULT '0.0000',
  `latitude` decimal(11,8) DEFAULT '0.0000',
  `phone` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `cell` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `date` DATE NOT NULL,
  `registered` DATE NOT NULL DEFAULT (CURRENT_DATE), 
  `avatar` varchar(255) NOT NULL DEFAULT 'default.png',
  `img1` varchar(255) NOT NULL DEFAULT 'default.png',
  `img2`varchar(255) NOT NULL DEFAULT 'default.png',
  `img3` varchar(255) NOT NULL DEFAULT 'default.png',
  `img4` varchar(255) NOT NULL DEFAULT 'default.png',
  `lastseen` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`uuid`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `tags` (
  `uuid` varchar(36) NOT NULL,
  `tag` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `notifications` (
  `command` varchar(50) NOT NULL,
  `from_uuid` varchar(36) NOT NULL,
  `from_username` varchar(255) NOT NULL,
  `to_uuid` varchar(36) NOT NULL,
  `to_username` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `timestamp` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `notificationsTmp` (
  `command` varchar(50) NOT NULL,
  `from_uuid` varchar(36) NOT NULL,
  `from_username` varchar(255) NOT NULL,
  `to_uuid` varchar(36) NOT NULL,
  `to_username` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `timestamp` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `reported` (
  `command` varchar(50) NOT NULL,
  `from_uuid` varchar(36) NOT NULL,
  `from_username` varchar(255) NOT NULL,
  `to_uuid` varchar(36) NOT NULL,
  `to_username` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `timestamp` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `messages` (
  `from_uuid` varchar(36) NOT NULL,
  `from_username` varchar(255) NOT NULL,
  `to_uuid` varchar(36) NOT NULL,
  `to_username` varchar(255) NOT NULL,
  `timestamp` timestamp NOT NULL,
  `message` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `blocked` (
  `from_uuid` varchar(36) NOT NULL,
  `to_uuid` varchar(36) NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `matched` (
  `from_uuid` varchar(36) NOT NULL,
  `to_uuid` varchar(36) NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;