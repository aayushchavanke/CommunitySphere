-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 24, 2025 at 08:48 AM
-- Server version: 8.0.44
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `communitydb`
--

-- --------------------------------------------------------

--
-- Table structure for table `club_cultural`
--

CREATE TABLE `club_cultural` (
  `id` int NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `likes` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `club_cultural`
--

INSERT INTO `club_cultural` (`id`, `username`, `message`, `likes`, `created_at`) VALUES
(1, 'Parth', 'hii', 0, '2025-12-24 01:38:42');

-- --------------------------------------------------------

--
-- Table structure for table `club_sports`
--

CREATE TABLE `club_sports` (
  `id` int NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `likes` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `club_sports`
--

INSERT INTO `club_sports` (`id`, `username`, `message`, `likes`, `created_at`) VALUES
(1, 'Parth', 'yes', 0, '2025-12-24 01:38:50');

-- --------------------------------------------------------

--
-- Table structure for table `club_tech`
--

CREATE TABLE `club_tech` (
  `id` int NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `likes` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `club_tech`
--

INSERT INTO `club_tech` (`id`, `username`, `message`, `likes`, `created_at`) VALUES
(1, 'Parth', 'Direct test post from console', 0, '2025-12-24 01:18:53'),
(2, 'Parth', 'hii', 0, '2025-12-24 01:30:31'),
(3, 'Parth', 'hii', 0, '2025-12-24 01:34:04'),
(4, 'Parth', 'hii', 0, '2025-12-24 01:39:39');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `fullname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prn` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullname`, `prn`, `email`, `password`, `created_at`) VALUES
(1, 'Parth Tiwari', '124A8116', 'parthmtaids124@gst.sies.edu.in', '$2y$10$shNKOYTN8cSFGwi3QBs.9.B3h9YCBxveg/TVAssWnezJHktjVTBLu', '2025-12-23 16:52:29'),
(2, 'Parth', '124A116', 'parthmtaids@gst.sies.edu.in', '$2y$10$rvzM5.eFM38iKrJkE2sSF.r3KybTuFv1WDWAktepCrrbvDh6VJkd6', '2025-12-24 00:35:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `club_cultural`
--
ALTER TABLE `club_cultural`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `club_sports`
--
ALTER TABLE `club_sports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `club_tech`
--
ALTER TABLE `club_tech`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `prn` (`prn`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_prn` (`prn`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `club_cultural`
--
ALTER TABLE `club_cultural`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `club_sports`
--
ALTER TABLE `club_sports`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `club_tech`
--
ALTER TABLE `club_tech`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
