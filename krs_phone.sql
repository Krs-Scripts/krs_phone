
CREATE TABLE IF NOT EXISTS `krs_phone_users` (
  `phone_number` varchar(50) NOT NULL,
  `identifier` varchar(100) NOT NULL,
  `firstname` varchar(50) DEFAULT 'Unknown',
  `lastname` varchar(50) DEFAULT 'Player',
  `wallpaper` varchar(255) DEFAULT NULL,
  `settings` longtext DEFAULT NULL, 
  PRIMARY KEY (`phone_number`),
  KEY `identifier` (`identifier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
