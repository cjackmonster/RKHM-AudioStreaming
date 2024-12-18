SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;

DROP TABLE IF EXISTS `_bof_ads`;
CREATE TABLE `_bof_ads` (
  `ID` int(6) NOT NULL,
  `type` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `data` longtext DEFAULT NULL CHECK (json_valid(`data`)),
  `url` text DEFAULT NULL,
  `place_id` varchar(60) DEFAULT NULL,
  `fund_total` float DEFAULT 0,
  `fund_spent` float DEFAULT 0,
  `fund_remain` float DEFAULT 0,
  `fund_limit` float DEFAULT 0,
  `fund_spent_day` float DEFAULT 0,
  `fund_spent_day_code` varchar(6) DEFAULT NULL,
  `sta_clicks` int(11) DEFAULT 0,
  `sta_views` int(11) DEFAULT 0,
  `active` int(1) NOT NULL DEFAULT 1,
  `time_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `time_add` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_bof_blacklist`;
CREATE TABLE `_bof_blacklist` (
  `ID` int(9) NOT NULL,
  `object_type` varchar(50) NOT NULL,
  `code` varchar(150) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_bof_cache_db`;
CREATE TABLE `_bof_cache_db` (
  `ID` int(11) NOT NULL,
  `query_hash` varchar(32) NOT NULL,
  `params_hash` varchar(32) DEFAULT NULL,
  `results` longblob DEFAULT NULL,
  `used` int(9) DEFAULT 0,
  `time_add` timestamp NULL DEFAULT current_timestamp(),
  `time_used` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `time_expire` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_bof_cache_files_access`;
CREATE TABLE `_bof_cache_files_access` (
  `action` varchar(10) NOT NULL DEFAULT 'stream',
  `object_type` varchar(20) NOT NULL,
  `object_hash` varchar(32) NOT NULL,
  `source_hash` varchar(32) NOT NULL,
  `path_hash` varchar(32) NOT NULL,
  `key1` varchar(32) NOT NULL,
  `key2` varchar(32) NOT NULL,
  `key3` varchar(32) NOT NULL,
  `user_agent` text NOT NULL,
  `user_ip` tinytext NOT NULL,
  `downloads` int(11) NOT NULL DEFAULT 0,
  `downloads_max` int(11) DEFAULT NULL,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_expire` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_bof_cache_sessions`;
CREATE TABLE `_bof_cache_sessions` (
  `ID` int(11) NOT NULL,
  `session_id` varchar(60) NOT NULL,
  `push_id` tinytext DEFAULT NULL,
  `user_id` int(7) NOT NULL,
  `ip` varchar(39) NOT NULL,
  `ip_country` varchar(30) DEFAULT NULL,
  `platform_type` varchar(30) NOT NULL,
  `device_type` varchar(30) DEFAULT NULL,
  `data` blob DEFAULT NULL,
  `time_online` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `time_add` timestamp NULL DEFAULT current_timestamp(),
  `active` int(1) DEFAULT 1
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_bof_cache_sessions_admin`;
CREATE TABLE `_bof_cache_sessions_admin` (
  `ID` int(11) NOT NULL,
  `session_id` varchar(60) NOT NULL,
  `push_id` tinytext DEFAULT NULL,
  `user_id` int(7) NOT NULL,
  `ip` varchar(39) NOT NULL,
  `ip_country` varchar(30) DEFAULT NULL,
  `platform_type` varchar(30) NOT NULL,
  `device_type` varchar(30) DEFAULT NULL,
  `data` blob DEFAULT NULL,
  `time_online` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `time_add` timestamp NULL DEFAULT current_timestamp(),
  `active` int(1) DEFAULT 1,
  `_time_update` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_bof_cache_stream_royalties`;
CREATE TABLE `_bof_cache_stream_royalties` (
  `ID` int(11) NOT NULL,
  `target_type` varchar(30) NOT NULL,
  `target_id` int(11) NOT NULL,
  `time_end` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `sta_plays` int(11) NOT NULL DEFAULT 0,
  `sta_plays_unique` int(11) NOT NULL DEFAULT 0,
  `sta_paid` float NOT NULL,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_bof_cache_unsubscribe_links`;
CREATE TABLE `_bof_cache_unsubscribe_links` (
  `user_id` int(7) NOT NULL,
  `key1` varchar(32) NOT NULL,
  `key2` varchar(32) NOT NULL,
  `key3` varchar(32) NOT NULL,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_used` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_bof_currencies`;
CREATE TABLE `_bof_currencies` (
  `ID` int(4) NOT NULL,
  `code` varchar(60) NOT NULL,
  `type` varchar(1) NOT NULL,
  `name` varchar(100) NOT NULL,
  `iso_code` varchar(3) NOT NULL,
  `symbol` varchar(100) NOT NULL,
  `format` varchar(20) NOT NULL,
  `active` int(1) NOT NULL DEFAULT 1,
  `_default` int(1) NOT NULL DEFAULT 0,
  `exchange_rate` float DEFAULT NULL,
  `time_add` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `_bof_currencies` (`ID`, `code`, `type`, `name`, `iso_code`, `symbol`, `format`, `active`, `_default`, `exchange_rate`, `time_add`) VALUES(1, 'unitedstatesdollar', 'n', 'United States Dollar', 'USD', '$', 'left_np_1', 1, 1, NULL, '2022-10-03 21:05:20');

DROP TABLE IF EXISTS `_bof_files`;
CREATE TABLE `_bof_files` (
  `ID` int(11) NOT NULL,
  `pass` varchar(10) NOT NULL,
  `type` varchar(10) NOT NULL,
  `host_id` int(11) DEFAULT NULL,
  `dest_host_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `path` tinytext NOT NULL,
  `name` tinytext DEFAULT NULL,
  `extension` varchar(10) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `data` mediumtext DEFAULT NULL,
  `object_type` varchar(30) NOT NULL,
  `size` float DEFAULT NULL,
  `used` int(4) NOT NULL DEFAULT 0,
  `used_in` longtext DEFAULT NULL,
  `used_in_object` varchar(30) DEFAULT NULL,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_moved` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `_bof_files` (`ID`, `pass`, `type`, `host_id`, `dest_host_id`, `user_id`, `path`, `name`, `extension`, `mime_type`, `data`, `object_type`, `size`, `used`, `used_in`, `used_in_object`, `time_add`, `time_moved`) VALUES(1, '654701570c', 'image', 1, 0, 1, 'files/page_widget_bg/23/05/09/645a396cc2bec/0_rocket launch. monsters in the background_esrgan-v1-x2plus.png', '0_rocket launch. monsters in the background_esrgan-v1-x2plus', 'png', 'image/png', '{\"total_size\":1092595,\"width\":1024,\"height\":1024,\"size\":1092595,\"dominant_color\":{\"hex\":\"697477\",\"rgb\":\"105, 116, 119\"}}', 'page_widget_bg', 1092600, 1, 'page_widget65', 'page_widget', '2023-05-09 13:15:39', '2023-05-09 12:15:40');
INSERT INTO `_bof_files` (`ID`, `pass`, `type`, `host_id`, `dest_host_id`, `user_id`, `path`, `name`, `extension`, `mime_type`, `data`, `object_type`, `size`, `used`, `used_in`, `used_in_object`, `time_add`, `time_moved`) VALUES(2, '450caac95e', 'image', 1, 0, 1, 'files/page_img/23/05/09/645a3985cc8f5/989898.png', '989898', 'png', 'image/png', '{\"total_size\":51809,\"width\":666,\"height\":671,\"size\":51809,\"dominant_color\":{\"hex\":\"6e6d75\",\"rgb\":\"110, 109, 117\"}}', 'page_img', 51809, 1, 'page_widget80', 'page_widget', '2023-05-09 13:16:04', '2023-05-09 12:16:05');
INSERT INTO `_bof_files` (`ID`, `pass`, `type`, `host_id`, `dest_host_id`, `user_id`, `path`, `name`, `extension`, `mime_type`, `data`, `object_type`, `size`, `used`, `used_in`, `used_in_object`, `time_add`, `time_moved`) VALUES(3, '056e8a8249', 'image', 1, 0, 1, 'files/logo/23/05/09/645a39df015f7/63f3b1054e808.png', '63f3b1054e808', 'png', 'image/png', '{\"total_size\":10033,\"width\":554,\"height\":128,\"size\":10033,\"dominant_color\":{\"hex\":\"222222\",\"rgb\":\"34, 34, 34\"}}', 'logo', 10033, 1, 'st_logo', NULL, '2023-05-09 13:17:20', '2023-05-09 12:17:35');
INSERT INTO `_bof_files` (`ID`, `pass`, `type`, `host_id`, `dest_host_id`, `user_id`, `path`, `name`, `extension`, `mime_type`, `data`, `object_type`, `size`, `used`, `used_in`, `used_in_object`, `time_add`, `time_moved`) VALUES(4, '0a16b038c0', 'image', 1, 0, 1, 'files/logo/23/05/09/645a39df12c2a/63f2773628e00.png', '63f2773628e00', 'png', 'image/png', '{\"total_size\":11126,\"width\":500,\"height\":116,\"size\":11126,\"dominant_color\":{\"hex\":\"0\",\"rgb\":\"0, 0, 0\"}}', 'logo', 11126, 1, 'st_secondary_logo', NULL, '2023-05-09 13:17:25', '2023-05-09 12:17:35');
INSERT INTO `_bof_files` (`ID`, `pass`, `type`, `host_id`, `dest_host_id`, `user_id`, `path`, `name`, `extension`, `mime_type`, `data`, `object_type`, `size`, `used`, `used_in`, `used_in_object`, `time_add`, `time_moved`) VALUES(7, '136c6c3a5f', 'image', 1, 0, 1, 'files/placeholder/23/05/09/645a3b28208fd/dummy_500x500_7e877e_292e29_dm2.png', 'dummy_500x500_7e877e_292e29_dm2', 'png', 'image/png', '{\"total_size\":3837,\"width\":500,\"height\":500,\"size\":3837,\"dominant_color\":{\"hex\":\"292e29\",\"rgb\":\"41, 46, 41\"}}', 'placeholder', 3837, 1, 'st_placeholder', NULL, '2023-05-09 13:18:36', '2023-05-09 12:23:04');
INSERT INTO `_bof_files` (`ID`, `pass`, `type`, `host_id`, `dest_host_id`, `user_id`, `path`, `name`, `extension`, `mime_type`, `data`, `object_type`, `size`, `used`, `used_in`, `used_in_object`, `time_add`, `time_moved`) VALUES(8, '3f8529ae20', 'image', 1, 0, 1, 'files/placeholder/23/05/09/645a3b285158e/avatar.png', 'avatar', 'png', 'image/png', '{\"total_size\":118127,\"width\":345,\"height\":346,\"size\":118127,\"dominant_color\":{\"hex\":\"3c7495\",\"rgb\":\"60, 116, 149\"}}', 'placeholder', 118127, 1, 'st_phu_avatar', NULL, '2023-05-09 13:23:03', '2023-05-09 12:23:04');
INSERT INTO `_bof_files` (`ID`, `pass`, `type`, `host_id`, `dest_host_id`, `user_id`, `path`, `name`, `extension`, `mime_type`, `data`, `object_type`, `size`, `used`, `used_in`, `used_in_object`, `time_add`, `time_moved`) VALUES(9, '6d69a35746', 'image', 1, 0, 1, 'files/placeholder/23/05/09/645a3c3befd57/0_trippy skeletons_esrgan-v1-x2plus -1-.png', '0_trippy skeletons_esrgan-v1-x2plus -1-', 'png', 'image/png', '{\"total_size\":1687544,\"width\":1024,\"height\":1024,\"size\":1687544,\"dominant_color\":{\"hex\":\"636b7b\",\"rgb\":\"99, 107, 123\"}}', 'placeholder', 1687540, 1, 'st_phu_bg', NULL, '2023-05-09 13:27:38', '2023-05-09 12:27:39');
INSERT INTO `_bof_files` (`ID`, `pass`, `type`, `host_id`, `dest_host_id`, `user_id`, `path`, `name`, `extension`, `mime_type`, `data`, `object_type`, `size`, `used`, `used_in`, `used_in_object`, `time_add`, `time_moved`) VALUES(10, '857590cbcf', 'audio', 1, 0, 1, 'files/m_track_source/23/12/06/656feaa66e339/lemonmusicstudio - inside you - single.mp3', 'inside-you-162760', 'mp3', 'audio/mpeg', '{\"total_size\":4141975,\"size\":4141975,\"tags\":{\"duration\":130,\"format\":\"mp3\",\"bitrate\":256}}', 'm_track_source', 4141980, 1, 'm_track_source1', 'm_track_source', '2023-12-06 03:19:27', '2023-12-06 03:29:42');
INSERT INTO `_bof_files` (`ID`, `pass`, `type`, `host_id`, `dest_host_id`, `user_id`, `path`, `name`, `extension`, `mime_type`, `data`, `object_type`, `size`, `used`, `used_in`, `used_in_object`, `time_add`, `time_moved`) VALUES(11, '4e57090574', 'audio', 1, 0, 1, 'files/m_track_source/23/12/06/656feaa88e302/royaltyfreemusic - deep future garage - single.mp3', 'deep-future-garage-royalty-free-music-163081', 'mp3', 'audio/mpeg', '{\"total_size\":4018259,\"size\":4018259,\"tags\":{\"duration\":126,\"format\":\"mp3\",\"bitrate\":256}}', 'm_track_source', 4018260, 1, 'm_track_source2', 'm_track_source', '2023-12-06 03:19:27', '2023-12-06 03:29:44');
INSERT INTO `_bof_files` (`ID`, `pass`, `type`, `host_id`, `dest_host_id`, `user_id`, `path`, `name`, `extension`, `mime_type`, `data`, `object_type`, `size`, `used`, `used_in`, `used_in_object`, `time_add`, `time_moved`) VALUES(12, '2914be34c6', 'audio', 1, 0, 1, 'files/m_track_source/23/12/06/656feac88ff93/leonell cassio - leonell cassio - the paranormal is real - single.mp3', 'leonell-cassio-the-paranormal-is-real-ft-carrie-163742', 'mp3', 'audio/mpeg', '{\"total_size\":5377462,\"size\":5377462,\"tags\":{\"duration\":169,\"format\":\"mp3\",\"bitrate\":256}}', 'm_track_source', 5377460, 1, 'm_track_source3', 'm_track_source', '2023-12-06 03:19:28', '2023-12-06 03:30:16');
INSERT INTO `_bof_files` (`ID`, `pass`, `type`, `host_id`, `dest_host_id`, `user_id`, `path`, `name`, `extension`, `mime_type`, `data`, `object_type`, `size`, `used`, `used_in`, `used_in_object`, `time_add`, `time_moved`) VALUES(13, '63e04fdcf9', 'audio', 1, 0, 1, 'files/m_track_source/23/12/06/656feadb49ce0/sergepavkinmusic - a long way - single.mp3', 'a-long-way-166385', 'mp3', 'audio/mpeg', '{\"total_size\":8738690,\"size\":8738690,\"tags\":{\"duration\":274,\"format\":\"mp3\",\"bitrate\":256}}', 'm_track_source', 8738690, 1, 'm_track_source4', 'm_track_source', '2023-12-06 03:19:28', '2023-12-06 03:30:35');
INSERT INTO `_bof_files` (`ID`, `pass`, `type`, `host_id`, `dest_host_id`, `user_id`, `path`, `name`, `extension`, `mime_type`, `data`, `object_type`, `size`, `used`, `used_in`, `used_in_object`, `time_add`, `time_moved`) VALUES(14, 'dd8228aa22', 'audio', 1, 0, 1, 'files/m_track_source/23/12/06/656feaec8745c/paoloargento - the best jazz club in new orleans - single.mp3', 'the-best-jazz-club-in-new-orleans-164472', 'mp3', 'audio/mpeg', '{\"total_size\":3843552,\"size\":3843552,\"tags\":{\"duration\":121,\"format\":\"mp3\",\"bitrate\":256}}', 'm_track_source', 3843550, 1, 'm_track_source5', 'm_track_source', '2023-12-06 03:19:28', '2023-12-06 03:30:52');
INSERT INTO `_bof_files` (`ID`, `pass`, `type`, `host_id`, `dest_host_id`, `user_id`, `path`, `name`, `extension`, `mime_type`, `data`, `object_type`, `size`, `used`, `used_in`, `used_in_object`, `time_add`, `time_moved`) VALUES(15, '7c00fd2b03', 'audio', 1, 0, 1, 'files/m_track_source/23/12/06/656feb04e8886/royaltyfreemusic - trap future bass - single.mp3', 'trap-future-bass-royalty-free-music-167020', 'mp3', 'audio/mpeg', '{\"total_size\":4048352,\"size\":4048352,\"tags\":{\"duration\":127,\"format\":\"mp3\",\"bitrate\":256}}', 'm_track_source', 4048350, 1, 'm_track_source6', 'm_track_source', '2023-12-06 03:19:29', '2023-12-06 03:31:16');
INSERT INTO `_bof_files` (`ID`, `pass`, `type`, `host_id`, `dest_host_id`, `user_id`, `path`, `name`, `extension`, `mime_type`, `data`, `object_type`, `size`, `used`, `used_in`, `used_in_object`, `time_add`, `time_moved`) VALUES(16, '4e461fe64a', 'audio', 1, 0, 1, 'files/m_track_source/23/12/06/656feb172a8ad/coma-media - glossy - single.mp3', 'glossy-168156', 'mp3', 'audio/mpeg', '{\"total_size\":2992587,\"size\":2992587,\"tags\":{\"duration\":94,\"format\":\"mp3\",\"bitrate\":256}}', 'm_track_source', 2992590, 1, 'm_track_source7', 'm_track_source', '2023-12-06 03:19:29', '2023-12-06 03:31:35');
INSERT INTO `_bof_files` (`ID`, `pass`, `type`, `host_id`, `dest_host_id`, `user_id`, `path`, `name`, `extension`, `mime_type`, `data`, `object_type`, `size`, `used`, `used_in`, `used_in_object`, `time_add`, `time_moved`) VALUES(20, 'feb8d6aa37', 'image', 1, 0, 1, 'files/m_track_c/23/12/06/656feaa5f24d2/output.jpg', 'output', 'jpg', 'image/jpeg', '{\"total_size\":91801,\"width\":512,\"height\":512,\"size\":39613,\"dominant_color\":{\"hex\":\"5b4e36\",\"rgb\":\"91, 78, 54\"},\"_sisters\":{\"500\":{\"name\":\"656feaa5f2d68\",\"path\":\"files\\/m_track_c\\/23\\/12\\/06\\/656feaa5f24d2\\/656feaa5f2d68.jpg\",\"size\":35005,\"width\":500,\"height\":500},\"300\":{\"name\":\"656feaa5f301b\",\"path\":\"files\\/m_track_c\\/23\\/12\\/06\\/656feaa5f24d2\\/656feaa5f301b.jpg\",\"size\":14467,\"width\":300,\"height\":300},\"thumb\":{\"name\":\"656feaa5f32ac\",\"path\":\"files\\/m_track_c\\/23\\/12\\/06\\/656feaa5f24d2\\/656feaa5f32ac.jpg\",\"size\":2716,\"width\":100,\"height\":100}}}', 'm_track_c', 91801, 1, 'm_track1', 'm_track', '2023-12-06 03:22:46', '2023-12-06 03:29:42');
INSERT INTO `_bof_files` (`ID`, `pass`, `type`, `host_id`, `dest_host_id`, `user_id`, `path`, `name`, `extension`, `mime_type`, `data`, `object_type`, `size`, `used`, `used_in`, `used_in_object`, `time_add`, `time_moved`) VALUES(21, '4faf3ac231', 'image', 1, 0, 1, 'files/m_track_c/23/12/06/656feaa869aff/output -1-.jpg', 'output -1-', 'jpg', 'image/jpeg', '{\"total_size\":104715,\"width\":512,\"height\":512,\"size\":44826,\"dominant_color\":{\"hex\":\"7b766f\",\"rgb\":\"123, 118, 111\"},\"_sisters\":{\"500\":{\"name\":\"656feaa869fc3\",\"path\":\"files\\/m_track_c\\/23\\/12\\/06\\/656feaa869aff\\/656feaa869fc3.jpg\",\"size\":39664,\"width\":500,\"height\":500},\"300\":{\"name\":\"656feaa86a249\",\"path\":\"files\\/m_track_c\\/23\\/12\\/06\\/656feaa869aff\\/656feaa86a249.jpg\",\"size\":17023,\"width\":300,\"height\":300},\"thumb\":{\"name\":\"656feaa86a4b9\",\"path\":\"files\\/m_track_c\\/23\\/12\\/06\\/656feaa869aff\\/656feaa86a4b9.jpg\",\"size\":3202,\"width\":100,\"height\":100}}}', 'm_track_c', 104715, 1, 'm_track2', 'm_track', '2023-12-06 03:23:26', '2023-12-06 03:29:44');
INSERT INTO `_bof_files` (`ID`, `pass`, `type`, `host_id`, `dest_host_id`, `user_id`, `path`, `name`, `extension`, `mime_type`, `data`, `object_type`, `size`, `used`, `used_in`, `used_in_object`, `time_add`, `time_moved`) VALUES(23, '8694702d0a', 'image', 1, 0, 1, 'files/m_track_c/23/12/06/656feadb1b5ea/output -3-.jpg', 'output -3-', 'jpg', 'image/jpeg', '{\"total_size\":171640,\"width\":512,\"height\":512,\"size\":77827,\"dominant_color\":{\"hex\":\"7c6c51\",\"rgb\":\"124, 108, 81\"},\"_sisters\":{\"500\":{\"name\":\"656feadb212dc\",\"path\":\"files\\/m_track_c\\/23\\/12\\/06\\/656feadb1b5ea\\/656feadb212dc.jpg\",\"size\":64302,\"width\":500,\"height\":500},\"300\":{\"name\":\"656feadb215d4\",\"path\":\"files\\/m_track_c\\/23\\/12\\/06\\/656feadb1b5ea\\/656feadb215d4.jpg\",\"size\":25688,\"width\":300,\"height\":300},\"thumb\":{\"name\":\"656feadb21929\",\"path\":\"files\\/m_track_c\\/23\\/12\\/06\\/656feadb1b5ea\\/656feadb21929.jpg\",\"size\":3823,\"width\":100,\"height\":100}}}', 'm_track_c', 171640, 1, 'm_track4', 'm_track', '2023-12-06 03:25:32', '2023-12-06 03:30:35');
INSERT INTO `_bof_files` (`ID`, `pass`, `type`, `host_id`, `dest_host_id`, `user_id`, `path`, `name`, `extension`, `mime_type`, `data`, `object_type`, `size`, `used`, `used_in`, `used_in_object`, `time_add`, `time_moved`) VALUES(24, 'cd01637265', 'image', 1, 0, 1, 'files/m_track_c/23/12/06/656feaec5d5fa/output -4-.jpg', 'output -4-', 'jpg', 'image/jpeg', '{\"total_size\":138561,\"width\":512,\"height\":512,\"size\":56879,\"dominant_color\":{\"hex\":\"7a5d5f\",\"rgb\":\"122, 93, 95\"},\"_sisters\":{\"500\":{\"name\":\"656feaec5db3b\",\"path\":\"files\\/m_track_c\\/23\\/12\\/06\\/656feaec5d5fa\\/656feaec5db3b.jpg\",\"size\":51576,\"width\":500,\"height\":500},\"300\":{\"name\":\"656feaec5de10\",\"path\":\"files\\/m_track_c\\/23\\/12\\/06\\/656feaec5d5fa\\/656feaec5de10.jpg\",\"size\":24842,\"width\":300,\"height\":300},\"thumb\":{\"name\":\"656feaec5e0c2\",\"path\":\"files\\/m_track_c\\/23\\/12\\/06\\/656feaec5d5fa\\/656feaec5e0c2.jpg\",\"size\":5264,\"width\":100,\"height\":100}}}', 'm_track_c', 138561, 1, 'm_track5', 'm_track', '2023-12-06 03:26:05', '2023-12-06 03:30:52');
INSERT INTO `_bof_files` (`ID`, `pass`, `type`, `host_id`, `dest_host_id`, `user_id`, `path`, `name`, `extension`, `mime_type`, `data`, `object_type`, `size`, `used`, `used_in`, `used_in_object`, `time_add`, `time_moved`) VALUES(25, 'c2054c699c', 'image', 1, 0, 1, 'files/m_track_c/23/12/06/656feac8689bc/output -5-.jpg', 'output -5-', 'jpg', 'image/jpeg', '{\"total_size\":107443,\"width\":512,\"height\":512,\"size\":45232,\"dominant_color\":{\"hex\":\"756958\",\"rgb\":\"117, 105, 88\"},\"_sisters\":{\"500\":{\"name\":\"656feac868ea0\",\"path\":\"files\\/m_track_c\\/23\\/12\\/06\\/656feac8689bc\\/656feac868ea0.jpg\",\"size\":40439,\"width\":500,\"height\":500},\"300\":{\"name\":\"656feac86911a\",\"path\":\"files\\/m_track_c\\/23\\/12\\/06\\/656feac8689bc\\/656feac86911a.jpg\",\"size\":18068,\"width\":300,\"height\":300},\"thumb\":{\"name\":\"656feac86938d\",\"path\":\"files\\/m_track_c\\/23\\/12\\/06\\/656feac8689bc\\/656feac86938d.jpg\",\"size\":3704,\"width\":100,\"height\":100}}}', 'm_track_c', 107443, 1, 'm_track3', 'm_track', '2023-12-06 03:26:33', '2023-12-06 03:30:16');
INSERT INTO `_bof_files` (`ID`, `pass`, `type`, `host_id`, `dest_host_id`, `user_id`, `path`, `name`, `extension`, `mime_type`, `data`, `object_type`, `size`, `used`, `used_in`, `used_in_object`, `time_add`, `time_moved`) VALUES(26, '1ef75a15ee', 'image', 1, 0, 1, 'files/m_track_c/23/12/06/656feb04c34ad/output -6-.jpg', 'output -6-', 'jpg', 'image/jpeg', '{\"total_size\":93429,\"width\":512,\"height\":512,\"size\":38048,\"dominant_color\":{\"hex\":\"977b96\",\"rgb\":\"151, 123, 150\"},\"_sisters\":{\"500\":{\"name\":\"656feb04c39f0\",\"path\":\"files\\/m_track_c\\/23\\/12\\/06\\/656feb04c34ad\\/656feb04c39f0.jpg\",\"size\":34905,\"width\":500,\"height\":500},\"300\":{\"name\":\"656feb04c3c77\",\"path\":\"files\\/m_track_c\\/23\\/12\\/06\\/656feb04c34ad\\/656feb04c3c77.jpg\",\"size\":16726,\"width\":300,\"height\":300},\"thumb\":{\"name\":\"656feb04c3ef6\",\"path\":\"files\\/m_track_c\\/23\\/12\\/06\\/656feb04c34ad\\/656feb04c3ef6.jpg\",\"size\":3750,\"width\":100,\"height\":100}}}', 'm_track_c', 93429, 1, 'm_track6', 'm_track', '2023-12-06 03:27:22', '2023-12-06 03:31:16');
INSERT INTO `_bof_files` (`ID`, `pass`, `type`, `host_id`, `dest_host_id`, `user_id`, `path`, `name`, `extension`, `mime_type`, `data`, `object_type`, `size`, `used`, `used_in`, `used_in_object`, `time_add`, `time_moved`) VALUES(27, '3177a3aa3f', 'image', 1, 0, 1, 'files/m_track_c/23/12/06/656feb16f1fee/output -7-.jpg', 'output -7-', 'jpg', 'image/jpeg', '{\"total_size\":79714,\"width\":512,\"height\":512,\"size\":33829,\"dominant_color\":{\"hex\":\"7a6e6f\",\"rgb\":\"122, 110, 111\"},\"_sisters\":{\"500\":{\"name\":\"656feb16f27ff\",\"path\":\"files\\/m_track_c\\/23\\/12\\/06\\/656feb16f1fee\\/656feb16f27ff.jpg\",\"size\":29976,\"width\":500,\"height\":500},\"300\":{\"name\":\"656feb16f2b5c\",\"path\":\"files\\/m_track_c\\/23\\/12\\/06\\/656feb16f1fee\\/656feb16f2b5c.jpg\",\"size\":13026,\"width\":300,\"height\":300},\"thumb\":{\"name\":\"656feb16f2e47\",\"path\":\"files\\/m_track_c\\/23\\/12\\/06\\/656feb16f1fee\\/656feb16f2e47.jpg\",\"size\":2883,\"width\":100,\"height\":100}}}', 'm_track_c', 79714, 1, 'm_track7', 'm_track', '2023-12-06 03:28:10', '2023-12-06 03:31:35');
INSERT INTO `_bof_files` (`ID`, `pass`, `type`, `host_id`, `dest_host_id`, `user_id`, `path`, `name`, `extension`, `mime_type`, `data`, `object_type`, `size`, `used`, `used_in`, `used_in_object`, `time_add`, `time_moved`) VALUES(28, '3f7592f871', 'image', 1, 0, 1, 'files/mobile_logo/23/12/06/656febc7491dc/final10.png', 'final10', 'png', 'image/png', '{\"total_size\":15200,\"width\":200,\"height\":200,\"size\":10546,\"dominant_color\":{\"hex\":\"8c5511\",\"rgb\":\"140, 85, 17\"},\"_sisters\":{\"thumb\":{\"name\":\"656febc74998b\",\"path\":\"files\\/mobile_logo\\/23\\/12\\/06\\/656febc7491dc\\/656febc74998b.png\",\"size\":4654,\"width\":100,\"height\":100}}}', 'mobile_logo', 15200, 1, 'st_mobile_logo', NULL, '2023-12-06 03:34:23', '2023-12-06 03:34:31');
INSERT INTO `_bof_files` (`ID`, `pass`, `type`, `host_id`, `dest_host_id`, `user_id`, `path`, `name`, `extension`, `mime_type`, `data`, `object_type`, `size`, `used`, `used_in`, `used_in_object`, `time_add`, `time_moved`) VALUES(29, 'b1d782f36a', 'image', 1, 0, 1, 'files/logo/23/12/06/656febc78a2ea/final10_656febc1c453f.png', 'final10_656febc1c453f', 'png', 'image/png', '{\"total_size\":15200,\"width\":200,\"height\":200,\"size\":10546,\"dominant_color\":{\"hex\":\"8c5511\",\"rgb\":\"140, 85, 17\"},\"_sisters\":{\"thumb\":{\"name\":\"656febc78ab01\",\"path\":\"files\\/logo\\/23\\/12\\/06\\/656febc78a2ea\\/656febc78ab01.png\",\"size\":4654,\"width\":100,\"height\":100}}}', 'logo', 15200, 1, 'st_admin_logo', NULL, '2023-12-06 03:34:25', '2023-12-06 03:34:31');
INSERT INTO `_bof_files` (`ID`, `pass`, `type`, `host_id`, `dest_host_id`, `user_id`, `path`, `name`, `extension`, `mime_type`, `data`, `object_type`, `size`, `used`, `used_in`, `used_in_object`, `time_add`, `time_moved`) VALUES(30, '2f3259184b', 'image', 1, 0, 1, 'files/icon/23/12/06/656febc7aa8ef/final10_656febc498ba0.png', 'final10_656febc498ba0', 'png', 'image/png', '{\"total_size\":15200,\"width\":200,\"height\":200,\"size\":10546,\"dominant_color\":{\"hex\":\"8c5511\",\"rgb\":\"140, 85, 17\"},\"_sisters\":{\"thumb\":{\"name\":\"656febc7aafb8\",\"path\":\"files\\/icon\\/23\\/12\\/06\\/656febc7aa8ef\\/656febc7aafb8.png\",\"size\":4654,\"width\":100,\"height\":100}}}', 'icon', 15200, 1, 'st_icon', NULL, '2023-12-06 03:34:28', '2023-12-06 03:34:31');

DROP TABLE IF EXISTS `_bof_files_hosts`;
CREATE TABLE `_bof_files_hosts` (
  `ID` int(11) NOT NULL,
  `name` tinytext NOT NULL,
  `comment` text DEFAULT NULL,
  `type` varchar(20) NOT NULL,
  `data` text DEFAULT NULL,
  `s_files_count` int(11) NOT NULL DEFAULT 0,
  `s_files_size` bigint(11) NOT NULL DEFAULT 0,
  `time_upload` timestamp NULL DEFAULT NULL,
  `time_add` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `_bof_files_hosts` (`ID`, `name`, `comment`, `type`, `data`, `s_files_count`, `s_files_size`, `time_upload`, `time_add`) VALUES(1, 'Localhost', 'This server', 'localhost', '{\"path\":\"uploads\"}', 24, 36968855, '2021-11-22 15:11:12', '2021-11-22 15:11:12');

DROP TABLE IF EXISTS `_bof_log_ai_fees`;
CREATE TABLE `_bof_log_ai_fees` (
  `ID` int(11) NOT NULL,
  `service` varchar(10) NOT NULL,
  `ai` varchar(50) NOT NULL,
  `action` varchar(100) NOT NULL,
  `fee` float NOT NULL,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_bof_log_api_requests`;
CREATE TABLE `_bof_log_api_requests` (
  `ID` int(11) NOT NULL,
  `endpoint_name` varchar(30) DEFAULT NULL,
  `endpoint_data` mediumtext DEFAULT NULL,
  `user_id` int(8) DEFAULT NULL,
  `request_url` text DEFAULT NULL,
  `request_sessid` varchar(50) DEFAULT NULL,
  `request_cookies` mediumtext DEFAULT NULL,
  `request_posts` mediumtext DEFAULT NULL,
  `request_params` mediumtext DEFAULT NULL,
  `request_headers` mediumtext DEFAULT NULL,
  `ip` varchar(39) DEFAULT NULL,
  `ip_country` varchar(2) DEFAULT NULL,
  `device_cordova` varchar(20) DEFAULT NULL,
  `device_is_virtual` int(1) DEFAULT NULL,
  `device_manufacturer` varchar(100) DEFAULT NULL,
  `device_model` varchar(100) DEFAULT NULL,
  `device_platform` varchar(100) DEFAULT NULL,
  `device_version` varchar(20) DEFAULT NULL,
  `device_uuid` varchar(100) DEFAULT NULL,
  `device_serial` varchar(100) DEFAULT NULL,
  `object_type` varchar(30) DEFAULT NULL,
  `object_hash` varchar(32) DEFAULT NULL,
  `object_id` int(11) DEFAULT NULL,
  `bofClient_slug` varchar(150) DEFAULT NULL,
  `time_add` timestamp NULL DEFAULT current_timestamp(),
  `sta` int(1) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_bof_log_api_requests_admin`;
CREATE TABLE `_bof_log_api_requests_admin` (
  `ID` int(11) NOT NULL,
  `endpoint_name` varchar(30) DEFAULT NULL,
  `endpoint_data` mediumtext DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `request_url` text DEFAULT NULL,
  `request_sessid` varchar(50) DEFAULT NULL,
  `request_cookies` mediumtext DEFAULT NULL,
  `request_posts` mediumtext DEFAULT NULL,
  `request_params` mediumtext DEFAULT NULL,
  `request_headers` mediumtext DEFAULT NULL,
  `ip` varchar(39) DEFAULT NULL,
  `ip_country` varchar(2) DEFAULT NULL,
  `device_cordova` varchar(20) DEFAULT NULL,
  `device_is_virtual` int(1) DEFAULT NULL,
  `device_manufacturer` varchar(100) DEFAULT NULL,
  `device_model` varchar(100) DEFAULT NULL,
  `device_platform` varchar(100) DEFAULT NULL,
  `device_version` varchar(20) DEFAULT NULL,
  `device_uuid` varchar(100) DEFAULT NULL,
  `device_serial` varchar(100) DEFAULT NULL,
  `time_add` timestamp NULL DEFAULT current_timestamp(),
  `sta` int(1) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_bof_log_cronjob_g`;
CREATE TABLE `_bof_log_cronjob_g` (
  `ID` int(11) NOT NULL,
  `PID` int(11) NOT NULL,
  `code` varchar(20) NOT NULL,
  `title` tinytext DEFAULT NULL,
  `detail` mediumtext DEFAULT NULL,
  `time_start` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_end` timestamp NULL DEFAULT NULL,
  `sta` int(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_bof_log_cronjob_p`;
CREATE TABLE `_bof_log_cronjob_p` (
  `ID` int(11) NOT NULL,
  `PID` int(11) NOT NULL,
  `GID` int(11) NOT NULL,
  `text` longtext NOT NULL,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_bof_log_curls`;
CREATE TABLE `_bof_log_curls` (
  `ID` int(11) NOT NULL,
  `hook` varchar(32) DEFAULT NULL,
  `url` varchar(400) NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `request_body` mediumtext DEFAULT NULL,
  `request_header` text DEFAULT NULL,
  `response_body` longblob DEFAULT NULL,
  `response_body_size` bigint(20) DEFAULT NULL,
  `response_header` text DEFAULT NULL,
  `response_header_code` int(4) DEFAULT NULL,
  `used` int(11) DEFAULT 0,
  `time_used` timestamp NULL DEFAULT NULL,
  `time_start` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_expire` timestamp NULL DEFAULT NULL,
  `time_exe` float NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_bof_log_db`;
CREATE TABLE `_bof_log_db` (
  `ID` int(11) NOT NULL,
  `table` varchar(100) DEFAULT NULL,
  `action` varchar(10) DEFAULT NULL,
  `query` mediumtext DEFAULT NULL,
  `params` mediumtext DEFAULT NULL,
  `safe` int(1) DEFAULT NULL,
  `exe_time` float NOT NULL,
  `critical` int(1) DEFAULT NULL,
  `error` mediumtext DEFAULT NULL,
  `time_start` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `time_add` timestamp NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_bof_log_errors`;
CREATE TABLE `_bof_log_errors` (
  `ID` int(11) NOT NULL,
  `file` tinytext NOT NULL,
  `line` int(11) NOT NULL,
  `severity` varchar(25) DEFAULT NULL,
  `severity_name` varchar(25) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `bof_version` int(5) NOT NULL,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_bof_log_ips`;
CREATE TABLE `_bof_log_ips` (
  `IP` varchar(39) NOT NULL,
  `source` varchar(30) NOT NULL,
  `continent` varchar(2) DEFAULT NULL,
  `country` varchar(2) DEFAULT NULL,
  `region` varchar(2) DEFAULT NULL,
  `lat` float DEFAULT NULL,
  `lon` float DEFAULT NULL,
  `full_response` longtext DEFAULT NULL CHECK (json_valid(`full_response`)),
  `time_add` timestamp NULL DEFAULT current_timestamp(),
  `time_expire` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_bof_log_requests`;
CREATE TABLE `_bof_log_requests` (
  `ID` int(11) NOT NULL,
  `endpoint_name` varchar(30) DEFAULT NULL,
  `endpoint_data` mediumtext DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `request_url` text DEFAULT NULL,
  `request_sessid` varchar(50) DEFAULT NULL,
  `request_cookies` mediumtext DEFAULT NULL,
  `request_posts` mediumtext DEFAULT NULL,
  `request_params` mediumtext DEFAULT NULL,
  `request_headers` mediumtext DEFAULT NULL,
  `ip` varchar(39) DEFAULT NULL,
  `ip_country` varchar(2) DEFAULT NULL,
  `agent` tinytext DEFAULT NULL,
  `agent_model` varchar(50) DEFAULT NULL,
  `agent_type` varchar(10) DEFAULT NULL,
  `agent_os` varchar(30) DEFAULT NULL,
  `agent_browser` varchar(30) DEFAULT NULL,
  `agent_engine` varchar(30) DEFAULT NULL,
  `referer` varchar(100) DEFAULT NULL,
  `referer_full` mediumtext DEFAULT NULL,
  `time_add` timestamp NULL DEFAULT current_timestamp(),
  `sta` int(1) DEFAULT NULL,
  `result` text DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_bof_log_requests_admin`;
CREATE TABLE `_bof_log_requests_admin` (
  `ID` int(11) NOT NULL,
  `endpoint_name` varchar(30) DEFAULT NULL,
  `endpoint_data` mediumtext DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `request_url` text DEFAULT NULL,
  `request_sessid` varchar(50) DEFAULT NULL,
  `request_cookies` mediumtext DEFAULT NULL,
  `request_posts` mediumtext DEFAULT NULL,
  `request_params` mediumtext DEFAULT NULL,
  `request_headers` mediumtext DEFAULT NULL,
  `ip` varchar(39) DEFAULT NULL,
  `ip_country` varchar(2) DEFAULT NULL,
  `agent` tinytext DEFAULT NULL,
  `agent_model` varchar(50) DEFAULT NULL,
  `agent_type` varchar(10) DEFAULT NULL,
  `agent_os` varchar(30) DEFAULT NULL,
  `agent_browser` varchar(30) DEFAULT NULL,
  `agent_engine` varchar(30) DEFAULT NULL,
  `referer` varchar(100) DEFAULT NULL,
  `referer_full` mediumtext DEFAULT NULL,
  `time_add` timestamp NULL DEFAULT current_timestamp(),
  `sta` int(1) DEFAULT NULL,
  `result` text DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_bof_notification`;
CREATE TABLE `_bof_notification` (
  `ID` int(3) NOT NULL,
  `hook` varchar(100) NOT NULL,
  `def_setting` longtext DEFAULT NULL CHECK (json_valid(`def_setting`)),
  `detail` mediumtext DEFAULT NULL,
  `detail_params` longtext DEFAULT NULL CHECK (json_valid(`detail_params`)),
  `setting` longtext DEFAULT NULL CHECK (json_valid(`setting`)),
  `texts` longtext DEFAULT NULL CHECK (json_valid(`texts`)),
  `time_add` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `_bof_notification` (`ID`, `hook`, `def_setting`, `detail`, `detail_params`, `setting`, `texts`, `time_add`) VALUES(1, 'new_follower', '{}', 'User is followed by another user', '{\"username\":\"Follower\'s username\"}', '{\"methods\":{\"all\":true,\"db\":true,\"email\":false,\"push\":true}}', '{\"title\":\"@<b>%username%<\\/b> started following you\"}', '2023-01-27 20:42:29');
INSERT INTO `_bof_notification` (`ID`, `hook`, `def_setting`, `detail`, `detail_params`, `setting`, `texts`, `time_add`) VALUES(2, 'new_playlist_subscriber', '{}', 'User\'s playlist is added to another user\'s library', '{\"username\":\"Adder\'s username\",\"playlist_name\":\"The playlist\'s name\"}', '{\"methods\":{\"all\":true,\"db\":true,\"push\":true}}', '{\"title\":\"@<b>%username%<\\/b> added your playlist: #<b>%playlist_name%<\\/b> to their library\"}', '2023-01-27 23:54:51');
INSERT INTO `_bof_notification` (`ID`, `hook`, `def_setting`, `detail`, `detail_params`, `setting`, `texts`, `time_add`) VALUES(3, 'welcome', NULL, 'User verified their email', NULL, '{\"methods\":{\"all\":true,\"email\":false,\"push\":false,\"db\":true}}', '{\"title\":\"Welcome!\",\"content\":\"Thanks for signing up! Enjoy our content and lets us know what you think!\"}', '2023-01-28 04:17:21');
INSERT INTO `_bof_notification` (`ID`, `hook`, `def_setting`, `detail`, `detail_params`, `setting`, `texts`, `time_add`) VALUES(4, 'plan_purchased', NULL, 'User purchased a subscription plan', '{\"plan_name\":\"Purchased plan name\",\"plan_period\":\"Purchased period\"}', '{\"methods\":{\"all\":true,\"db\":true,\"push\":true}}', '{\"title\":\"Successfully purchased <b>%plan_name%<\\/b>. Period: <b>%plan_period%<\\/b>\",\"email_title\":\"Successful Purchase\",\"email_content\":\"You have successfully purchased <b>%plan_name%<\\/b>. Period: <b>%plan_period%<\\/b>\"}', '2023-01-28 20:51:40');
INSERT INTO `_bof_notification` (`ID`, `hook`, `def_setting`, `detail`, `detail_params`, `setting`, `texts`, `time_add`) VALUES(5, 'item_purchased', NULL, 'User purchased an item', '{\"item_name\":\"Item\'s name\"}', '{\"methods\":{\"all\":true,\"db\":true,\"push\":true}}', '{\"title\":\"Successfully purchased <b>%item_name%<\\/b>\",\"email_title\":\"Successful Purchase\",\"email_content\":\"You have successfully purchased <b>%item_name%<\\/b>. Thank you\"}', '2023-01-28 21:42:08');
INSERT INTO `_bof_notification` (`ID`, `hook`, `def_setting`, `detail`, `detail_params`, `setting`, `texts`, `time_add`) VALUES(6, 'payment_ok', NULL, 'User had a successful payment & received the fund', '{\"order_id\":\"Order ID\",\"amount\":\"Amount\"}', '{\"methods\":{\"all\":true,\"db\":true,\"push\":true,\"email\":false}}', '{\"title\":\"Successful Payment\",\"content\":\"Your payment <b>#%order_id%<\\/b> was approved and <b>%amount%<\\/b> was added to your wallet\"}', '2023-01-28 21:42:19');
INSERT INTO `_bof_notification` (`ID`, `hook`, `def_setting`, `detail`, `detail_params`, `setting`, `texts`, `time_add`) VALUES(7, 'payment_rejected', NULL, 'User had a payment rejected', '{\"order_id\":\"Order ID\",\"amount\":\"Amount\"}', '{\"methods\":{\"all\":true,\"db\":true,\"push\":true,\"email\":false}}', '{\"title\":\"Payment Rejected\",\"content\":\"Your payment #%order_id% was rejected\"}', '2023-01-28 21:42:39');
INSERT INTO `_bof_notification` (`ID`, `hook`, `def_setting`, `detail`, `detail_params`, `setting`, `texts`, `time_add`) VALUES(8, 'verification_ok', NULL, 'User verification request to become manager was approved', NULL, '{\"methods\":{\"all\":true,\"db\":true,\"email\":false,\"push\":true}}', '{\"title\":\"Request approved\"}', '2023-01-28 21:42:39');
INSERT INTO `_bof_notification` (`ID`, `hook`, `def_setting`, `detail`, `detail_params`, `setting`, `texts`, `time_add`) VALUES(9, 'verification_rejected', NULL, 'User verification request to become manager was rejected', NULL, '{\"methods\":{\"all\":true,\"db\":true,\"push\":true,\"email\":false}}', '{\"title\":\"Request rejected\"}', '2023-01-28 21:42:49');
INSERT INTO `_bof_notification` (`ID`, `hook`, `def_setting`, `detail`, `detail_params`, `setting`, `texts`, `time_add`) VALUES(10, 'item_sold', NULL, 'User had a sale as manager of a creator', '{\"item_name\":\"Item name\",\"amount\":\"Amount\",\"share\":\"Seller\'s share\"}', '{\"methods\":{\"all\":true,\"db\":true,\"push\":true}}', '{\"title\":\"New sale\",\"content\":\"Your item <b>%item_name%<\\/b> was sold for <b>%amount%<\\/b> and your share <b>%share%<\\/b> was added to your wallet\"}', '2023-01-28 21:43:24');
INSERT INTO `_bof_notification` (`ID`, `hook`, `def_setting`, `detail`, `detail_params`, `setting`, `texts`, `time_add`) VALUES(11, 'collabed_in_playlist', NULL, 'User got collabed in another user\'s playlist', '{\"name\":\"Playlist name\",\"user\":\"The user that added you\"}', '{\"methods\":{\"all\":true,\"db\":true,\"push\":true}}', '{\"title\":\"You got collabed!\",\"content\":\"You have been chosen as a collaborator in %name% playlist by %user%!\"}', '2023-01-28 21:44:32');
INSERT INTO `_bof_notification` (`ID`, `hook`, `def_setting`, `detail`, `detail_params`, `setting`, `texts`, `time_add`) VALUES(12, 'creator_update', NULL, 'User\'s subscribed creator has a new release', '{\"creator_name\":\"Creator name\"}', '{\"methods\":{\"all\":true,\"db\":true,\"push\":true,\"email\":false}}', '{\"title\":\"New update from subscribed creator\",\"content\":\"%creator_name% has released new content\"}', '2023-01-28 21:44:51');
INSERT INTO `_bof_notification` (`ID`, `hook`, `def_setting`, `detail`, `detail_params`, `setting`, `texts`, `time_add`) VALUES(13, 'playlist_update', NULL, 'User\'s subscribed playlist ( by adding-to-library or being-a-collaborator or owner ) has been updated by other user', '{\"name\":\"Playlist name\",\"user\":\"The user that updated playlist\"}', '{\"methods\":{\"all\":true,\"db\":true,\"push\":true,\"email\":false}}', '{\"title\":\"<b>%name%<\\/b> playlist has been updated\",\"content\":\"<b>%name%<\\/b> playlist has been updated by %user%. Check it out!\",\"email_title\":\"Playlist update\"}', '2023-04-15 11:59:30');

DROP TABLE IF EXISTS `_bof_plug_logs`;
CREATE TABLE `_bof_plug_logs` (
  `ID` int(11) NOT NULL,
  `process_id` int(9) NOT NULL,
  `code` varchar(20) NOT NULL,
  `text` mediumtext NOT NULL,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

DROP TABLE IF EXISTS `_bof_plug_processes`;
CREATE TABLE `_bof_plug_processes` (
  `ID` int(9) NOT NULL,
  `extension_type` varchar(20) NOT NULL,
  `extension_name` varchar(60) NOT NULL,
  `extension_version` varchar(6) NOT NULL,
  `action` varchar(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `sta` int(11) DEFAULT NULL,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_start` timestamp NULL DEFAULT NULL,
  `time_update` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_finish` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_bof_setting`;
CREATE TABLE `_bof_setting` (
  `var` varchar(100) NOT NULL,
  `val` longtext NOT NULL,
  `type` varchar(10) DEFAULT NULL,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_update` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('_ic', '0', NULL, '2023-03-10 03:15:36', '2023-12-06 02:13:54');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('admin_logo', '29', NULL, '2023-12-06 02:09:12', '2023-12-06 03:34:31');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('ads_audio_c_f', '0.5', NULL, '2023-02-17 10:51:27', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('ads_audio_interval', '1', NULL, '2023-02-15 19:56:58', '2023-04-19 16:45:20');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('ads_audio_v_f', '0.5', NULL, '2023-02-17 10:51:27', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('ads_audio_view_f', '0.13', NULL, '2023-02-15 19:56:58', '2023-02-16 10:07:27');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('ads_banner_c_f', '0.5', NULL, '2023-02-17 10:51:27', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('ads_banner_click_f', '0.08', NULL, '2023-02-15 19:56:58', '2023-02-15 19:57:13');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('ads_banner_v_f', '0.1', NULL, '2023-02-17 10:51:27', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('ads_banner_view_f', '0.01', NULL, '2023-02-15 19:49:14', '2023-02-15 19:51:34');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('ads_google_auto_code', '', NULL, '2023-02-15 19:49:14', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('ads_popup_c_f', '0.5', NULL, '2023-02-17 10:51:27', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('ads_popup_v_f', '1', NULL, '2023-02-17 10:51:27', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('ads_script_v_f', '0.5', NULL, '2023-02-17 10:51:27', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('br_b_post', '', NULL, '2023-12-06 04:56:13', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('br_b_post_setting', '{\"br_b_post_b_category_ids\":true,\"br_b_post_b_tag_ids\":true,\"br_b_post_sorters\":\"title;s_views;s_shares\"}', 'json', '2023-12-06 04:56:13', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('br_m_album', '1', NULL, '2023-02-15 09:58:13', '2023-03-25 14:40:57');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('br_m_album_setting', '{\"br_m_album_type\":true,\"br_m_album_col_artist\":true,\"br_m_album_release_year_range\":true,\"br_m_album_has_price\":true,\"br_m_album_rel_genre\":true,\"br_m_album_rel_tag\":true,\"br_m_album_rel_lang\":true,\"br_m_album_sorters\":\"title;type;spotify_popularity;time_release;s_views;s_likes;s_tracks;s_tracks_duration\"}', 'json', '2023-12-06 04:56:13', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('br_m_artist', '', NULL, '2023-12-06 04:56:13', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('br_m_artist_setting', '{\"br_m_artist_rel_genre\":true,\"br_m_artist_rel_tag\":true,\"br_m_artist_rel_lang\":true,\"br_m_artist_sorters\":\"name;spotify_popularity;spotify_followers;time_release;time_spotify;time_spotify_albums;s_views;s_subscribers;s_albums;s_tracks;s_albums_as_ft;s_tracks_as_ft\"}', 'json', '2023-12-06 04:56:13', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('br_m_track', '1', NULL, '2023-12-06 04:56:13', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('br_m_track_setting', '{\"br_m_track_col_artist\":true,\"br_m_track_col_album\":true,\"br_m_track_release_year_range\":true,\"br_m_track_has_price\":true,\"br_m_track_rel_genre\":true,\"br_m_track_rel_tag\":true,\"br_m_track_rel_lang\":true,\"br_m_track_rel_artist\":true,\"br_m_track_sorters\":\"title;duration;spotify_popularity;s_views;s_plays;s_likes;s_muse_report\"}', 'json', '2023-12-06 04:56:13', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('client_auto_images', '1', NULL, '2023-03-23 13:57:33', '2023-03-23 15:12:50');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('client_give_attr', '1', NULL, '2023-03-23 13:57:33', '2023-03-23 13:57:37');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('client_give_attribute', '', NULL, '2023-03-23 14:11:17', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('client_private', '', NULL, '2023-03-23 13:57:33', '2023-03-23 13:57:37');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('crond', '1', NULL, '2022-12-22 15:07:48', '2023-05-08 07:43:03');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('crond_clean_map', '{\"_bof_ads\":{\"optimize\":1719990481},\"_bof_blacklist\":{\"optimize\":1719990481},\"_bof_cache_stream_royalties\":{\"optimize\":1719990481},\"_bof_cache_db\":{\"optimize\":1719990481,\"truncate\":1719990481},\"_bof_cache_files_access\":{\"optimize\":1719990481,\"truncate\":1719990481},\"_bof_cache_sessions\":{\"optimize\":1719990481},\"_bof_cache_sessions_admin\":{\"optimize\":1719990481},\"_bof_currencies\":{\"optimize\":1719990481},\"_bof_files\":{\"optimize\":1719990481},\"_bof_files_hosts\":{\"optimize\":1719990481},\"_bof_log_api_requests\":{\"optimize\":1719990481,\"truncate\":1719990481},\"_bof_log_api_requests_admin\":{\"optimize\":1719990481,\"truncate\":1719990481},\"_bof_log_cronjob_g\":{\"optimize\":1719990481},\"_bof_log_cronjob_p\":{\"optimize\":1719990481},\"_bof_log_curls\":{\"optimize\":1719990481,\"truncate\":1719990481},\"_bof_log_db\":{\"optimize\":1719990481,\"truncate\":1719990481},\"_bof_log_ips\":{\"optimize\":1719990481,\"truncate\":1719990481},\"_bof_log_requests\":{\"optimize\":1719990481,\"truncate\":1719990481},\"_bof_log_requests_admin\":{\"optimize\":1719990481,\"truncate\":1719990481},\"_bof_plug_logs\":{\"optimize\":1719990481,\"truncate\":1719990481},\"_bof_plug_processes\":{\"optimize\":1719990481,\"truncate\":1719990481},\"_bof_setting\":{\"optimize\":1719990481},\"_d_languages\":{\"optimize\":1719990481},\"_d_languages_items\":{\"optimize\":1719990481},\"_d_menus\":{\"optimize\":1719990481},\"_d_pages\":{\"optimize\":1719990481},\"_d_pages_widgets\":{\"optimize\":1719990481},\"_u_actions\":{\"optimize\":1719990481},\"_u_list\":{\"optimize\":1719990481},\"_u_payments\":{\"optimize\":1719990481},\"_u_playlists\":{\"optimize\":1719990481},\"_u_properties\":{\"optimize\":1719990481},\"_u_relations\":{\"optimize\":1719990481},\"_u_requests\":{\"optimize\":1719990481},\"_u_roles\":{\"optimize\":1719990481},\"_u_subs\":{\"optimize\":1719990481},\"_u_subs_plans\":{\"optimize\":1719990481},\"_u_transactions\":{\"optimize\":1719990481},\"_c_b_categories\":{\"optimize\":1719990481},\"_c_b_posts\":{\"optimize\":1719990481},\"_c_b_posts_relations\":{\"optimize\":1719990481},\"_c_b_tags\":{\"optimize\":1719990481},\"_c_m_tracks_sources\":{\"optimize\":1719990481},\"_c_m_tracks_relations\":{\"optimize\":1719990481},\"_c_m_tracks\":{\"optimize\":1719990481},\"_c_m_tags\":{\"optimize\":1719990481},\"_c_m_langs\":{\"optimize\":1719990481},\"_c_m_genres\":{\"optimize\":1719990481},\"_c_m_events\":{\"optimize\":1719990481},\"_c_m_cronjobs\":{\"optimize\":1719990481},\"_c_m_cronjobs_spotify\":{\"optimize\":1719990481},\"_c_m_artists_relations\":{\"optimize\":1719990481},\"_c_m_artists\":{\"optimize\":1719990481},\"_c_m_albums_relations\":{\"optimize\":1719990481},\"_c_m_albums\":{\"optimize\":1719990481}}', 'json', '2024-07-03 07:08:01', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('crond_db_cleaner', '1', NULL, '2023-04-03 21:53:13', '2023-05-06 21:00:46');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('crond_hd_cleaner', '1', NULL, '2023-04-03 23:45:27', '2023-05-06 21:00:46');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('crond_interval', '1', NULL, '2023-04-03 17:48:26', '2023-05-09 02:24:22');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('crond_royalty_payer', '0', NULL, '2023-04-03 23:45:27', '2023-05-09 02:24:27');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('crond_setting_map', '', 'json', '2023-05-06 21:00:46', '2023-05-09 02:18:18');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('crond_stat', '0', NULL, '2022-12-08 09:28:41', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('crond_times', '', 'json', '2023-05-06 21:19:58', '2024-07-03 07:08:01');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('custom_js', '', NULL, '2023-02-14 11:02:53', '2023-02-14 12:12:29');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('download_available_sources', 'audio_quality_1,audio_quality_2,audio_quality_3,audio_quality_4,audio_quality_5,video_quality_1,video_quality_2,video_quality_3,video_quality_4,video_quality_5', 'imploded', '2022-11-26 09:23:09', '2023-02-15 12:16:14');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('fh_setting', '{\"default\":\"1\"}', 'json', '2021-11-24 15:25:21', '2023-01-20 18:19:15');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('font_name', 'Montserrat', NULL, '2023-02-14 10:08:51', '2023-02-14 10:47:06');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('font_size', '12', NULL, '2023-02-14 10:11:46', '2023-02-14 10:11:59');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('footer_sign', '', NULL, '2023-05-06 01:14:45', '2023-05-06 02:44:44');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('fs_audio_br_min', '64', 'string', '2021-11-24 21:27:39', '2023-03-08 02:17:39');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('fs_audio_fl', 'mp3', 'imploded', '2021-11-24 21:24:26', '2022-11-20 03:19:05');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('fs_audio_size_max', '20', 'string', '2021-11-24 21:23:32', '2023-03-08 02:17:39');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('fs_audio_size_min', '1', 'string', '2021-11-24 21:23:42', '2022-08-28 16:51:28');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('fs_audio_waveform', '', NULL, '2022-11-19 06:46:41', '2023-03-08 02:17:39');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('fs_bgp', '', NULL, '2022-12-10 13:55:02', '2023-05-07 07:12:50');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('fs_chunk', '1', 'raw', '2021-11-24 21:27:59', '2023-04-19 22:29:22');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('fs_chunk_size', '1', 'string', '2021-11-24 21:19:46', '2023-01-20 19:25:34');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('fs_image_dim_max', '2000*1500', 'string', '2021-11-24 23:45:32', '2021-12-06 14:28:14');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('fs_image_dim_min', '100*50', 'string', '2021-11-24 23:45:32', '2022-08-11 18:05:41');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('fs_image_fl', 'jpg,gif,png', 'imploded', '2021-11-24 23:45:32', '2022-01-10 17:59:08');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('fs_image_resize', '1', 'raw', '2021-11-25 15:58:21', '2021-12-12 16:24:20');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('fs_image_size_max', '10', 'string', '2021-11-24 23:45:32', '2021-12-06 14:23:58');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('fs_image_size_min', '0.01', 'string', '2021-11-24 23:45:32', '2021-12-06 14:23:58');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('fs_video_fl', 'mp4', 'imploded', '2022-09-01 23:40:07', '2023-05-09 02:22:40');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('fs_video_size_max', '60', NULL, '2022-09-01 23:40:07', '2022-10-23 11:48:39');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('fs_video_size_min', '1', NULL, '2022-09-01 23:40:07', '2022-09-01 23:40:07');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('fs_video_width_max', '2000', NULL, '2022-09-02 01:05:09', '2022-09-02 01:05:09');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('fs_video_width_min', '100', NULL, '2022-09-01 23:40:07', '2022-09-01 23:40:07');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('gateway_coinpayments', '1', NULL, '2022-01-17 21:48:53', '2022-01-17 21:48:53');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('gateway_kkiapay', '1', NULL, '2022-01-17 21:39:35', '2022-01-17 21:39:35');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('gateway_offline', '1', NULL, '2022-01-17 20:11:58', '2022-01-17 20:12:41');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('gateway_offline_detail', 'Wire %amount% USD to following account then email info@gmail.com\r\nBank name, Location\r\nAccount number 0000-11-22-33\r\nBusyowl DigiMuse Version 2.0 💣💣', NULL, '2022-01-17 20:11:58', '2023-01-31 04:57:00');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('gateway_offline_fee', '5', NULL, '2023-01-29 23:15:33', '2023-01-29 23:15:46');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('gateway_paypal', '', NULL, '2022-01-17 20:15:10', '2023-03-08 02:15:20');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('gateway_paypal_auto', '', NULL, '2023-01-31 02:48:36', '2023-03-08 02:15:20');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('gateway_paypal_fee', '', NULL, '2023-01-31 04:56:05', '2023-03-08 02:15:20');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('gateway_paypal_key', '', NULL, '2022-01-17 20:16:27', '2023-03-08 02:15:20');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('gateway_paypal_mode', 'sandbox', NULL, '2022-01-17 20:15:10', '2022-01-17 20:16:34');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('gateway_paypal_secret', '', NULL, '2022-01-17 20:16:27', '2023-03-08 02:15:20');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('gateway_stripe', '', NULL, '2022-01-17 20:24:02', '2023-03-08 02:15:30');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('gateway_stripe_auto', '', NULL, '2023-01-31 00:14:23', '2023-03-08 02:15:30');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('gateway_stripe_fee', '', NULL, '2023-01-31 00:14:53', '2023-03-08 02:15:30');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('gateway_stripe_key', '', NULL, '2022-01-17 20:24:02', '2023-03-08 02:15:30');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('gateway_stripe_mode', 'sandbox', NULL, '2022-01-17 20:24:02', '2022-01-17 20:24:02');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('gateway_stripe_secret', '', NULL, '2022-01-17 20:24:02', '2023-03-08 02:15:30');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('icon', '30', NULL, '2023-12-06 02:09:12', '2023-12-06 03:34:31');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('logo', '3', NULL, '2023-12-06 02:09:12', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('ma_from', '', NULL, '2023-03-08 02:16:13', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('ma_s_addr', '', NULL, '2022-01-30 06:21:16', '2023-03-08 02:16:13');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('ma_s_encrypt', 'tls', NULL, '2022-01-30 06:21:16', '2022-01-30 06:21:16');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('ma_s_password', '', NULL, '2022-01-30 06:21:16', '2023-03-08 02:16:13');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('ma_s_port', '', NULL, '2022-01-30 06:21:16', '2023-03-08 02:16:13');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('ma_server', 'localhost', NULL, '2022-01-30 06:21:16', '2023-02-28 13:46:09');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('menus_ps', '{\"desk\":\"1\",\"mob\":\"2\",\"footer\":\"4\"}', 'json', '2023-04-17 13:30:51', '2023-05-09 02:24:52');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('mobile_logo', '28', NULL, '2023-12-06 03:34:31', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('ms_s_username', '', NULL, '2022-01-30 06:21:16', '2023-03-08 02:16:13');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('muse_available_sources', 'audio_quality_1,audio_quality_2,audio_quality_3,audio_quality_4,audio_quality_5,video_quality_1,video_quality_2,video_quality_3,video_quality_4,video_quality_5,soundcloud,youtube', 'imploded', '2022-09-03 15:54:38', '2022-09-05 00:41:30');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('offline_download_button', 'onuse', NULL, '2023-02-15 09:57:12', '2023-02-15 11:57:39');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('phu_avatar', '8', NULL, '2023-12-06 02:09:12', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('phu_bg', '9', NULL, '2023-12-06 02:09:12', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('placeholder', '7', NULL, '2023-12-06 02:09:12', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('plugins', 'bof_music', 'imploded', '2021-10-09 07:45:36', '2023-05-04 01:07:28');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('plyr_hide_yt_frame', '', NULL, '2023-04-18 17:21:38', '2023-05-02 06:48:04');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('secondary_logo', '4', NULL, '2023-12-06 02:09:12', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('seo_a_book', '{\"title\":\"Listen to %title% by %writer_name%\"}', 'json', '2023-05-01 21:11:02', '2023-05-01 22:19:34');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('seo_b_post', '{\"title\":\"%title% by @%author_username%\"}', 'json', '2023-05-01 20:49:35', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('seo_m_album', '{\"title\":\"Listen to %type% album: %title% by %artist_name%\"}', 'json', '2023-05-01 21:07:32', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('seo_m_track', '{\"title\":\"Stream %album_title% - %title% by %artist_name%\"}', 'json', '2023-05-01 18:39:41', '2023-05-01 22:19:34');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('seo_p_episode', '{\"title\":\"Stream %show_title% - %title% by %podcaster_name%\"}', 'json', '2023-05-01 21:03:29', '2023-05-01 21:04:23');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('seo_p_podcaster', '{\"title\":\"Listen to %name% podcasts!\"}', 'json', '2023-05-01 22:19:34', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('seo_p_show', '{\"title\":\"Listen to %title% by %podcaster_name%\"}', 'json', '2023-05-01 20:59:31', '2023-05-01 22:19:34');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('seo_ugc_playlist', '{\"title\":\"Listen to %title% by @%owner_username%\"}', 'json', '2023-05-01 20:46:22', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('session_cc', '33', NULL, '2023-03-23 14:22:03', '2023-03-25 22:29:38');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('session_ip_lock', '', NULL, '2022-01-30 03:34:52', '2023-04-07 09:54:39');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('session_life', '', NULL, '2022-01-30 03:34:52', '2023-03-25 22:29:38');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('session_max', '10', NULL, '2022-01-30 03:34:52', '2023-04-07 09:54:43');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('session_pf_lock', '', NULL, '2022-01-30 03:34:52', '2023-05-03 21:01:29');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('shortname', 'rkhmusic', NULL, '2023-02-19 12:17:02', '2023-05-09 01:55:05');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('sitename', 'RKHM', NULL, '2022-01-30 03:22:50', '2023-05-09 01:54:38');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('sl_facebook', '', NULL, '2022-01-30 03:22:50', '2023-05-09 01:55:06');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('sl_instagram', '', NULL, '2023-12-06 03:34:32', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('sl_linkedin', '', NULL, '2023-12-06 03:34:32', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('sl_soundcloud', '', NULL, '2023-12-06 03:34:32', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('sl_spotify', '', NULL, '2023-12-06 03:34:32', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('sl_twitter', '', NULL, '2023-12-06 03:34:32', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('sl_youtube', '', NULL, '2023-12-06 03:34:32', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('spotify_client_key', '', 'string', '2021-10-22 14:40:11', '2023-04-29 22:58:44');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('spotify_token', '', 'string', '2021-11-06 05:38:33', '2023-05-08 23:26:00');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('theme', 'shady', NULL, '2022-04-28 05:35:29', '2023-04-29 17:43:41');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('theme_color', '009ad2', NULL, '2023-02-14 10:20:34', '2023-02-20 12:38:37');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('theme_color_rgb', '0, 154, 210', NULL, '2023-02-14 10:33:33', '2023-02-20 12:38:38');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('title_name', 'DM2', NULL, '2022-06-22 05:53:40', '2022-06-22 05:53:40');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('touch_setting', '{\"tap\":\"visit\",\"doubletap\":\"play\",\"hold\":\"menu\",\"click\":\"visit\",\"rightclick\":\"menu\"}', 'json', '2024-07-03 07:09:41', NULL);
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('upgrade_button', 'never', NULL, '2023-02-15 09:59:27', '2023-02-15 11:42:13');
INSERT INTO `_bof_setting` (`var`, `val`, `type`, `time_add`, `time_update`) VALUES('upload_button', 'onuse', NULL, '2023-02-15 09:58:13', '2023-03-25 14:40:57');

DROP TABLE IF EXISTS `_c_b_categories`;
CREATE TABLE `_c_b_categories` (
  `ID` int(5) NOT NULL,
  `hash` varchar(32) NOT NULL,
  `code` varchar(100) NOT NULL,
  `name` varchar(50) NOT NULL,
  `cover_id` int(7) DEFAULT NULL,
  `bg_id` int(7) DEFAULT NULL,
  `s_views` int(11) NOT NULL DEFAULT 0,
  `s_views_unique` int(9) NOT NULL DEFAULT 0,
  `s_posts` int(6) NOT NULL DEFAULT 0,
  `time_add` timestamp NULL DEFAULT current_timestamp(),
  `translations` longtext DEFAULT NULL CHECK (json_valid(`translations`)),
  `seo_url` varchar(100) NOT NULL,
  `seo_image` int(7) DEFAULT NULL,
  `seo_data` longtext DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_c_b_posts`;
CREATE TABLE `_c_b_posts` (
  `ID` int(11) NOT NULL,
  `hash` varchar(32) NOT NULL,
  `title` tinytext NOT NULL,
  `content` longtext NOT NULL,
  `cover_id` int(7) DEFAULT NULL,
  `bg_id` int(7) DEFAULT NULL,
  `user_id` int(8) NOT NULL,
  `price` float DEFAULT 0,
  `price_setting` longtext DEFAULT NULL CHECK (json_valid(`price_setting`)),
  `st_comment` int(1) DEFAULT 0,
  `s_views` int(11) NOT NULL DEFAULT 0,
  `s_views_unique` int(9) NOT NULL DEFAULT 0,
  `s_shares` int(9) NOT NULL DEFAULT 0,
  `s_categories` int(2) NOT NULL DEFAULT 0,
  `time_edit` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `time_add` timestamp NOT NULL DEFAULT current_timestamp(),
  `translations` longtext DEFAULT NULL CHECK (json_valid(`translations`)),
  `seo_url` varchar(100) NOT NULL,
  `seo_image` int(7) DEFAULT NULL,
  `seo_data` longtext DEFAULT NULL,
  `active` int(1) DEFAULT 1
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_c_b_posts_relations`;
CREATE TABLE `_c_b_posts_relations` (
  `post_id` int(9) NOT NULL,
  `target_id` int(9) NOT NULL,
  `type` varchar(10) NOT NULL,
  `i` int(3) DEFAULT NULL,
  `time_add` timestamp NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_c_b_tags`;
CREATE TABLE `_c_b_tags` (
  `ID` int(5) NOT NULL,
  `hash` varchar(32) NOT NULL,
  `code` varchar(100) NOT NULL,
  `name` varchar(50) NOT NULL,
  `cover_id` int(7) DEFAULT NULL,
  `bg_id` int(7) DEFAULT NULL,
  `s_views` int(11) NOT NULL DEFAULT 0,
  `s_views_unique` int(9) NOT NULL DEFAULT 0,
  `s_posts` int(6) NOT NULL DEFAULT 0,
  `time_add` timestamp NULL DEFAULT current_timestamp(),
  `translations` longtext DEFAULT NULL CHECK (json_valid(`translations`)),
  `seo_url` varchar(100) NOT NULL,
  `seo_image` int(7) DEFAULT NULL,
  `seo_data` longtext DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_c_m_albums`;
CREATE TABLE `_c_m_albums` (
  `ID` int(8) NOT NULL,
  `hash` varchar(32) NOT NULL,
  `code` varchar(150) NOT NULL,
  `title` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `type` varchar(20) NOT NULL,
  `price` float DEFAULT NULL,
  `price_setting` longtext DEFAULT NULL CHECK (json_valid(`price_setting`)),
  `explicit` int(1) DEFAULT 0,
  `description` mediumtext DEFAULT NULL,
  `cover_id` int(7) DEFAULT NULL,
  `bg_id` int(7) DEFAULT NULL,
  `artist_id` int(8) NOT NULL,
  `uploader_id` int(8) DEFAULT NULL,
  `spotify_id` varchar(30) DEFAULT NULL,
  `spotify_cover` text DEFAULT NULL,
  `spotify_popularity` int(3) DEFAULT NULL,
  `s_tracks` int(3) NOT NULL DEFAULT 0,
  `s_tracks_duration` int(6) NOT NULL DEFAULT 0,
  `s_views` int(11) NOT NULL DEFAULT 0,
  `s_views_unique` int(9) NOT NULL DEFAULT 0,
  `s_likes` int(6) NOT NULL DEFAULT 0,
  `s_reposts` int(6) NOT NULL DEFAULT 0,
  `s_comments` int(9) NOT NULL DEFAULT 0,
  `s_sales` int(6) NOT NULL DEFAULT 0,
  `s_shares` int(9) NOT NULL DEFAULT 0,
  `s_popularity` int(3) NOT NULL DEFAULT 0,
  `s_sources_local` int(1) NOT NULL DEFAULT 0,
  `time_play` timestamp NULL DEFAULT NULL,
  `time_spotify` timestamp NULL DEFAULT NULL,
  `time_release` date DEFAULT NULL,
  `time_update` timestamp NULL DEFAULT NULL,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp(),
  `translations` longtext DEFAULT NULL CHECK (json_valid(`translations`)),
  `seo_url` varchar(100) NOT NULL,
  `seo_image` int(7) DEFAULT NULL,
  `seo_data` longtext DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `_c_m_albums` (`ID`, `hash`, `code`, `title`, `type`, `price`, `price_setting`, `explicit`, `description`, `cover_id`, `bg_id`, `artist_id`, `uploader_id`, `spotify_id`, `spotify_cover`, `spotify_popularity`, `s_tracks`, `s_tracks_duration`, `s_views`, `s_views_unique`, `s_likes`, `s_reposts`, `s_comments`, `s_sales`, `s_shares`, `s_popularity`, `s_sources_local`, `time_play`, `time_spotify`, `time_release`, `time_update`, `time_add`, `translations`, `seo_url`, `seo_image`, `seo_data`) VALUES(1, '4a15ea7ec2ee3258d9ba94f947712dae', 'lemonmusicstudio_insideyousingle', 'Inside You', 'single', NULL, NULL, 0, '{\"time\":1701833381,\"blocks\":[{\"type\":\"paragraph\",\"data\":{\"text\":\"https:\\/\\/pixabay.com\\/music\\/acoustic-group-inside-you-162760\\/\"}}],\"version\":\"2.25.0\",\"files\":{\"images\":[],\"videos\":[]},\"html\":\"<div class=\'editorjs_html_wrapper\'><p>https:\\/\\/pixabay.com\\/music\\/acoustic-group-inside-you-162760\\/<\\/p><\\/div>\"}', 20, NULL, 1, 1, NULL, NULL, NULL, 1, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, '2023-12-06', NULL, '2023-12-06 03:29:41', NULL, 'lemonmusicstudio-inside_you', NULL, NULL);
INSERT INTO `_c_m_albums` (`ID`, `hash`, `code`, `title`, `type`, `price`, `price_setting`, `explicit`, `description`, `cover_id`, `bg_id`, `artist_id`, `uploader_id`, `spotify_id`, `spotify_cover`, `spotify_popularity`, `s_tracks`, `s_tracks_duration`, `s_views`, `s_views_unique`, `s_likes`, `s_reposts`, `s_comments`, `s_sales`, `s_shares`, `s_popularity`, `s_sources_local`, `time_play`, `time_spotify`, `time_release`, `time_update`, `time_add`, `translations`, `seo_url`, `seo_image`, `seo_data`) VALUES(2, 'e0788012e747acdf6ecc2f2cc95b3465', 'royaltyfreemusic_deepfuturegaragesingle', 'Deep Future Garage', 'single', NULL, NULL, 0, '{\"time\":1701833384,\"blocks\":[{\"type\":\"paragraph\",\"data\":{\"text\":\"https:\\/\\/pixabay.com\\/music\\/beats-deep-future-garage-royalty-free-music-163081\\/\"}}],\"version\":\"2.25.0\",\"files\":{\"images\":[],\"videos\":[]},\"html\":\"<div class=\'editorjs_html_wrapper\'><p>https:\\/\\/pixabay.com\\/music\\/beats-deep-future-garage-royalty-free-music-163081\\/<\\/p><\\/div>\"}', 21, NULL, 2, 1, NULL, NULL, NULL, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, '2023-12-06', NULL, '2023-12-06 03:29:44', NULL, 'royaltyfreemusic-deep_future_garage', NULL, NULL);
INSERT INTO `_c_m_albums` (`ID`, `hash`, `code`, `title`, `type`, `price`, `price_setting`, `explicit`, `description`, `cover_id`, `bg_id`, `artist_id`, `uploader_id`, `spotify_id`, `spotify_cover`, `spotify_popularity`, `s_tracks`, `s_tracks_duration`, `s_views`, `s_views_unique`, `s_likes`, `s_reposts`, `s_comments`, `s_sales`, `s_shares`, `s_popularity`, `s_sources_local`, `time_play`, `time_spotify`, `time_release`, `time_update`, `time_add`, `translations`, `seo_url`, `seo_image`, `seo_data`) VALUES(3, '7cb56d08f9b19067c04780008da20491', 'leonellcassio_leonellcassiotheparanormalisrealsingle', 'Leonell Cassio - The Paranormal Is Real', 'single', NULL, NULL, 0, '{\"time\":1701833416,\"blocks\":[{\"type\":\"paragraph\",\"data\":{\"text\":\"https:\\/\\/pixabay.com\\/music\\/future-bass-leonell-cassio-the-paranormal-is-real-ft-carrie-163742\\/\"}}],\"version\":\"2.25.0\",\"files\":{\"images\":[],\"videos\":[]},\"html\":\"<div class=\'editorjs_html_wrapper\'><p>https:\\/\\/pixabay.com\\/music\\/future-bass-leonell-cassio-the-paranormal-is-real-ft-carrie-163742\\/<\\/p><\\/div>\"}', 25, NULL, 3, 1, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, '2023-12-06', NULL, '2023-12-06 03:30:16', NULL, 'leonell_cassio-leonell_cassio_-_the_paranormal_is_real', NULL, NULL);
INSERT INTO `_c_m_albums` (`ID`, `hash`, `code`, `title`, `type`, `price`, `price_setting`, `explicit`, `description`, `cover_id`, `bg_id`, `artist_id`, `uploader_id`, `spotify_id`, `spotify_cover`, `spotify_popularity`, `s_tracks`, `s_tracks_duration`, `s_views`, `s_views_unique`, `s_likes`, `s_reposts`, `s_comments`, `s_sales`, `s_shares`, `s_popularity`, `s_sources_local`, `time_play`, `time_spotify`, `time_release`, `time_update`, `time_add`, `translations`, `seo_url`, `seo_image`, `seo_data`) VALUES(4, '4ce9dfd39651de3a6ea45cf10c30bb1f', 'sergepavkinmusic_alongwaysingle', 'A Long Way', 'single', NULL, NULL, 0, '{\"time\":1701833434,\"blocks\":[{\"type\":\"paragraph\",\"data\":{\"text\":\"https:\\/\\/pixabay.com\\/music\\/build-up-scenes-a-long-way-166385\\/\"}}],\"version\":\"2.25.0\",\"files\":{\"images\":[],\"videos\":[]},\"html\":\"<div class=\'editorjs_html_wrapper\'><p>https:\\/\\/pixabay.com\\/music\\/build-up-scenes-a-long-way-166385\\/<\\/p><\\/div>\"}', 23, NULL, 4, 1, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, '2023-12-06', NULL, '2023-12-06 03:30:34', NULL, 'sergepavkinmusic-a_long_way', NULL, NULL);
INSERT INTO `_c_m_albums` (`ID`, `hash`, `code`, `title`, `type`, `price`, `price_setting`, `explicit`, `description`, `cover_id`, `bg_id`, `artist_id`, `uploader_id`, `spotify_id`, `spotify_cover`, `spotify_popularity`, `s_tracks`, `s_tracks_duration`, `s_views`, `s_views_unique`, `s_likes`, `s_reposts`, `s_comments`, `s_sales`, `s_shares`, `s_popularity`, `s_sources_local`, `time_play`, `time_spotify`, `time_release`, `time_update`, `time_add`, `translations`, `seo_url`, `seo_image`, `seo_data`) VALUES(5, 'dcfb252a7ca4a53b69c3aff64d29dba2', 'paoloargento_thebestjazzclubinneworleanssingle', 'The Best Jazz Club In New Orleans', 'single', NULL, NULL, 0, '{\"time\":1701833452,\"blocks\":[{\"type\":\"paragraph\",\"data\":{\"text\":\"https:\\/\\/pixabay.com\\/music\\/traditional-jazz-the-best-jazz-club-in-new-orleans-164472\\/\"}}],\"version\":\"2.25.0\",\"files\":{\"images\":[],\"videos\":[]},\"html\":\"<div class=\'editorjs_html_wrapper\'><p>https:\\/\\/pixabay.com\\/music\\/traditional-jazz-the-best-jazz-club-in-new-orleans-164472\\/<\\/p><\\/div>\"}', 24, NULL, 5, 1, NULL, NULL, NULL, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, '2023-12-06', NULL, '2023-12-06 03:30:52', NULL, 'paoloargento-the_best_jazz_club_in_new_orleans', NULL, NULL);
INSERT INTO `_c_m_albums` (`ID`, `hash`, `code`, `title`, `type`, `price`, `price_setting`, `explicit`, `description`, `cover_id`, `bg_id`, `artist_id`, `uploader_id`, `spotify_id`, `spotify_cover`, `spotify_popularity`, `s_tracks`, `s_tracks_duration`, `s_views`, `s_views_unique`, `s_likes`, `s_reposts`, `s_comments`, `s_sales`, `s_shares`, `s_popularity`, `s_sources_local`, `time_play`, `time_spotify`, `time_release`, `time_update`, `time_add`, `translations`, `seo_url`, `seo_image`, `seo_data`) VALUES(6, '1bd0c45cd3dbed229a4920c4920686b7', 'royaltyfreemusic_trapfuturebasssingle', 'Trap Future Bass', 'single', NULL, NULL, 0, '{\"time\":1701833476,\"blocks\":[{\"type\":\"paragraph\",\"data\":{\"text\":\"https:\\/\\/pixabay.com\\/music\\/future-bass-trap-future-bass-royalty-free-music-167020\\/\"}}],\"version\":\"2.25.0\",\"files\":{\"images\":[],\"videos\":[]},\"html\":\"<div class=\'editorjs_html_wrapper\'><p>https:\\/\\/pixabay.com\\/music\\/future-bass-trap-future-bass-royalty-free-music-167020\\/<\\/p><\\/div>\"}', 26, NULL, 2, 1, NULL, NULL, NULL, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, '2023-12-06', NULL, '2023-12-06 03:31:16', NULL, 'royaltyfreemusic-trap_future_bass', NULL, NULL);
INSERT INTO `_c_m_albums` (`ID`, `hash`, `code`, `title`, `type`, `price`, `price_setting`, `explicit`, `description`, `cover_id`, `bg_id`, `artist_id`, `uploader_id`, `spotify_id`, `spotify_cover`, `spotify_popularity`, `s_tracks`, `s_tracks_duration`, `s_views`, `s_views_unique`, `s_likes`, `s_reposts`, `s_comments`, `s_sales`, `s_shares`, `s_popularity`, `s_sources_local`, `time_play`, `time_spotify`, `time_release`, `time_update`, `time_add`, `translations`, `seo_url`, `seo_image`, `seo_data`) VALUES(7, '4054111bcbed33898001c00dbe53b591', 'comamedia_glossysingle', 'Glossy', 'single', NULL, NULL, 0, '{\"time\":1701833494,\"blocks\":[{\"type\":\"paragraph\",\"data\":{\"text\":\"https:\\/\\/pixabay.com\\/music\\/beats-glossy-168156\\/\"}}],\"version\":\"2.25.0\",\"files\":{\"images\":[],\"videos\":[]},\"html\":\"<div class=\'editorjs_html_wrapper\'><p>https:\\/\\/pixabay.com\\/music\\/beats-glossy-168156\\/<\\/p><\\/div>\"}', 27, NULL, 6, 1, NULL, NULL, NULL, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, '2023-12-06', NULL, '2023-12-06 03:31:34', NULL, 'coma-media-glossy', NULL, NULL);

DROP TABLE IF EXISTS `_c_m_albums_relations`;
CREATE TABLE `_c_m_albums_relations` (
  `album_id` int(9) NOT NULL,
  `target_id` int(9) NOT NULL,
  `type` varchar(10) NOT NULL,
  `i` int(6) DEFAULT NULL,
  `time_add` timestamp NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `_c_m_albums_relations` (`album_id`, `target_id`, `type`, `i`, `time_add`) VALUES(1, 1, 'genre', 0, '2023-12-06 03:29:41');
INSERT INTO `_c_m_albums_relations` (`album_id`, `target_id`, `type`, `i`, `time_add`) VALUES(1, 1, 'tag', 0, '2023-12-06 03:29:41');
INSERT INTO `_c_m_albums_relations` (`album_id`, `target_id`, `type`, `i`, `time_add`) VALUES(2, 1, 'genre', 0, '2023-12-06 03:29:44');
INSERT INTO `_c_m_albums_relations` (`album_id`, `target_id`, `type`, `i`, `time_add`) VALUES(2, 1, 'tag', 0, '2023-12-06 03:29:44');
INSERT INTO `_c_m_albums_relations` (`album_id`, `target_id`, `type`, `i`, `time_add`) VALUES(3, 1, 'genre', 0, '2023-12-06 03:30:16');
INSERT INTO `_c_m_albums_relations` (`album_id`, `target_id`, `type`, `i`, `time_add`) VALUES(3, 1, 'tag', 0, '2023-12-06 03:30:16');
INSERT INTO `_c_m_albums_relations` (`album_id`, `target_id`, `type`, `i`, `time_add`) VALUES(4, 1, 'genre', 0, '2023-12-06 03:30:34');
INSERT INTO `_c_m_albums_relations` (`album_id`, `target_id`, `type`, `i`, `time_add`) VALUES(4, 1, 'tag', 0, '2023-12-06 03:30:34');
INSERT INTO `_c_m_albums_relations` (`album_id`, `target_id`, `type`, `i`, `time_add`) VALUES(5, 1, 'genre', 0, '2023-12-06 03:30:52');
INSERT INTO `_c_m_albums_relations` (`album_id`, `target_id`, `type`, `i`, `time_add`) VALUES(5, 1, 'tag', 0, '2023-12-06 03:30:52');
INSERT INTO `_c_m_albums_relations` (`album_id`, `target_id`, `type`, `i`, `time_add`) VALUES(6, 1, 'genre', 0, '2023-12-06 03:31:16');
INSERT INTO `_c_m_albums_relations` (`album_id`, `target_id`, `type`, `i`, `time_add`) VALUES(6, 1, 'tag', 0, '2023-12-06 03:31:16');
INSERT INTO `_c_m_albums_relations` (`album_id`, `target_id`, `type`, `i`, `time_add`) VALUES(7, 1, 'genre', 0, '2023-12-06 03:31:34');
INSERT INTO `_c_m_albums_relations` (`album_id`, `target_id`, `type`, `i`, `time_add`) VALUES(7, 1, 'tag', 0, '2023-12-06 03:31:34');

DROP TABLE IF EXISTS `_c_m_artists`;
CREATE TABLE `_c_m_artists` (
  `ID` int(9) NOT NULL,
  `hash` varchar(32) NOT NULL,
  `code` varchar(150) NOT NULL,
  `name` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cover_id` int(7) DEFAULT NULL,
  `bg_id` int(7) DEFAULT NULL,
  `manager_id` int(9) DEFAULT NULL,
  `spotify_id` varchar(36) DEFAULT NULL,
  `spotify_cover` text DEFAULT NULL,
  `spotify_popularity` int(3) DEFAULT NULL,
  `spotify_followers` bigint(20) DEFAULT NULL,
  `bio_name` varchar(200) DEFAULT NULL,
  `bio_country` varchar(100) DEFAULT NULL,
  `bio_city` varchar(100) DEFAULT NULL,
  `bio_content` longtext DEFAULT NULL,
  `bio_birthday` datetime DEFAULT NULL,
  `bio_deathday` datetime DEFAULT NULL,
  `external_addresses` text DEFAULT NULL,
  `s_albums` int(4) NOT NULL DEFAULT 0,
  `s_subscribers` int(7) NOT NULL DEFAULT 0,
  `s_tracks` int(5) NOT NULL DEFAULT 0,
  `s_tracks_as_ft` int(5) NOT NULL DEFAULT 0,
  `s_albums_as_ft` int(4) NOT NULL DEFAULT 0,
  `s_views` int(11) NOT NULL DEFAULT 0,
  `s_views_unique` int(9) NOT NULL DEFAULT 0,
  `s_popularity` int(3) NOT NULL DEFAULT 0,
  `s_managed` int(1) DEFAULT 0,
  `time_play` timestamp NULL DEFAULT NULL,
  `time_release` datetime DEFAULT NULL,
  `time_spotify` timestamp NULL DEFAULT NULL,
  `time_spotify_related` timestamp NULL DEFAULT NULL,
  `time_spotify_albums` timestamp NULL DEFAULT NULL,
  `time_spotify_discography` timestamp NULL DEFAULT NULL,
  `time_spotify_tracks` timestamp NULL DEFAULT NULL,
  `time_add` timestamp NULL DEFAULT current_timestamp(),
  `translations` longtext DEFAULT NULL CHECK (json_valid(`translations`)),
  `seo_url` varchar(100) NOT NULL,
  `seo_image` int(7) DEFAULT NULL,
  `seo_data` longtext DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `_c_m_artists` (`ID`, `hash`, `code`, `name`, `cover_id`, `bg_id`, `manager_id`, `spotify_id`, `spotify_cover`, `spotify_popularity`, `spotify_followers`, `bio_name`, `bio_country`, `bio_city`, `bio_content`, `bio_birthday`, `bio_deathday`, `external_addresses`, `s_albums`, `s_subscribers`, `s_tracks`, `s_tracks_as_ft`, `s_albums_as_ft`, `s_views`, `s_views_unique`, `s_popularity`, `s_managed`, `time_play`, `time_release`, `time_spotify`, `time_spotify_related`, `time_spotify_albums`, `time_spotify_discography`, `time_spotify_tracks`, `time_add`, `translations`, `seo_url`, `seo_image`, `seo_data`) VALUES(1, 'f412879d8dfdff8eb543913af489e52e', 'lemonmusicstudio', 'lemonmusicstudio', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 1, 0, 0, 1, 1, 0, 0, NULL, '2023-12-06 00:00:00', NULL, NULL, NULL, NULL, NULL, '2023-12-06 03:29:41', NULL, 'lemonmusicstudio', NULL, NULL);
INSERT INTO `_c_m_artists` (`ID`, `hash`, `code`, `name`, `cover_id`, `bg_id`, `manager_id`, `spotify_id`, `spotify_cover`, `spotify_popularity`, `spotify_followers`, `bio_name`, `bio_country`, `bio_city`, `bio_content`, `bio_birthday`, `bio_deathday`, `external_addresses`, `s_albums`, `s_subscribers`, `s_tracks`, `s_tracks_as_ft`, `s_albums_as_ft`, `s_views`, `s_views_unique`, `s_popularity`, `s_managed`, `time_play`, `time_release`, `time_spotify`, `time_spotify_related`, `time_spotify_albums`, `time_spotify_discography`, `time_spotify_tracks`, `time_add`, `translations`, `seo_url`, `seo_image`, `seo_data`) VALUES(2, '22535d84f44c071564d6b9e327d80768', 'royaltyfreemusic', 'RoyaltyFreeMusic', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, 0, 2, 0, 0, 2, 0, 0, 0, NULL, '2023-12-06 00:00:00', NULL, NULL, NULL, NULL, NULL, '2023-12-06 03:29:44', NULL, 'royaltyfreemusic', NULL, NULL);
INSERT INTO `_c_m_artists` (`ID`, `hash`, `code`, `name`, `cover_id`, `bg_id`, `manager_id`, `spotify_id`, `spotify_cover`, `spotify_popularity`, `spotify_followers`, `bio_name`, `bio_country`, `bio_city`, `bio_content`, `bio_birthday`, `bio_deathday`, `external_addresses`, `s_albums`, `s_subscribers`, `s_tracks`, `s_tracks_as_ft`, `s_albums_as_ft`, `s_views`, `s_views_unique`, `s_popularity`, `s_managed`, `time_play`, `time_release`, `time_spotify`, `time_spotify_related`, `time_spotify_albums`, `time_spotify_discography`, `time_spotify_tracks`, `time_add`, `translations`, `seo_url`, `seo_image`, `seo_data`) VALUES(3, 'b152dc1092e0bd62519d82224dba6bab', 'leonellcassio', 'Leonell Cassio', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 1, 0, 0, 0, 0, 0, 0, NULL, '2023-12-06 00:00:00', NULL, NULL, NULL, NULL, NULL, '2023-12-06 03:30:16', NULL, 'leonell_cassio', NULL, NULL);
INSERT INTO `_c_m_artists` (`ID`, `hash`, `code`, `name`, `cover_id`, `bg_id`, `manager_id`, `spotify_id`, `spotify_cover`, `spotify_popularity`, `spotify_followers`, `bio_name`, `bio_country`, `bio_city`, `bio_content`, `bio_birthday`, `bio_deathday`, `external_addresses`, `s_albums`, `s_subscribers`, `s_tracks`, `s_tracks_as_ft`, `s_albums_as_ft`, `s_views`, `s_views_unique`, `s_popularity`, `s_managed`, `time_play`, `time_release`, `time_spotify`, `time_spotify_related`, `time_spotify_albums`, `time_spotify_discography`, `time_spotify_tracks`, `time_add`, `translations`, `seo_url`, `seo_image`, `seo_data`) VALUES(4, 'a14c1d5f8ec10a6cfa42cd52910de964', 'sergepavkinmusic', 'SergePavkinMusic', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 1, 0, 0, 0, 0, 0, 0, NULL, '2023-12-06 00:00:00', NULL, NULL, NULL, NULL, NULL, '2023-12-06 03:30:34', NULL, 'sergepavkinmusic', NULL, NULL);
INSERT INTO `_c_m_artists` (`ID`, `hash`, `code`, `name`, `cover_id`, `bg_id`, `manager_id`, `spotify_id`, `spotify_cover`, `spotify_popularity`, `spotify_followers`, `bio_name`, `bio_country`, `bio_city`, `bio_content`, `bio_birthday`, `bio_deathday`, `external_addresses`, `s_albums`, `s_subscribers`, `s_tracks`, `s_tracks_as_ft`, `s_albums_as_ft`, `s_views`, `s_views_unique`, `s_popularity`, `s_managed`, `time_play`, `time_release`, `time_spotify`, `time_spotify_related`, `time_spotify_albums`, `time_spotify_discography`, `time_spotify_tracks`, `time_add`, `translations`, `seo_url`, `seo_image`, `seo_data`) VALUES(5, 'fbff6bab599f34d0d9fe87d32ef975a5', 'paoloargento', 'PaoloArgento', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 1, 0, 0, 0, 0, 0, 0, NULL, '2023-12-06 00:00:00', NULL, NULL, NULL, NULL, NULL, '2023-12-06 03:30:52', NULL, 'paoloargento', NULL, NULL);
INSERT INTO `_c_m_artists` (`ID`, `hash`, `code`, `name`, `cover_id`, `bg_id`, `manager_id`, `spotify_id`, `spotify_cover`, `spotify_popularity`, `spotify_followers`, `bio_name`, `bio_country`, `bio_city`, `bio_content`, `bio_birthday`, `bio_deathday`, `external_addresses`, `s_albums`, `s_subscribers`, `s_tracks`, `s_tracks_as_ft`, `s_albums_as_ft`, `s_views`, `s_views_unique`, `s_popularity`, `s_managed`, `time_play`, `time_release`, `time_spotify`, `time_spotify_related`, `time_spotify_albums`, `time_spotify_discography`, `time_spotify_tracks`, `time_add`, `translations`, `seo_url`, `seo_image`, `seo_data`) VALUES(6, '794375cfc57960d895d06cf31034bb9e', 'comamedia', 'Coma-Media', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 1, 0, 0, 0, 0, 0, 0, NULL, '2023-12-06 00:00:00', NULL, NULL, NULL, NULL, NULL, '2023-12-06 03:31:34', NULL, 'coma-media', NULL, NULL);

DROP TABLE IF EXISTS `_c_m_artists_relations`;
CREATE TABLE `_c_m_artists_relations` (
  `artist_id` int(9) NOT NULL,
  `target_id` int(9) NOT NULL,
  `type` varchar(10) NOT NULL,
  `i` int(3) DEFAULT NULL,
  `time_add` timestamp NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_c_m_cronjobs`;
CREATE TABLE `_c_m_cronjobs` (
  `ID` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `comment` tinytext DEFAULT NULL,
  `update_interval` float NOT NULL,
  `execution_interval` int(11) NOT NULL DEFAULT 1,
  `item_limit` int(4) NOT NULL DEFAULT 10,
  `dynamic` tinyint(1) NOT NULL DEFAULT 0,
  `object_type` varchar(20) NOT NULL,
  `object_filters` text DEFAULT NULL,
  `api_name` varchar(20) NOT NULL,
  `api_ids` text DEFAULT NULL,
  `cache` mediumtext DEFAULT NULL,
  `data` longtext DEFAULT NULL,
  `time_update` timestamp NULL DEFAULT NULL,
  `time_add` timestamp NULL DEFAULT current_timestamp(),
  `active` int(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_c_m_cronjobs_spotify`;
CREATE TABLE `_c_m_cronjobs_spotify` (
  `cron_id` int(5) NOT NULL,
  `spotify_id` varchar(22) NOT NULL,
  `local_id` int(8) DEFAULT NULL,
  `time_check` timestamp NULL DEFAULT NULL,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_c_m_events`;
CREATE TABLE `_c_m_events` (
  `ID` int(11) NOT NULL,
  `hash` varchar(32) NOT NULL,
  `name` varchar(300) NOT NULL,
  `cover_id` int(11) DEFAULT NULL,
  `manager_id` int(11) NOT NULL,
  `price` float DEFAULT NULL,
  `maximum` int(6) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `website` tinytext DEFAULT NULL,
  `s_views` int(11) NOT NULL DEFAULT 0,
  `s_views_unique` int(11) NOT NULL DEFAULT 0,
  `s_sales` int(11) NOT NULL DEFAULT 0,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp(),
  `seo_url` varchar(100) NOT NULL,
  `seo_image` int(11) DEFAULT NULL,
  `seo_data` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_c_m_genres`;
CREATE TABLE `_c_m_genres` (
  `ID` int(5) NOT NULL,
  `hash` varchar(32) NOT NULL,
  `code` varchar(100) NOT NULL,
  `parent_id` int(5) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `cover_id` int(7) DEFAULT NULL,
  `bg_id` int(7) DEFAULT NULL,
  `s_views` int(11) NOT NULL DEFAULT 0,
  `s_views_unique` int(9) NOT NULL DEFAULT 0,
  `s_tracks` int(11) NOT NULL DEFAULT 0,
  `s_albums` int(9) NOT NULL DEFAULT 0,
  `s_artists` int(9) NOT NULL DEFAULT 0,
  `s_childs` int(5) NOT NULL DEFAULT 0,
  `time_add` timestamp NULL DEFAULT current_timestamp(),
  `translations` longtext DEFAULT NULL CHECK (json_valid(`translations`)),
  `seo_url` varchar(100) NOT NULL,
  `seo_image` int(7) DEFAULT NULL,
  `seo_data` longtext DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `_c_m_genres` (`ID`, `hash`, `code`, `parent_id`, `name`, `cover_id`, `bg_id`, `s_views`, `s_views_unique`, `s_tracks`, `s_albums`, `s_artists`, `s_childs`, `time_add`, `translations`, `seo_url`, `seo_image`, `seo_data`) VALUES(1, '1bdc792790e17c84dd9e2e19685452ba', 'royaltyfree', 0, 'Royalty free', 0, 0, 3, 0, 7, 7, 0, 0, '2023-12-06 03:28:40', '[]', 'royalty-free', 0, '[]');

DROP TABLE IF EXISTS `_c_m_genres_hiearchy`;
CREATE TABLE `_c_m_genres_hiearchy` (
  `genre_id` int(5) NOT NULL,
  `hook_id` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `_c_m_genres_hiearchy` (`genre_id`, `hook_id`) VALUES(1, 1);

DROP TABLE IF EXISTS `_c_m_langs`;
CREATE TABLE `_c_m_langs` (
  `ID` int(5) NOT NULL,
  `hash` varchar(32) NOT NULL,
  `code` varchar(100) NOT NULL,
  `name` varchar(50) NOT NULL,
  `cover_id` int(7) DEFAULT NULL,
  `bg_id` int(7) DEFAULT NULL,
  `s_views` int(11) NOT NULL DEFAULT 0,
  `s_views_unique` int(9) NOT NULL DEFAULT 0,
  `s_tracks` int(11) NOT NULL DEFAULT 0,
  `s_albums` int(9) NOT NULL DEFAULT 0,
  `s_artists` int(9) NOT NULL DEFAULT 0,
  `time_add` timestamp NULL DEFAULT current_timestamp(),
  `translations` longtext DEFAULT NULL CHECK (json_valid(`translations`)),
  `seo_url` varchar(100) NOT NULL,
  `seo_image` int(7) DEFAULT NULL,
  `seo_data` longtext DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_c_m_tags`;
CREATE TABLE `_c_m_tags` (
  `ID` int(5) NOT NULL,
  `hash` varchar(32) NOT NULL,
  `code` varchar(100) NOT NULL,
  `name` varchar(50) NOT NULL,
  `cover_id` int(7) DEFAULT NULL,
  `bg_id` int(7) DEFAULT NULL,
  `s_views` int(11) NOT NULL DEFAULT 0,
  `s_views_unique` int(9) NOT NULL DEFAULT 0,
  `s_tracks` int(11) NOT NULL DEFAULT 0,
  `s_albums` int(9) NOT NULL DEFAULT 0,
  `s_artists` int(9) NOT NULL DEFAULT 0,
  `time_add` timestamp NULL DEFAULT current_timestamp(),
  `translations` longtext DEFAULT NULL CHECK (json_valid(`translations`)),
  `seo_url` varchar(100) NOT NULL,
  `seo_image` int(7) DEFAULT NULL,
  `seo_data` longtext DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `_c_m_tags` (`ID`, `hash`, `code`, `name`, `cover_id`, `bg_id`, `s_views`, `s_views_unique`, `s_tracks`, `s_albums`, `s_artists`, `time_add`, `translations`, `seo_url`, `seo_image`, `seo_data`) VALUES(1, '44db166911bff402068e6c87172382f7', 'pixabay', 'pixabay', 0, 0, 0, 0, 7, 7, 0, '2023-12-06 03:28:28', '[]', 'pixabay', 0, '[]');

DROP TABLE IF EXISTS `_c_m_tracks`;
CREATE TABLE `_c_m_tracks` (
  `ID` int(9) NOT NULL,
  `hash` varchar(32) NOT NULL,
  `code` varchar(150) NOT NULL,
  `title` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `duration` int(4) DEFAULT NULL,
  `price` float DEFAULT 0,
  `price_setting` longtext DEFAULT NULL CHECK (json_valid(`price_setting`)),
  `explicit` int(1) NOT NULL DEFAULT 0,
  `cover_id` int(7) DEFAULT NULL,
  `bg_id` int(7) DEFAULT NULL,
  `artist_id` int(8) NOT NULL,
  `album_id` int(8) NOT NULL,
  `album_index` int(3) DEFAULT NULL,
  `album_cd` int(2) DEFAULT NULL,
  `album_artist_id` int(8) DEFAULT NULL,
  `album_price` float DEFAULT NULL,
  `uploader_id` int(8) DEFAULT NULL,
  `spotify_id` varchar(36) DEFAULT NULL,
  `spotify_cover` text DEFAULT NULL,
  `spotify_popularity` int(3) DEFAULT NULL,
  `musixmatch_id` int(11) DEFAULT NULL,
  `description` mediumtext DEFAULT NULL,
  `lyrics` longtext DEFAULT NULL,
  `s_views` int(11) NOT NULL DEFAULT 0,
  `s_views_unique` int(9) NOT NULL DEFAULT 0,
  `s_plays` int(11) NOT NULL DEFAULT 0,
  `s_plays_unique` int(9) NOT NULL DEFAULT 0,
  `s_likes` int(6) NOT NULL DEFAULT 0,
  `s_reposts` int(9) NOT NULL DEFAULT 0,
  `s_downloads` int(9) NOT NULL DEFAULT 0,
  `s_downloads_unique` int(9) NOT NULL DEFAULT 0,
  `s_comments` int(9) NOT NULL DEFAULT 0,
  `s_playlists` int(6) NOT NULL DEFAULT 0,
  `s_sales` int(6) NOT NULL DEFAULT 0,
  `s_shares` int(9) NOT NULL DEFAULT 0,
  `s_popularity` int(3) NOT NULL DEFAULT 0,
  `s_sources` int(2) NOT NULL DEFAULT 0,
  `s_sources_local` int(1) NOT NULL DEFAULT 0,
  `s_muse_report` int(6) DEFAULT 0,
  `time_play` timestamp NULL DEFAULT NULL,
  `time_release` datetime DEFAULT NULL,
  `time_spotify` timestamp NULL DEFAULT NULL,
  `time_musixmatch` timestamp NULL DEFAULT NULL,
  `time_update` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `time_add` timestamp NULL DEFAULT current_timestamp(),
  `translations` longtext DEFAULT NULL CHECK (json_valid(`translations`)),
  `seo_url` varchar(100) NOT NULL,
  `seo_image` int(7) DEFAULT NULL,
  `seo_data` longtext DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `_c_m_tracks` (`ID`, `hash`, `code`, `title`, `duration`, `price`, `price_setting`, `explicit`, `cover_id`, `bg_id`, `artist_id`, `album_id`, `album_index`, `album_cd`, `album_artist_id`, `album_price`, `uploader_id`, `spotify_id`, `spotify_cover`, `spotify_popularity`, `musixmatch_id`, `description`, `lyrics`, `s_views`, `s_views_unique`, `s_plays`, `s_plays_unique`, `s_likes`, `s_reposts`, `s_downloads`, `s_downloads_unique`, `s_comments`, `s_playlists`, `s_sales`, `s_shares`, `s_popularity`, `s_sources`, `s_sources_local`, `s_muse_report`, `time_play`, `time_release`, `time_spotify`, `time_musixmatch`, `time_update`, `time_add`, `translations`, `seo_url`, `seo_image`, `seo_data`) VALUES(1, 'de9d4ccf7403986cf48e59c480546bbd', 'lemonmusicstudio_insideyou_insideyou', 'Inside You', 130, 0, '{\"disable_parent\":false}', 0, 20, NULL, 1, 1, NULL, NULL, 1, NULL, 1, NULL, NULL, NULL, NULL, '{\"time\":1701833381,\"blocks\":[{\"type\":\"paragraph\",\"data\":{\"text\":\"https:\\/\\/pixabay.com\\/music\\/acoustic-group-inside-you-162760\\/\"}}],\"version\":\"2.25.0\",\"files\":{\"images\":[],\"videos\":[]},\"html\":\"<div class=\'editorjs_html_wrapper\'><p>https:\\/\\/pixabay.com\\/music\\/acoustic-group-inside-you-162760\\/<\\/p><\\/div>\"}', NULL, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, '2023-12-06 00:00:00', NULL, NULL, '2023-12-06 04:56:40', '2023-12-06 03:29:41', NULL, 'lemonmusicstudio-inside_you-inside_you', NULL, NULL);
INSERT INTO `_c_m_tracks` (`ID`, `hash`, `code`, `title`, `duration`, `price`, `price_setting`, `explicit`, `cover_id`, `bg_id`, `artist_id`, `album_id`, `album_index`, `album_cd`, `album_artist_id`, `album_price`, `uploader_id`, `spotify_id`, `spotify_cover`, `spotify_popularity`, `musixmatch_id`, `description`, `lyrics`, `s_views`, `s_views_unique`, `s_plays`, `s_plays_unique`, `s_likes`, `s_reposts`, `s_downloads`, `s_downloads_unique`, `s_comments`, `s_playlists`, `s_sales`, `s_shares`, `s_popularity`, `s_sources`, `s_sources_local`, `s_muse_report`, `time_play`, `time_release`, `time_spotify`, `time_musixmatch`, `time_update`, `time_add`, `translations`, `seo_url`, `seo_image`, `seo_data`) VALUES(2, '06350e057386433b0b2b16329aa91773', 'royaltyfreemusic_deepfuturegarage_deepfuturegarage', 'Deep Future Garage', 126, 0, '{\"disable_parent\":false}', 0, 21, NULL, 2, 2, NULL, NULL, 2, NULL, 1, NULL, NULL, NULL, NULL, '{\"time\":1701833384,\"blocks\":[{\"type\":\"paragraph\",\"data\":{\"text\":\"https:\\/\\/pixabay.com\\/music\\/beats-deep-future-garage-royalty-free-music-163081\\/\"}}],\"version\":\"2.25.0\",\"files\":{\"images\":[],\"videos\":[]},\"html\":\"<div class=\'editorjs_html_wrapper\'><p>https:\\/\\/pixabay.com\\/music\\/beats-deep-future-garage-royalty-free-music-163081\\/<\\/p><\\/div>\"}', NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, '2023-12-06 00:00:00', NULL, NULL, NULL, '2023-12-06 03:29:44', NULL, 'royaltyfreemusic-deep_future_garage-deep_future_garage', NULL, NULL);
INSERT INTO `_c_m_tracks` (`ID`, `hash`, `code`, `title`, `duration`, `price`, `price_setting`, `explicit`, `cover_id`, `bg_id`, `artist_id`, `album_id`, `album_index`, `album_cd`, `album_artist_id`, `album_price`, `uploader_id`, `spotify_id`, `spotify_cover`, `spotify_popularity`, `musixmatch_id`, `description`, `lyrics`, `s_views`, `s_views_unique`, `s_plays`, `s_plays_unique`, `s_likes`, `s_reposts`, `s_downloads`, `s_downloads_unique`, `s_comments`, `s_playlists`, `s_sales`, `s_shares`, `s_popularity`, `s_sources`, `s_sources_local`, `s_muse_report`, `time_play`, `time_release`, `time_spotify`, `time_musixmatch`, `time_update`, `time_add`, `translations`, `seo_url`, `seo_image`, `seo_data`) VALUES(3, 'cd4f3feb80ce026e47cf881501807ef8', 'leonellcassio_leonellcassiotheparanormalisreal_leonellcassiotheparanormalisreal', 'Leonell Cassio - The Paranormal Is Real', 169, 0, '{\"disable_parent\":false}', 0, 25, NULL, 3, 3, NULL, NULL, 3, NULL, 1, NULL, NULL, NULL, NULL, '{\"time\":1701833416,\"blocks\":[{\"type\":\"paragraph\",\"data\":{\"text\":\"https:\\/\\/pixabay.com\\/music\\/future-bass-leonell-cassio-the-paranormal-is-real-ft-carrie-163742\\/\"}}],\"version\":\"2.25.0\",\"files\":{\"images\":[],\"videos\":[]},\"html\":\"<div class=\'editorjs_html_wrapper\'><p>https:\\/\\/pixabay.com\\/music\\/future-bass-leonell-cassio-the-paranormal-is-real-ft-carrie-163742\\/<\\/p><\\/div>\"}', NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, '2023-12-06 00:00:00', NULL, NULL, NULL, '2023-12-06 03:30:16', NULL, 'leonell_cassio-leonell_cassio_-_the_paranormal_is_real-leonell_cassio_-_the_paranormal_is_real', NULL, NULL);
INSERT INTO `_c_m_tracks` (`ID`, `hash`, `code`, `title`, `duration`, `price`, `price_setting`, `explicit`, `cover_id`, `bg_id`, `artist_id`, `album_id`, `album_index`, `album_cd`, `album_artist_id`, `album_price`, `uploader_id`, `spotify_id`, `spotify_cover`, `spotify_popularity`, `musixmatch_id`, `description`, `lyrics`, `s_views`, `s_views_unique`, `s_plays`, `s_plays_unique`, `s_likes`, `s_reposts`, `s_downloads`, `s_downloads_unique`, `s_comments`, `s_playlists`, `s_sales`, `s_shares`, `s_popularity`, `s_sources`, `s_sources_local`, `s_muse_report`, `time_play`, `time_release`, `time_spotify`, `time_musixmatch`, `time_update`, `time_add`, `translations`, `seo_url`, `seo_image`, `seo_data`) VALUES(4, '9d26c3c3e777ff6fb5315060ae3e4863', 'sergepavkinmusic_alongway_alongway', 'A Long Way', 274, 0, '{\"disable_parent\":false}', 0, 23, NULL, 4, 4, NULL, NULL, 4, NULL, 1, NULL, NULL, NULL, NULL, '{\"time\":1701833434,\"blocks\":[{\"type\":\"paragraph\",\"data\":{\"text\":\"https:\\/\\/pixabay.com\\/music\\/build-up-scenes-a-long-way-166385\\/\"}}],\"version\":\"2.25.0\",\"files\":{\"images\":[],\"videos\":[]},\"html\":\"<div class=\'editorjs_html_wrapper\'><p>https:\\/\\/pixabay.com\\/music\\/build-up-scenes-a-long-way-166385\\/<\\/p><\\/div>\"}', NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, '2023-12-06 00:00:00', NULL, NULL, NULL, '2023-12-06 03:30:34', NULL, 'sergepavkinmusic-a_long_way-a_long_way', NULL, NULL);
INSERT INTO `_c_m_tracks` (`ID`, `hash`, `code`, `title`, `duration`, `price`, `price_setting`, `explicit`, `cover_id`, `bg_id`, `artist_id`, `album_id`, `album_index`, `album_cd`, `album_artist_id`, `album_price`, `uploader_id`, `spotify_id`, `spotify_cover`, `spotify_popularity`, `musixmatch_id`, `description`, `lyrics`, `s_views`, `s_views_unique`, `s_plays`, `s_plays_unique`, `s_likes`, `s_reposts`, `s_downloads`, `s_downloads_unique`, `s_comments`, `s_playlists`, `s_sales`, `s_shares`, `s_popularity`, `s_sources`, `s_sources_local`, `s_muse_report`, `time_play`, `time_release`, `time_spotify`, `time_musixmatch`, `time_update`, `time_add`, `translations`, `seo_url`, `seo_image`, `seo_data`) VALUES(5, 'c778942dfee6358ae1aa2b0cecdf4c3c', 'paoloargento_thebestjazzclubinneworleans_thebestjazzclubinneworleans', 'The Best Jazz Club In New Orleans', 121, 0, '{\"disable_parent\":false}', 0, 24, NULL, 5, 5, NULL, NULL, 5, NULL, 1, NULL, NULL, NULL, NULL, '{\"time\":1701833452,\"blocks\":[{\"type\":\"paragraph\",\"data\":{\"text\":\"https:\\/\\/pixabay.com\\/music\\/traditional-jazz-the-best-jazz-club-in-new-orleans-164472\\/\"}}],\"version\":\"2.25.0\",\"files\":{\"images\":[],\"videos\":[]},\"html\":\"<div class=\'editorjs_html_wrapper\'><p>https:\\/\\/pixabay.com\\/music\\/traditional-jazz-the-best-jazz-club-in-new-orleans-164472\\/<\\/p><\\/div>\"}', NULL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, '2023-12-06 00:00:00', NULL, NULL, NULL, '2023-12-06 03:30:52', NULL, 'paoloargento-the_best_jazz_club_in_new_orleans-the_best_jazz_club_in_new_orleans', NULL, NULL);
INSERT INTO `_c_m_tracks` (`ID`, `hash`, `code`, `title`, `duration`, `price`, `price_setting`, `explicit`, `cover_id`, `bg_id`, `artist_id`, `album_id`, `album_index`, `album_cd`, `album_artist_id`, `album_price`, `uploader_id`, `spotify_id`, `spotify_cover`, `spotify_popularity`, `musixmatch_id`, `description`, `lyrics`, `s_views`, `s_views_unique`, `s_plays`, `s_plays_unique`, `s_likes`, `s_reposts`, `s_downloads`, `s_downloads_unique`, `s_comments`, `s_playlists`, `s_sales`, `s_shares`, `s_popularity`, `s_sources`, `s_sources_local`, `s_muse_report`, `time_play`, `time_release`, `time_spotify`, `time_musixmatch`, `time_update`, `time_add`, `translations`, `seo_url`, `seo_image`, `seo_data`) VALUES(6, '77238a9d4132b3b41cb026d9f7a03742', 'royaltyfreemusic_trapfuturebass_trapfuturebass', 'Trap Future Bass', 127, 0, '{\"disable_parent\":false}', 0, 26, NULL, 2, 6, NULL, NULL, 2, NULL, 1, NULL, NULL, NULL, NULL, '{\"time\":1701833476,\"blocks\":[{\"type\":\"paragraph\",\"data\":{\"text\":\"https:\\/\\/pixabay.com\\/music\\/future-bass-trap-future-bass-royalty-free-music-167020\\/\"}}],\"version\":\"2.25.0\",\"files\":{\"images\":[],\"videos\":[]},\"html\":\"<div class=\'editorjs_html_wrapper\'><p>https:\\/\\/pixabay.com\\/music\\/future-bass-trap-future-bass-royalty-free-music-167020\\/<\\/p><\\/div>\"}', NULL, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, '2023-12-06 00:00:00', NULL, NULL, '2023-12-06 05:20:45', '2023-12-06 03:31:16', NULL, 'royaltyfreemusic-trap_future_bass-trap_future_bass', NULL, NULL);
INSERT INTO `_c_m_tracks` (`ID`, `hash`, `code`, `title`, `duration`, `price`, `price_setting`, `explicit`, `cover_id`, `bg_id`, `artist_id`, `album_id`, `album_index`, `album_cd`, `album_artist_id`, `album_price`, `uploader_id`, `spotify_id`, `spotify_cover`, `spotify_popularity`, `musixmatch_id`, `description`, `lyrics`, `s_views`, `s_views_unique`, `s_plays`, `s_plays_unique`, `s_likes`, `s_reposts`, `s_downloads`, `s_downloads_unique`, `s_comments`, `s_playlists`, `s_sales`, `s_shares`, `s_popularity`, `s_sources`, `s_sources_local`, `s_muse_report`, `time_play`, `time_release`, `time_spotify`, `time_musixmatch`, `time_update`, `time_add`, `translations`, `seo_url`, `seo_image`, `seo_data`) VALUES(7, '57a571e788c8f66b9da4f44ac520ac24', 'comamedia_glossy_glossy', 'Glossy', 94, 0, '{\"disable_parent\":false}', 0, 27, NULL, 6, 7, NULL, NULL, 6, NULL, 1, NULL, NULL, NULL, NULL, '{\"time\":1701833494,\"blocks\":[{\"type\":\"paragraph\",\"data\":{\"text\":\"https:\\/\\/pixabay.com\\/music\\/beats-glossy-168156\\/\"}}],\"version\":\"2.25.0\",\"files\":{\"images\":[],\"videos\":[]},\"html\":\"<div class=\'editorjs_html_wrapper\'><p>https:\\/\\/pixabay.com\\/music\\/beats-glossy-168156\\/<\\/p><\\/div>\"}', NULL, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, '2023-12-06 00:00:00', NULL, NULL, '2023-12-06 05:17:24', '2023-12-06 03:31:34', NULL, 'coma-media-glossy-glossy', NULL, NULL);

DROP TABLE IF EXISTS `_c_m_tracks_relations`;
CREATE TABLE `_c_m_tracks_relations` (
  `track_id` int(9) NOT NULL,
  `target_id` int(9) NOT NULL,
  `type` varchar(10) NOT NULL,
  `i` int(4) DEFAULT NULL,
  `time_add` timestamp NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `_c_m_tracks_relations` (`track_id`, `target_id`, `type`, `i`, `time_add`) VALUES(1, 1, 'genre', 0, '2023-12-06 03:29:41');
INSERT INTO `_c_m_tracks_relations` (`track_id`, `target_id`, `type`, `i`, `time_add`) VALUES(1, 1, 'tag', 0, '2023-12-06 03:29:41');
INSERT INTO `_c_m_tracks_relations` (`track_id`, `target_id`, `type`, `i`, `time_add`) VALUES(2, 1, 'genre', 0, '2023-12-06 03:29:44');
INSERT INTO `_c_m_tracks_relations` (`track_id`, `target_id`, `type`, `i`, `time_add`) VALUES(2, 1, 'tag', 0, '2023-12-06 03:29:44');
INSERT INTO `_c_m_tracks_relations` (`track_id`, `target_id`, `type`, `i`, `time_add`) VALUES(3, 1, 'genre', 0, '2023-12-06 03:30:16');
INSERT INTO `_c_m_tracks_relations` (`track_id`, `target_id`, `type`, `i`, `time_add`) VALUES(3, 1, 'tag', 0, '2023-12-06 03:30:16');
INSERT INTO `_c_m_tracks_relations` (`track_id`, `target_id`, `type`, `i`, `time_add`) VALUES(4, 1, 'genre', 0, '2023-12-06 03:30:34');
INSERT INTO `_c_m_tracks_relations` (`track_id`, `target_id`, `type`, `i`, `time_add`) VALUES(4, 1, 'tag', 0, '2023-12-06 03:30:34');
INSERT INTO `_c_m_tracks_relations` (`track_id`, `target_id`, `type`, `i`, `time_add`) VALUES(5, 1, 'genre', 0, '2023-12-06 03:30:52');
INSERT INTO `_c_m_tracks_relations` (`track_id`, `target_id`, `type`, `i`, `time_add`) VALUES(5, 1, 'tag', 0, '2023-12-06 03:30:52');
INSERT INTO `_c_m_tracks_relations` (`track_id`, `target_id`, `type`, `i`, `time_add`) VALUES(6, 1, 'genre', 0, '2023-12-06 03:31:16');
INSERT INTO `_c_m_tracks_relations` (`track_id`, `target_id`, `type`, `i`, `time_add`) VALUES(6, 1, 'tag', 0, '2023-12-06 03:31:16');
INSERT INTO `_c_m_tracks_relations` (`track_id`, `target_id`, `type`, `i`, `time_add`) VALUES(7, 1, 'genre', 0, '2023-12-06 03:31:34');
INSERT INTO `_c_m_tracks_relations` (`track_id`, `target_id`, `type`, `i`, `time_add`) VALUES(7, 1, 'tag', 0, '2023-12-06 03:31:34');

DROP TABLE IF EXISTS `_c_m_tracks_sources`;
CREATE TABLE `_c_m_tracks_sources` (
  `ID` int(9) NOT NULL,
  `hash` varchar(32) DEFAULT NULL,
  `target_id` int(9) NOT NULL,
  `type` varchar(10) NOT NULL,
  `title` tinytext DEFAULT NULL,
  `download_able` int(1) DEFAULT NULL,
  `stream_able` int(1) DEFAULT NULL,
  `encrypted` int(1) DEFAULT NULL,
  `duration` float DEFAULT NULL,
  `quality` int(1) DEFAULT NULL,
  `data` mediumtext NOT NULL,
  `force_free` int(1) NOT NULL DEFAULT 0,
  `protected` int(1) NOT NULL DEFAULT 0,
  `queue` int(1) NOT NULL DEFAULT 0,
  `queue_old` int(11) DEFAULT NULL,
  `time_add` timestamp NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `_c_m_tracks_sources` (`ID`, `hash`, `target_id`, `type`, `title`, `download_able`, `stream_able`, `encrypted`, `duration`, `quality`, `data`, `force_free`, `protected`, `queue`, `queue_old`, `time_add`) VALUES(1, '7ccd7d477c7b0868627e24c4f6f0b556', 1, 'audio', NULL, 1, 1, 0, 130, 4, '{\"file_type\":\"local\",\"local_file\":10}', 0, 0, 0, NULL, '2023-12-06 03:29:42');
INSERT INTO `_c_m_tracks_sources` (`ID`, `hash`, `target_id`, `type`, `title`, `download_able`, `stream_able`, `encrypted`, `duration`, `quality`, `data`, `force_free`, `protected`, `queue`, `queue_old`, `time_add`) VALUES(2, '8e6cd843e182889ebda6bf12a9dc4fa2', 2, 'audio', NULL, 1, 1, 0, 126, 4, '{\"file_type\":\"local\",\"local_file\":11}', 0, 0, 0, NULL, '2023-12-06 03:29:44');
INSERT INTO `_c_m_tracks_sources` (`ID`, `hash`, `target_id`, `type`, `title`, `download_able`, `stream_able`, `encrypted`, `duration`, `quality`, `data`, `force_free`, `protected`, `queue`, `queue_old`, `time_add`) VALUES(3, '58edb0b05a6eb1a5ec981f5c3eeceb25', 3, 'audio', NULL, 1, 1, 0, 169, 4, '{\"file_type\":\"local\",\"local_file\":12}', 0, 0, 0, NULL, '2023-12-06 03:30:16');
INSERT INTO `_c_m_tracks_sources` (`ID`, `hash`, `target_id`, `type`, `title`, `download_able`, `stream_able`, `encrypted`, `duration`, `quality`, `data`, `force_free`, `protected`, `queue`, `queue_old`, `time_add`) VALUES(4, 'd59628b489ad96d206832a227a6f6f94', 4, 'audio', NULL, 1, 1, 0, 274, 4, '{\"file_type\":\"local\",\"local_file\":13}', 0, 0, 0, NULL, '2023-12-06 03:30:35');
INSERT INTO `_c_m_tracks_sources` (`ID`, `hash`, `target_id`, `type`, `title`, `download_able`, `stream_able`, `encrypted`, `duration`, `quality`, `data`, `force_free`, `protected`, `queue`, `queue_old`, `time_add`) VALUES(5, '89934f1911ff70b5f29767c2b909ca68', 5, 'audio', NULL, 1, 1, 0, 121, 4, '{\"file_type\":\"local\",\"local_file\":14}', 0, 0, 0, NULL, '2023-12-06 03:30:52');
INSERT INTO `_c_m_tracks_sources` (`ID`, `hash`, `target_id`, `type`, `title`, `download_able`, `stream_able`, `encrypted`, `duration`, `quality`, `data`, `force_free`, `protected`, `queue`, `queue_old`, `time_add`) VALUES(6, 'b8c289cc3d64d541e018b01f86fd8496', 6, 'audio', NULL, 1, 1, 0, 127, 4, '{\"file_type\":\"local\",\"local_file\":15}', 0, 0, 0, NULL, '2023-12-06 03:31:16');
INSERT INTO `_c_m_tracks_sources` (`ID`, `hash`, `target_id`, `type`, `title`, `download_able`, `stream_able`, `encrypted`, `duration`, `quality`, `data`, `force_free`, `protected`, `queue`, `queue_old`, `time_add`) VALUES(7, '2ca8c65b5905792d2a119a1f419a2c36', 7, 'audio', NULL, 1, 1, 0, 94, 4, '{\"file_type\":\"local\",\"local_file\":16}', 0, 0, 0, NULL, '2023-12-06 03:31:35');

DROP TABLE IF EXISTS `_d_languages`;
CREATE TABLE `_d_languages` (
  `ID` int(3) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code2` varchar(2) NOT NULL,
  `code3` varchar(3) NOT NULL,
  `_default` int(11) NOT NULL DEFAULT 0,
  `_index` int(11) NOT NULL DEFAULT 0,
  `s_items` int(5) NOT NULL DEFAULT 0,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `_d_languages` (`ID`, `name`, `code2`, `code3`, `_default`, `_index`, `s_items`, `time_add`) VALUES(1, 'English', 'en', 'eng', 1, 1, 411, '2022-03-08 08:14:04');

DROP TABLE IF EXISTS `_d_languages_items`;
CREATE TABLE `_d_languages_items` (
  `ID` int(6) NOT NULL,
  `hook` varchar(40) NOT NULL,
  `lang_code2` varchar(2) NOT NULL DEFAULT 'en',
  `text` text DEFAULT NULL,
  `used` int(11) NOT NULL DEFAULT 0,
  `used_be` int(11) NOT NULL DEFAULT 0,
  `used_ce` int(11) NOT NULL DEFAULT 0,
  `time_add` timestamp NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(1, 'login', 'en', 'login', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(2, 'email', 'en', 'email', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(3, 'password', 'en', 'password', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(4, 'continue', 'en', 'continue', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(5, 'signup', 'en', 'sign up', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(6, 'login_recover_text', 'en', 'recover your password', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(7, 'ok', 'en', 'ok', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(8, 'invalid_input', 'en', '%input_name% is invalid', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(9, 'retry', 'en', 'retry', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(10, 'welcome', 'en', 'welcome', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(11, 'messenger', 'en', 'Messenger', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(12, 'logout', 'en', 'logout', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(13, 'setting', 'en', 'setting', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(14, 'account_setting', 'en', 'account setting', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(15, 'browse', 'en', 'browse', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(16, 'more', 'en', 'more', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(17, 'back', 'en', 'back', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(18, 'search', 'en', 'search', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(19, 'search_placeholder', 'en', 'Search ....', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(20, 'filter', 'en', 'filter', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(21, 'next', 'en', 'next', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(22, 'playlists', 'en', 'playlists', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(23, 'made_for_you', 'en', 'made for you', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(24, 'likes', 'en', 'likes', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(25, 'subscriptions', 'en', 'subscriptions', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(26, 'history', 'en', 'history', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(27, 'nothing_to_see', 'en', 'Nothing to see here', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(28, 'play', 'en', 'play', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(29, 'm_album', 'en', 'Album', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(30, 'tracks', 'en', 'tracks', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(31, 'm_track', 'en', 'Track', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(32, 'm_artist', 'en', 'Artist', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(33, 'plays', 'en', 'plays', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(34, 'a_book', 'en', 'Audio book', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(35, 'p_show', 'en', 'Podcast', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(36, 'episodes', 'en', 'episodes', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(37, 'a_writer', 'en', 'Writer', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(38, 'subscribers', 'en', 'subscriber', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(39, 'books', 'en', 'books', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(40, 'p_podcaster', 'en', 'Podcaster', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(41, 'm_genre', 'en', 'Genre', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(42, 'r_station', 'en', 'Radio', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(43, 'p_episode', 'en', 'Podcast episode', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(44, 'profile', 'en', 'profile', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(45, 'upload', 'en', 'upload', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(46, 'done', 'en', 'done', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(47, 'previous', 'en', 'previous', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(48, 'unsubscribed', 'en', 'unsubscribe', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(49, 'views', 'en', 'views', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(50, 'views_unique', 'en', 'unique views', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(51, 'posts', 'en', 'posts', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(52, 'albums', 'en', 'albums', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(53, 'artists', 'en', 'artists', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(54, 'play_next', 'en', 'play next', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(55, 'add_to_queue', 'en', 'add to queue', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(56, 'add_to_playlist', 'en', 'add to playlist', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(57, 'share', 'en', 'share', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(58, 'open', 'en', 'open', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(59, 'like', 'en', 'like', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(60, 'open_artist', 'en', 'open artist', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(61, 'open_genre', 'en', 'open genre', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(62, 'subscribe', 'en', 'subscribe', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(63, 'unsubscribe', 'en', 'unsubscribe', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(64, 'unlike', 'en', 'unlike', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(65, 'send', 'en', 'send', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(66, 'open_tag', 'en', 'open tag', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(67, 'loading', 'en', 'loading ...', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(68, 'recent', 'en', 'Recently', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(69, 'second', 'en', 'second', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(70, 'minute', 'en', 'minute', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(71, 'hour', 'en', 'hour', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(72, 'day', 'en', 'day', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(73, 'month', 'en', 'month', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(74, 'year', 'en', 'year', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(75, 'seconds', 'en', 'seconds', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(76, 'minutes', 'en', 'minutes', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(77, 'hours', 'en', 'hours', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(78, 'days', 'en', 'days', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(79, 'months', 'en', 'months', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(80, 'years', 'en', 'years', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(81, 'downloads', 'en', 'downloads', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(82, 'select', 'en', 'select', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(83, 'saved', 'en', 'saved', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(84, 'create_new', 'en', 'create new', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(85, 'translators', 'en', 'translators', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(86, 'narrators', 'en', 'narrators', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(87, 'writers', 'en', 'writers', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(88, 'stations', 'en', 'stations', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(89, 'podcasters', 'en', 'podcasters', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(90, 'shows', 'en', 'shows', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(91, 'edit_episodes', 'en', 'edit episode', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(92, 'edit_show', 'en', 'edit show', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(93, 'podcast', 'en', 'podcast', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(94, 'affiliate', 'en', 'affiliate', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(95, 'download', 'en', 'download', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(96, 'free', 'en', 'free', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(97, 'failed', 'en', 'failed', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(98, 'purchase', 'en', 'purchase', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(99, 'buy', 'en', 'buy', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(100, 'nothing_found', 'en', 'nothing found', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(101, 'insufficient_fund', 'en', 'insufficient funds', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(102, 'purchased', 'en', 'purchased', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(103, 'security', 'en', 'security', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(104, 'transactions', 'en', 'transactions', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(105, 'notifications', 'en', 'notifications', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(106, 'music', 'en', 'music', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(107, 'audio', 'en', 'audio', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(108, 'video', 'en', 'video', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(109, 'youtube', 'en', 'YouTube', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(110, 'soundcloud', 'en', 'SoundCloud', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(111, 'edit_album', 'en', 'Edit album', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(112, 'edit_tracks', 'en', 'Edit tracks', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(113, 'upload_audio', 'en', 'upload audio', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(114, 'upload_video', 'en', 'upload video', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(115, 'import_youtube', 'en', 'import YouTube', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(116, 'import_soundcloud', 'en', 'import SoundCloud', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(117, 'uploads', 'en', 'uploads', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(118, 'light_toggle', 'en', 'Dark/Light switch', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(119, 'change_language', 'en', 'Change Language', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(120, 'change_currency', 'en', 'Change Currency', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(121, 'plans_title', 'en', 'Premium plans', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(122, 'plans_subtitle', 'en', 'Go the extra mile', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(123, 'plan', 'en', 'plan', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(124, 'period', 'en', 'period', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(125, 'price', 'en', 'price', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(126, 'confirm', 'en', 'confirm', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(127, 'monthly', 'en', 'monthly', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(128, '3months', 'en', '3months', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(129, 'yearly', 'en', 'yearly', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(130, 'move', 'en', 'move', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(131, 'fullscreen', 'en', 'fullscreen', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(132, 'hide', 'en', 'hide', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(133, 'lyrics', 'en', 'lyrics', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(134, 'queue', 'en', 'queue', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(135, 'infinite_play_tip', 'en', 'Extend your queue by related content', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(136, 'infinite_play', 'en', 'Infinite Play', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(137, 'processing_dots', 'en', 'processing ...', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(138, 'pageload_failed', 'en', 'failed to load the page', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(139, 'choose_name', 'en', 'choose a name', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(140, 'privacy', 'en', 'privacy', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(141, 'edit_playlist', 'en', 'edit playlist', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(142, 'name', 'en', 'name', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(143, 'playlist_privacy', 'en', 'Who should be able to access this playlist', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(144, 'public', 'en', 'public', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(145, 'private', 'en', 'private', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(146, 'cancel', 'en', 'cancel', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(147, 'not_found', 'en', 'not found', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(148, 'max', 'en', 'max', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(149, 'min', 'en', 'min', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(150, 'up_rule_extensions', 'en', 'Acceotable extensions', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(151, 'up_rule_filesize', 'en', 'Acceotable file size', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(152, 'up_rule_img_dim', 'en', 'Acceptable image dimensions', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(153, 'up_rule_vid_widh', 'en', 'Acceptable video dimensions', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(154, 'up_rule_audio_bit', 'en', 'Minimum bitrate', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(155, 'manage', 'en', 'manage', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(156, 'edit', 'en', 'edit', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(157, 'delete', 'en', 'delete', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(158, 'confirm_remove_playlist', 'en', 'really remove playlist?', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(159, 'enter_a_name', 'en', 'enter a name', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(160, 'create', 'en', 'create', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(161, 'open_profile', 'en', 'open profile', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(162, 'subscribed', 'en', 'subscribed', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(163, 'edited', 'en', 'edited', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(164, 'own_profile', 'en', 'your profile', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(165, 'followers', 'en', 'followers', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(166, 'library', 'en', 'library', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(167, 'edit_profile', 'en', 'edit profile', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(168, 'playlist', 'en', 'playlist', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(169, 'your_playlist', 'en', 'your playlist', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(170, 'add_to_library', 'en', 'add to library', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(171, 'last_update', 'en', 'last update', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(172, 'ups1_ct', 'en', 'content type', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(173, 'ups2_st', 'en', 'source type', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(174, 'ups3_up', 'en', 'upload', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(175, 'ups1t', 'en', 'What do you want to upload?', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(176, 'ups2t', 'en', 'How do you want to provide the source?', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(177, 'ups3ut', 'en', 'Upload files', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(178, 'ups3it', 'en', 'Import media', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(179, 'album', 'en', 'album', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(180, 'single_tracks', 'en', 'single track', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(181, 'upload_click', 'en', 'Or click here to select', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(182, 'upload_rules', 'en', 'rules', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(183, 'upload_dragdrop', 'en', 'Drag &amp; Drop files to start', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(184, 'file', 'en', 'file', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(185, 'files', 'en', 'files', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(186, 'img_too_big', 'en', 'Image is too big. Max: %max%px', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(187, 'img_too_small', 'en', 'Image is too small. Min: %min%px', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(188, 'invalid_image', 'en', 'Invalid image', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(189, 'invalid_format', 'en', 'Invalid format: %cur%', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(190, 'audio_too_low', 'en', 'Bitrate is too low. Min: %min%. Uploaded: %cur%', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(191, 'vid_too_small', 'en', 'Video width is too small. Min: %min%px', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(192, 'vid_too_big', 'en', 'Video width is too big. Max: %max%px', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(193, 'invalid_file', 'en', 'invalid file', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(194, 'invalid_file_big', 'en', 'invalid file - too big', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(195, 'cover', 'en', 'cover', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(196, 'title', 'en', 'title', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(197, 'album_type', 'en', 'album type', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(198, 'artist_name', 'en', 'artist name', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(199, 'release_date', 'en', 'release date', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(200, 'genres', 'en', 'genres', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(201, 'tags', 'en', 'tags', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(202, 'languages', 'en', 'languages', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(203, 'description', 'en', 'description', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(204, 'save', 'en', 'save', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(205, 'featured_artists', 'en', 'featured artists', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(206, 'album_cd', 'en', 'album CD', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(207, 'album_order', 'en', 'album order', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(208, 'price_force_free', 'en', 'force free', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(209, 'basic', 'en', 'basic', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(210, 'playlist_extended', 'en', 'added to playlist', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(211, 'deleted', 'en', 'deleted', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(212, 'removed', 'en', 'removed', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(213, 'submit', 'en', 'submit', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(214, 'podcaster_name', 'en', 'podcaster name', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(215, 'language', 'en', 'language', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(216, 'country', 'en', 'country', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(217, 'categories', 'en', 'categories', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(218, 'copyright', 'en', 'copyright', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(219, 'show', 'en', 'podcast show', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(220, 'show_season', 'en', 'show season', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(221, 'show_order', 'en', 'show order in season', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(222, 'invalid_form_item', 'en', 'failed', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(223, 'youtube_id', 'en', 'YouTube ID', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(224, 'youtube_id_url_tip', 'en', 'Enter the ID or full web-address of a YouTube video', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(225, 'soundcloud_id', 'en', 'SoundCloud ID', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(226, 'soundcloud_id_tip', 'en', 'Enter the ID of a SoundCloud audio', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(227, 'liked', 'en', 'liked', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(228, 'select_an_item', 'en', 'select an item', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(229, 'remove_from_que', 'en', 'remove from queue', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(230, 'cant_play', 'en', 'there is a problem with this item, try another', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(231, 'user', 'en', 'user', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(232, 'unliked', 'en', 'unliked', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(233, 'access_denied', 'en', 'no access', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(234, 'a_language', 'en', 'audiobook language', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(235, 'r_region', 'en', 'radio region', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(236, 'your_online', 'en', 'You are back online!', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(237, 'your_offline_desc', 'en', 'Try screaming for help or browse downloaded content', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(238, 'your_offline_btn', 'en', 'View downloads', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(239, 'your_offline', 'en', 'No internet connection!', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(240, 'download_e_title', 'en', 'Get your files offline', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(241, 'download_e_desc', 'en', 'Download in-app and your files will show up here', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(242, 'playlist_created', 'en', 'playlist created', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(243, 'login_failed', 'en', 'login failed', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(244, 'username', 'en', 'username', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(245, 'invalid_username', 'en', 'invalid_username', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(246, 'pws_dont_match', 'en', 'pws_dont_match', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(247, '404_title', 'en', 'Not found', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(248, '404_desc', 'en', '404 Error: failed to find requested resource', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(249, 'username_taken', 'en', 'username is taken', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(250, 'email_taken', 'en', 'email is taken', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(251, 'recovery_email_sent', 'en', 'Check your inbox, if this email exists, we\'ll send you a recovery email', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(252, 'signup_terms', 'en', 'Signing up means agreeing with out terms of use', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(253, 'recover', 'en', 'recover', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(254, 'recover_confirm', 'en', 'recover', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(255, 'verification_code', 'en', 'verification code', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(256, 'new_password', 'en', 'new password', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(257, 'changed_pw', 'en', 'password changed', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(258, 'password_repeat', 'en', 'repeat password', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(259, 'ok_login', 'en', 'welcome', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(260, 'signup_disabled', 'en', 'signup is disabled', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(261, 'verify_first', 'en', 'please verify your email now', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(262, 'verification', 'en', 'verification', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(263, 'followed', 'en', 'followed', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(264, 'unfollow', 'en', 'unfollow', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(265, 'unfollowed', 'en', 'unfollowed', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(266, 'follow', 'en', 'follow', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(267, 'message', 'en', 'message', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(268, 'left_group', 'en', 'left group', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(269, 'failed_pending', 'en', 'pending. try again later', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(270, 'p_category', 'en', 'category', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(271, 'invalid_youtube_id', 'en', 'YT invalid ID', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(272, '404', 'en', '404', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(273, 'youtube_request_failed', 'en', 'YT request failed', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(274, 'chapar_title_new_follower', 'en', '&lt;b&gt;%username%&lt;/b&gt; started following you!', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(275, 'chapar_title_playlist_follower', 'en', '<b>%username%</b> subscribed to <b>%playlist_name%</b> playlist!', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(276, 'payment_result', 'en', 'Payment result', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(277, 'b_post', 'en', 'post', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(278, 'b_category', 'en', 'category', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(279, 'b_tag', 'en', 'tag', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(280, 'registered', 'en', 'registered', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(281, 'already_uploaded', 'en', 'this item is already uploaded', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(282, 'upgrade', 'en', 'upgrade', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(283, 'countries', 'en', 'countries', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(284, 'cities', 'en', 'cities', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(285, 'email_dont_talk', 'en', 'This email was sent by system. Don&#039;t reply to it please', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(286, 'soundcloud_embed', 'en', 'SoundCloud Embed code', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(287, 'soundcloud_embed_tip', 'en', 'Paste embed code here. App will extract required information from it. Only \"SoundCloud tracks\" are supported', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(288, 'invalid_soundcloud_embed_nt', 'en', 'SoundCloud embed code is valid, but only tracks are supported. This is not a track', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(289, 'invalid_soundcloud_embed', 'en', 'SoundCloud embed code is invalid', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(290, 'single_episode', 'en', 'Single Episode', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(291, 'collabs', 'en', 'Collaborators', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(292, 'playlist_collabs', 'en', 'You can allow other people to co-manage this playlist', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(293, 'insufficient_fund_tip', 'en', 'You don\'t have enough funds to proceed. Add some funds and try again', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(294, 'successful', 'en', 'successful', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(295, 'purchase_ok_tip', 'en', 'Your purchase has been processed, you have access now! Thanks for the purchase', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(296, 'success', 'en', 'successful', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(297, 'have_access_already_tip', 'en', 'You already have access to this subscription plan', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(298, 'biography', 'en', 'biography', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(299, 'city', 'en', 'city', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(300, 'birthday', 'en', 'birthday', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(301, 'deathday', 'en', 'deathday', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(302, 'a_narrator', 'en', 'narrator', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(303, 'a_genre', 'en', 'genre', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(304, 'social_links', 'en', 'social links', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(305, 'noti_new_follower', 'en', 'New follower', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(306, 'noti_new_playlist_subscriber', 'en', 'New playlist subscriber', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(307, 'noti_plan_purchased', 'en', 'Premium-plan purchase successful', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(308, 'noti_item_purchased', 'en', 'Purchase successful', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(309, 'noti_payment_ok', 'en', 'Payment successful', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(310, 'noti_payment_rejected', 'en', 'Payment rejected', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(311, 'noti_verification_ok', 'en', 'Verification done', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(312, 'noti_verification_rejected', 'en', 'Verification rejected', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(313, 'noti_item_sold', 'en', 'New sale', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(314, 'noti_collabed_in_playlist', 'en', 'Playlist collab', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(315, 'noti_creator_update', 'en', 'New content', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(316, 'noti_new_group_message', 'en', 'New group message', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(317, 'noti_new_1on1_message', 'en', 'New direct message', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(318, 'noti_playlist_update', 'en', 'Playlist update', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(319, 'noti_new_follower_tip', 'en', 'Executed when another user follows you', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(320, 'noti_new_playlist_subscriber_tip', 'en', 'Executed when someone adds your playlist to their library', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(321, 'noti_plan_purchased_tip', 'en', 'Executed when you subscribe to a premium plan', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(322, 'noti_item_purchased_tip', 'en', 'Executed when you make a successful purchase', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(323, 'noti_payment_ok_tip', 'en', 'Executed when your payment is confirmed', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(324, 'noti_payment_rejected_tip', 'en', 'Executed when your payment is rejected/failed', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(325, 'noti_verification_ok_tip', 'en', 'Executed when your request to become a creator is accepted', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(326, 'noti_verification_rejected_tip', 'en', 'Executed when your request to become a creator is rejected', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(327, 'noti_item_sold_tip', 'en', 'Executed when someone purchases your content', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(328, 'noti_collabed_in_playlist_tip', 'en', 'Executed when you are added as a collaborator to a playlist', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(329, 'noti_creator_update_tip', 'en', 'Executed when a creator you are subscribed to has new content', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(330, 'noti_new_group_message_tip', 'en', 'Executed when you have a group message', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(331, 'noti_new_1on1_message_tip', 'en', 'Executed when you have a new message', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(332, 'noti_playlist_update_tip', 'en', 'Executed when a playlist you have added to your library is updated', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(333, 'links', 'en', 'links', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(334, 'remove_from_playlist', 'en', 'remove from playlist', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(335, 'request_submited', 'en', 'request submitted', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(336, 'bad_inputs', 'en', 'bad inputs', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(337, 'item', 'en', 'item', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(338, 'msngr_nada', 'en', 'Nothing to show!', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(339, 'msngr_nada_tip', 'en', 'It\'s okay! Try subscribing to artists or users and things will appear here!', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(340, 'not_push_tip', 'en', 'Turn on desktop notifications to stay updated', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(341, 'turn_on', 'en', 'turn on', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(342, 'maybe_later', 'en', 'maybe later', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(343, 'mark_as_read', 'en', 'Mark as read', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(344, 'add_funds', 'en', 'add funds', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(345, 'pay_method', 'en', 'Payment method', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(346, 'pay', 'en', 'pay', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(347, 'amount', 'en', 'amount', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(348, 'service_fee', 'en', 'Service fee', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(349, 'service_fee_ced', 'en', 'Amount you\'ll pay', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(350, 'activated', 'en', 'activated', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(351, 'avatar', 'en', 'avatar', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(352, 'user_cover_tip', 'en', 'Used on top of your profile as background image', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(353, 'old_password', 'en', 'old password', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(354, 'no_transactions', 'en', 'No transactions yet', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(355, 'your_funds', 'en', 'Your funds', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(356, 'offline_transfer', 'en', 'offline transfer', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(357, 'deposit', 'en', 'deposit', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(358, 'disperse', 'en', 'disperse', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(359, 'withdraw', 'en', 'withdrawal', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(360, 'commission', 'en', 'commission', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(361, 'sale', 'en', 'sale', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(362, 'payment', 'en', 'payment', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(363, 'user_subs_plan', 'en', 'Subscription Plan', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(364, 'featured_in', 'en', 'featured in', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(365, 'similar_podcasters', 'en', 'Similar Podcasters', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(366, 'related_by_podcaster', 'en', 'Related by podcaster', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(367, 'related_by_writer', 'en', 'related by writer', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(368, 'related_by_translator', 'en', 'related by translator', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(369, 'related_by_narrator', 'en', 'related by narrator', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(370, 'related_by_genre', 'en', 'related by genre', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(371, 'related_by_tag', 'en', 'related by tag', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(372, 'related_by_language', 'en', 'related by language', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(373, 'studio_albums', 'en', 'studio albums', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(374, 'single_albums', 'en', 'single albums', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(375, 'related_artists', 'en', 'related artists', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(376, 'related_by_artist', 'en', 'related by artist', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(377, 'related_by_ft_artist', 'en', 'Related by featured-artist', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(378, 'related_by_lang', 'en', 'Related by language', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(379, 'related_by_region', 'en', 'Related by region', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(380, 'related_by_country', 'en', 'Related by country', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(381, 'related_by_city', 'en', 'Related by city', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(382, 'weekly', 'en', 'weekly', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(383, '6months', 'en', '6 months', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(384, 'ugc_playlist', 'en', 'User Playlist', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(385, 'r_country', 'en', 'Radio - Country', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(386, 'nothing_found_s_tip', 'en', 'Try browsing or use other keywords', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(387, 'purchases', 'en', 'purchases', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(388, 'collaborators', 'en', 'Collaborators', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(389, 'playlist_colab_tip', 'en', 'Other users that can manage this playlist', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(390, 'related_by_album', 'en', 'related by album', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(391, 'open_album', 'en', 'open album', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(392, 'open_podcaster', 'en', 'open podcaster', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(393, 'open_category', 'en', 'open category', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(394, 'open_show', 'en', 'open show', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(395, 'open_language', 'en', 'open language', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(396, 'open_region', 'en', 'open region', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(397, 'open_country', 'en', 'open country', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(398, 'open_city', 'en', 'open city', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(399, 'real_name', 'en', 'real name', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(400, 'stage_name', 'en', 'stage name', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(401, 'attach_document', 'en', 'attach document', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(402, 'additional_data', 'en', 'additional data', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(403, 'podcasting_name', 'en', 'podcasting name', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(404, 'verified', 'en', 'verified', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(405, 'last_release', 'en', 'last release', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(406, 'open_writer', 'en', 'open writer', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(407, 'open_narrator', 'en', 'open narrator', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(408, 'time_add', 'en', 'date created', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(409, 'user_points', 'en', 'points', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(410, 'signup_time', 'en', 'Account age', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(411, 'items', 'en', 'items', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(412, 'childs', 'en', 'childs', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(413, 'blacklisted', 'en', 'blacklisted', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(414, 'remove_from_library', 'en', 'Remove from library', 0, 0, 0, '2023-05-06 03:20:43');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(415, 'withdrawal', 'en', 'withdrawal', 0, 0, 0, '2023-12-06 02:14:28');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(416, 'withdraw_rec_label', 'en', 'Receiver Paypal', 0, 0, 0, '2023-12-06 02:14:28');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(417, 'submitted', 'en', 'submitted', 0, 0, 0, '2023-12-06 02:14:28');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(418, 'less', 'en', 'less', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(419, 'signup_agree_terms', 'en', 'I have read and agree to the <a href=\'terms\'>Terms of Service</a>', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(420, 'email_unsubscribe', 'en', 'unsubscribe', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(421, 'email_unsubscribed', 'en', 'You have successfully unsubscribed from email notifications. If you wish to re-enable them or manage other notification settings, you can do so in your account preferences', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(422, 'noti_email', 'en', 'Email Notifications', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(423, 'noti_email_tip', 'en', 'Toggle this option to disable all notifications sent to your email address. By turning this on, you will receive notifications within your email', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(424, 'u_g2_agree', 'en', 'Apologies, but you are unable to accept our terms, and consequently, you cannot utilize our service', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(425, 'sessions', 'en', 'sessions', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(426, 'location', 'en', 'location', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(427, 'ip', 'en', 'IP', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(428, 'platform', 'en', 'platform', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(429, 'operating_system', 'en', 'os', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(430, 'browser', 'en', 'browser', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(431, 'last_seen', 'en', 'last seen', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(432, 'you', 'en', 'you', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(433, 'wrong_old_password', 'en', 'Old password is wrong', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(434, 'passwords_dont_match', 'en', 'Passwords don\'t match', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(435, 'social_login_enabled', 'en', 'Social login enabled', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(436, 'social_login_enabledt', 'en', 'Is it possible to use social login to access this account when the social login shares the same email address?', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(437, 'social_login_disabled', 'en', 'Social login is disabled for this email', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(438, 'delete_account', 'en', 'Delete Account', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(439, 'delete_account_t', 'en', 'Are you sure you want to delete your account? This will remove all of your purchases, uploads and etc. Everything will be removed', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(440, 'pending', 'en', 'Pending', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(441, 'pending_request', 'en', 'You\'ve successfully submitted a request. Kindly await administrator approval or rejection before attempting again', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(442, 'social_login', 'en', 'Social sign-in', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(443, 'social_login_direct', 'en', 'You are about to be redirected to %target_name%', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(444, 'social_login_mail', 'en', 'Access to your basic information such as name, avatar and email <i>( required )', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(445, 'social_login_need', 'en', 'we need', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(446, 'social_login_ytlike', 'en', 'Access to your likes so we can sync %sitename% and Youtube likes <i>( optional )</i>', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(447, 'social_login_revoke', 'en', 'You can revoke this access inside your %target_name% account anytime', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(448, 'b_category_ids', 'en', 'Category(s)', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(449, 'b_tag_ids', 'en', 'Tag(s)', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(450, 's_views', 'en', 'Stat: Page Views', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(451, 's_shares', 'en', 'Stat: Shares', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(452, 'rel_category', 'en', 'Category(s)', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(453, 'rel_tag', 'en', 'Tag(s)', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(454, 'time_release', 'en', 'Last Release', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(455, 's_subscribers', 'en', 'Stat: Subscribers', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(456, 's_shows', 'en', 'Stat: Shows', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(457, 's_episodes', 'en', 'Stat: Episodes', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(458, 's_shows_as_guest', 'en', 'Stat: Shows ( As Guest )', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(459, 's_episodes_as_guest', 'en', 'Stat: Episode ( As Guest )', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(460, 'col_lang', 'en', 'Language', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(461, 'col_podcaster', 'en', 'Podcaster(s)', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(462, 'release_year_range', 'en', 'Release time', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(463, 'has_price', 'en', 'Price', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(464, 'rel_ft_podcaster', 'en', 'Featured Podcaster(s)', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(465, 's_likes', 'en', 'Stat: Likes', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(466, 'duration', 'en', 'Duration', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(467, 's_plays', 'en', 'Stat: Stream Count', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(468, 'rel_genre', 'en', 'Genre(s)', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(469, 'rel_lang', 'en', 'Language(s)', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(470, 'spotify_popularity', 'en', 'Spotify Popularity', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(471, 'spotify_followers', 'en', 'Spotify Followers', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(472, 'time_spotify', 'en', 'Last spotify sync', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(473, 'time_spotify_albums', 'en', 'Last spotify discography sync', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(474, 's_albums', 'en', 'Stat: Albums', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(475, 's_tracks', 'en', 'Stat: Tracks', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(476, 's_albums_as_ft', 'en', 'Stat: Albums ( As Featured )', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(477, 's_tracks_as_ft', 'en', 'Stat: Tracks ( As Featured )', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(478, 'type', 'en', 'Type', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(479, 'col_artist', 'en', 'Artist(s)', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(480, 's_tracks_duration', 'en', 'Stat: Tracks Duration', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(481, 's_sales', 'en', 'Stat: Sales', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(482, 'col_album', 'en', 'Album(s)', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(483, 'rel_artist', 'en', 'Featured Artist(s)', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(484, 's_muse_report', 'en', 'Stat: System Report ( Media Failure )', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(485, 'rel_language', 'en', 'Language(s)', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(486, 's_books', 'en', 'Stat: Books', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(487, 'rel_narrator', 'en', 'Narrator(s)', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(488, 'rel_translator', 'en', 'Translator(s)', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(489, 'rel_writer', 'en', 'Writer(s)', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(490, 's_chapters', 'en', 'Stat: Chapters', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(491, 'col_language', 'en', 'Language(s)', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(492, 'col_region', 'en', 'Region(s)', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(493, 'col_country', 'en', 'Country(s)', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(494, 'col_city', 'en', 'City(s)', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(495, 'sort_by', 'en', 'Sort by', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(496, 'all', 'en', 'all', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(497, 'priced', 'en', 'Priced', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(498, 'studio', 'en', 'Studio', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(499, 'compilation', 'en', 'Compilation', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(500, 'single', 'en', 'Single', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(501, 'mixtape', 'en', 'Mixtape', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(502, 'payment_ok', 'en', 'Payment successful', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(503, 'transaction_number', 'en', 'Transaction number', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(504, 'amount_paid', 'en', 'Amount paid', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(505, 'currency', 'en', 'Currency', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(506, 'back_to_home', 'en', 'Back to home', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(507, 'payment_pending', 'en', 'Payment pending', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(508, 'payment_pending_det', 'en', 'Payment is still pending. We\'ll keep checking', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(509, 'payment_failed', 'en', 'Payment unsuccessful', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(510, 'payment_failed_det', 'en', 'Error', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(511, 'best_results', 'en', 'Best results', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(512, 'reporting', 'en', 'Reporting the item ... wait ...', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(513, 'get_access_by_plans', 'en', 'Get access by sub plan', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(514, 'unsub', 'en', 'Stripe', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(515, 'no_s_subs', 'en', 'No active subscriptions found', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(516, 'sub_cancel', 'en', 'Do you really want to cancel your subscription?', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(517, 'sub_t_pays', 'en', 'total pays', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(518, 'sub_p_pay', 'en', 'last pay', 0, 0, 0, '2024-07-03 07:09:41');
INSERT INTO `_d_languages_items` (`ID`, `hook`, `lang_code2`, `text`, `used`, `used_be`, `used_ce`, `time_add`) VALUES(519, 'sub_n_pay', 'en', 'next pay', 0, 0, 0, '2024-07-03 07:09:41');

DROP TABLE IF EXISTS `_d_menus`;
CREATE TABLE `_d_menus` (
  `ID` int(4) NOT NULL,
  `name` varchar(100) NOT NULL,
  `comment` text NOT NULL,
  `targets` longtext DEFAULT NULL CHECK (json_valid(`targets`)),
  `structure` longtext DEFAULT NULL CHECK (json_valid(`structure`)),
  `_def` int(1) NOT NULL DEFAULT 0,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `_d_menus` (`ID`, `name`, `comment`, `targets`, `structure`, `_def`, `time_add`) VALUES(1, 'Sidebar - Desktop', '', NULL, '[{\"title\":\"RKHM\",\"href\":\"\",\"icon\":\"\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"\",\"childs\":[{\"title\":\"Home\",\"href\":\"\\/\",\"icon\":\"home\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"\"},{\"title\":\"Search\",\"href\":\"search\",\"icon\":\"cloud-search-outline\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"\",\"title_ar\":\"\"},{\"title\":\"Big Slider\",\"href\":\"big_slider\",\"icon\":\"hexagon-slice-3\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"\"},{\"title\":\"Browse tracks\",\"href\":\"browse\\/m_track\",\"icon\":\"magnify\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"\"}]},{\"title\":\"User\",\"href\":\"\",\"icon\":\"account\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"\",\"childs\":[{\"title\":\"Profile\",\"href\":\"user_area\",\"icon\":\"account\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"\"},{\"title\":\"Add funds\",\"href\":\"user_pay\",\"icon\":\"cash-plus\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"\"},{\"title\":\"Upload\",\"href\":\"upload\",\"icon\":\"account-box\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"\",\"title_fa\":\"\"},{\"title\":\"Playlists\",\"href\":\"user_library?tab=playlist\",\"icon\":\"playlist-music\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"\"},{\"title\":\"Likes\",\"href\":\"user_library?tab=likes\",\"icon\":\"cards-heart\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"\"},{\"title\":\"Upgrade\",\"href\":\"subscription_plans\",\"icon\":\"power-plug-outline\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"\"},{\"title\":\"Artist verification\",\"href\":\"become_verified\",\"icon\":\"police-badge\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"\"}]}]', 1, '2022-04-20 19:11:39');
INSERT INTO `_d_menus` (`ID`, `name`, `comment`, `targets`, `structure`, `_def`, `time_add`) VALUES(2, 'Navbar - Mobile', '', NULL, '[{\"title\":\"RKHM\",\"href\":\"\",\"icon\":\"home\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"\",\"childs\":[{\"title\":\"Home\",\"href\":\"\\/\",\"icon\":\"home\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"\"},{\"title\":\"Browse albums\",\"href\":\"browse\\/m_album\",\"icon\":\"magnify\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"\"}]},{\"title\":\"Search\",\"href\":\"search\",\"icon\":\"magnify\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"\"}]', 1, '2023-02-19 17:44:20');
INSERT INTO `_d_menus` (`ID`, `name`, `comment`, `targets`, `structure`, `_def`, `time_add`) VALUES(3, 'User Dropdown', '', NULL, '[{\"title\":\"Profile\",\"href\":\"user_area\",\"icon\":\"account\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"\"},{\"title\":\"Add funds\",\"href\":\"user_pay\",\"icon\":\"cash-plus\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"\"},{\"title\":\"Upload\",\"href\":\"upload\",\"icon\":\"account-box\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"\",\"title_fa\":\"\"},{\"title\":\"Playlists\",\"href\":\"user_library?tab=playlist\",\"icon\":\"playlist-music\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"\"},{\"title\":\"Likes\",\"href\":\"user_library?tab=likes\",\"icon\":\"cards-heart\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"\"},{\"title\":\"Upgrade\",\"href\":\"subscription_plans\",\"icon\":\"power-plug-outline\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"\"},{\"title\":\"Artist verification\",\"href\":\"become_verified\",\"icon\":\"police-badge\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"\"}]', 1, '2022-09-09 00:17:36');
INSERT INTO `_d_menus` (`ID`, `name`, `comment`, `targets`, `structure`, `_def`, `time_add`) VALUES(4, 'Footer', '', NULL, '[{\"title\":\"Login\",\"href\":\"user_auth?do=login\",\"icon\":\"\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"1\"},{\"title\":\"Terms\",\"href\":\"terms\",\"icon\":\"\",\"user_roles_exclude\":\"\",\"user_roles_only\":\"\"}]', 0, '2023-05-09 13:47:10');

DROP TABLE IF EXISTS `_d_pages`;
CREATE TABLE `_d_pages` (
  `ID` int(6) NOT NULL,
  `hash` varchar(32) NOT NULL,
  `name` varchar(100) NOT NULL,
  `comment` text DEFAULT NULL,
  `class` tinytext DEFAULT NULL,
  `pre_design` varchar(30) DEFAULT NULL,
  `s_widgets` int(4) NOT NULL DEFAULT 0,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_update` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `seo_url` varchar(100) NOT NULL,
  `seo_image` int(11) DEFAULT NULL,
  `seo_data` longtext DEFAULT NULL,
  `private` int(1) NOT NULL DEFAULT 0,
  `private_rules` mediumtext DEFAULT NULL,
  `active` int(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `_d_pages` (`ID`, `hash`, `name`, `comment`, `class`, `pre_design`, `s_widgets`, `time_add`, `time_update`, `seo_url`, `seo_image`, `seo_data`, `private`, `private_rules`, `active`) VALUES(1, '5f711117c6e1548ba845c3e8c3de7d8a', 'Search', '', '', NULL, 1, '2023-04-26 19:41:39', '2023-05-09 11:38:37', 'search', 0, '{\"title\":\"Discover Your Next Adventure\"}', 0, NULL, 1);
INSERT INTO `_d_pages` (`ID`, `hash`, `name`, `comment`, `class`, `pre_design`, `s_widgets`, `time_add`, `time_update`, `seo_url`, `seo_image`, `seo_data`, `private`, `private_rules`, `active`) VALUES(2, 'd795afd3aa22ca05ba3b3760b7770472', 'Landing page', '', 'no_sidebar fw_container', NULL, 7, '2023-03-24 21:06:19', '2023-12-06 05:02:11', '/', 0, '{\"title\":\"Unleash Your Inner Music Maverick\"}', 0, NULL, 1);
INSERT INTO `_d_pages` (`ID`, `hash`, `name`, `comment`, `class`, `pre_design`, `s_widgets`, `time_add`, `time_update`, `seo_url`, `seo_image`, `seo_data`, `private`, `private_rules`, `active`) VALUES(3, 'a9d49ac5174335d20016d4d68e63b87c', 'Artist Verification', '', 'no_sidebar', NULL, 3, '2023-05-09 10:57:05', '2023-05-09 11:26:57', 'become_verified', 0, '[]', 0, NULL, 1);
INSERT INTO `_d_pages` (`ID`, `hash`, `name`, `comment`, `class`, `pre_design`, `s_widgets`, `time_add`, `time_update`, `seo_url`, `seo_image`, `seo_data`, `private`, `private_rules`, `active`) VALUES(4, '73800b6020e53bbe2836aaeccf116213', 'Terms of usage', '', '', NULL, 1, '2023-05-09 11:27:59', '2023-05-09 11:37:28', 'terms', 0, '[]', 0, NULL, 1);
INSERT INTO `_d_pages` (`ID`, `hash`, `name`, `comment`, `class`, `pre_design`, `s_widgets`, `time_add`, `time_update`, `seo_url`, `seo_image`, `seo_data`, `private`, `private_rules`, `active`) VALUES(5, '6e0eef2601214057fd7b318f416f9979', 'Big Slider #1', '', '', 'bigslider', 14, '2023-12-06 03:42:19', '2023-12-06 03:43:02', 'big_slider', 0, '[]', 0, '{\"user_roles\":null}', 1);

DROP TABLE IF EXISTS `_d_pages_widgets`;
CREATE TABLE `_d_pages_widgets` (
  `ID` int(11) NOT NULL,
  `page_id` int(5) NOT NULL,
  `unique_id` varchar(10) NOT NULL,
  `i` varchar(14) NOT NULL DEFAULT '9999',
  `name` varchar(30) NOT NULL,
  `args` longtext NOT NULL,
  `native` varchar(20) DEFAULT NULL,
  `active` int(1) DEFAULT NULL,
  `time_update` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `time_add` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(1, 1, '98d9d12f6c', '1', 'search_form', '{\"wid_name\":\"search_form\",\"wid_title\":\"Search\",\"wid_sub_data\":\"Find Your Perfect Match in Seconds!\",\"wid_id\":\"98d9d12f6c\"}', NULL, NULL, NULL, '2023-12-06 02:09:15');
INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(2, 2, '6d5cf0be59', 'c74bc15ad7_1', 'cta', '{\"wid_name\":\"cta\",\"wid_title\":\"Setup\",\"wid_sub_data\":\"How to use RKHM?\",\"background_color\":\"linear-gradient(43deg, #22201d 0%, #009ad2 100%)\",\"font_size\":\"large\",\"img_place\":\"right\",\"height\":\"full\",\"btn_title_1\":\"Docs\",\"btn_link_1\":\"https:\\/\\/support.busyowl.co\\/documentation\\/setup101\",\"wid_id\":\"6d5cf0be59\"}', NULL, NULL, NULL, '2023-12-06 02:09:15');
INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(3, 2, 'ee276fb167', 'c74bc15ad7_0', 'cta', '{\"wid_name\":\"cta\",\"wid_title\":\"Ready to launch!\",\"wid_sub_data\":\"Strap in, folks! It&#039;s rocket time \\ud83d\\ude80\",\"wid_bg_img\":1,\"background_color\":\"radial-gradient(rgba(var(--bg_color),0.6), rgba(var(--bg_color),0.86))\",\"font_size\":\"vlarge\",\"img_place\":\"left\",\"height\":\"full\",\"wid_id\":\"ee276fb167\"}', NULL, NULL, NULL, '2023-12-06 02:09:15');
INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(4, 2, 'c74bc15ad7', '1', 'grid', '{\"wid_name\":\"grid\",\"fitMain\":1,\"columns\":\"8_4\",\"background_color\":\"linear-gradient(to right, #56ccf2, #2f80ed)\",\"wid_id\":\"c74bc15ad7\"}', NULL, NULL, NULL, '2023-12-06 02:09:15');
INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(5, 3, '2ae105eb7e', '1', 'cta', '{\"wid_name\":\"cta\",\"wid_title\":\"Sell your content\",\"wid_sub_data\":\"Verify your identity &amp; start earning money\",\"background_color\":\"linear-gradient(to right, #2193b0, #6dd5ed)\",\"font_color\":\"#fff\",\"font_size\":\"vlarge\",\"img\":2,\"img_place\":\"right\",\"height\":\"full\",\"btn_title_1\":\"Submit request\",\"btn_link_1\":\"user_verify?tab=artist\",\"wid_id\":\"2ae105eb7e\"}', NULL, NULL, NULL, '2023-12-06 02:09:15');
INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(6, 3, 'cac8631e14', '2', 'steps_list', '{\"wid_name\":\"steps_list\",\"wid_title\":\"Your Roadmap\",\"wid_sub_data\":\"How to earn money as an artist?\",\"features\":\"%7B%22a11d30c3%22%3A%7B%22icon%22%3A%22%22%2C%22title%22%3A%22Sign%20up%22%2C%22text%22%3A%22Sign%20up%20using%20your%20email%20address%22%7D%2C%2207ea9a2d%22%3A%7B%22icon%22%3A%22%22%2C%22title%22%3A%22Verify%22%2C%22text%22%3A%22Submit%20requested%20information%22%7D%2C%2252630d2b%22%3A%7B%22icon%22%3A%22%22%2C%22title%22%3A%22Wait%22%2C%22text%22%3A%22Wait%20for%20us%20to%20review%20your%20request%22%7D%2C%22a97b5205%22%3A%7B%22icon%22%3A%22%22%2C%22title%22%3A%22Upload%22%2C%22text%22%3A%22Upload%20your%20content%20%26%20put%20a%20price%20tag%20on%20them%22%7D%2C%229d2bd000%22%3A%7B%22icon%22%3A%22%22%2C%22title%22%3A%22Withdraw%22%2C%22text%22%3A%22Submit%20a%20request%20to%20withdraw%20your%20earned%20money%22%7D%7D\",\"wid_id\":\"cac8631e14\"}', NULL, NULL, NULL, '2023-12-06 02:09:15');
INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(7, 3, '2935ac5481', '3', 'm_artist', '{\"has_manager\":\"1\",\"order_by\":\"name\",\"wid_title\":\"Verified Artists\",\"wid_limit\":10,\"wid_type\":\"slider\",\"wid_slider_size\":\"medium\",\"wid_slider_rows\":1,\"wid_name\":\"m_artist\"}', NULL, NULL, NULL, '2023-12-06 02:09:15');
INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(8, 4, 'c89dc0c902', '1', 'text', '{\"wid_name\":\"text\",\"wid_id\":\"c89dc0c902\",\"editor_js\":\"{\\\"time\\\":1683628585966,\\\"blocks\\\":[{\\\"type\\\":\\\"paragraph\\\",\\\"data\\\":{\\\"text\\\":\\\"Welcome to our music sharing\\\\\\/streaming\\\\\\/selling platform! By using our platform, you agree to the following terms of usage:\\\"}},{\\\"type\\\":\\\"header\\\",\\\"data\\\":{\\\"text\\\":\\\"1. Use of the Platform\\\",\\\"level\\\":2}},{\\\"type\\\":\\\"paragraph\\\",\\\"data\\\":{\\\"text\\\":\\\"Our platform is designed to allow users to share, stream, and sell music. You may only use our platform for lawful purposes and in compliance with all applicable laws and regulations.\\\"}},{\\\"type\\\":\\\"header\\\",\\\"data\\\":{\\\"text\\\":\\\"2. User Accounts\\\",\\\"level\\\":2}},{\\\"type\\\":\\\"paragraph\\\",\\\"data\\\":{\\\"text\\\":\\\"To use our platform, you must create a user account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.\\\"}},{\\\"type\\\":\\\"header\\\",\\\"data\\\":{\\\"text\\\":\\\"3. Content\\\",\\\"level\\\":2}},{\\\"type\\\":\\\"paragraph\\\",\\\"data\\\":{\\\"text\\\":\\\"You are solely responsible for the content that you share, stream, or sell on our platform. You represent and warrant that you have all necessary rights to the content and that the content does not infringe on the intellectual property rights of any third party.\\\"}},{\\\"type\\\":\\\"header\\\",\\\"data\\\":{\\\"text\\\":\\\"4. Prohibited Activities\\\",\\\"level\\\":2}},{\\\"type\\\":\\\"paragraph\\\",\\\"data\\\":{\\\"text\\\":\\\"You may not use our platform to engage in any of the following activities:\\\"}},{\\\"type\\\":\\\"list\\\",\\\"data\\\":{\\\"style\\\":\\\"ordered\\\",\\\"items\\\":[\\\"Violating any laws or regulations\\\",\\\"Infringing on the intellectual property rights of any third party\\\",\\\"Uploading or sharing content that is illegal, offensive, or harmful\\\",\\\"Interfering with the proper functioning of the platform\\\",\\\"Attempting to gain unauthorized access to the platform or to other users\' accounts\\\"]}},{\\\"type\\\":\\\"header\\\",\\\"data\\\":{\\\"text\\\":\\\"5. Payment\\\",\\\"level\\\":2}},{\\\"type\\\":\\\"paragraph\\\",\\\"data\\\":{\\\"text\\\":\\\"If you sell music on our platform, you will receive payment for your sales in accordance with our payment policies. We reserve the right to withhold payment for any sales that violate our terms of usage.\\\"}},{\\\"type\\\":\\\"header\\\",\\\"data\\\":{\\\"text\\\":\\\"6. Termination\\\",\\\"level\\\":2}},{\\\"type\\\":\\\"paragraph\\\",\\\"data\\\":{\\\"text\\\":\\\"We may terminate your user account and\\\\\\/or access to our platform at any time and for any reason, without notice.\\\"}},{\\\"type\\\":\\\"header\\\",\\\"data\\\":{\\\"text\\\":\\\"7. Changes to the Terms\\\",\\\"level\\\":2}},{\\\"type\\\":\\\"paragraph\\\",\\\"data\\\":{\\\"text\\\":\\\"We reserve the right to modify these terms of usage at any time. Your continued use of our platform after any such modifications constitutes your acceptance of the updated terms\\\"}}],\\\"version\\\":\\\"2.26.5\\\",\\\"html\\\":\\\"<div class=\'editorjs_html_wrapper\'><p>Welcome to our music sharing\\\\\\/streaming\\\\\\/selling platform! By using our platform, you agree to the following terms of usage:<\\\\\\/p><h2>1. Use of the Platform<\\\\\\/h2><p>Our platform is designed to allow users to share, stream, and sell music. You may only use our platform for lawful purposes and in compliance with all applicable laws and regulations.<\\\\\\/p><h2>2. User Accounts<\\\\\\/h2><p>To use our platform, you must create a user account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.<\\\\\\/p><h2>3. Content<\\\\\\/h2><p>You are solely responsible for the content that you share, stream, or sell on our platform. You represent and warrant that you have all necessary rights to the content and that the content does not infringe on the intellectual property rights of any third party.<\\\\\\/p><h2>4. Prohibited Activities<\\\\\\/h2><p>You may not use our platform to engage in any of the following activities:<\\\\\\/p><ol><li>Violating any laws or regulations<\\\\\\/li><li>Infringing on the intellectual property rights of any third party<\\\\\\/li><li>Uploading or sharing content that is illegal, offensive, or harmful<\\\\\\/li><li>Interfering with the proper functioning of the platform<\\\\\\/li><li>Attempting to gain unauthorized access to the platform or to other users\' accounts<\\\\\\/li><\\\\\\/ol><h2>5. Payment<\\\\\\/h2><p>If you sell music on our platform, you will receive payment for your sales in accordance with our payment policies. We reserve the right to withhold payment for any sales that violate our terms of usage.<\\\\\\/p><h2>6. Termination<\\\\\\/h2><p>We may terminate your user account and\\\\\\/or access to our platform at any time and for any reason, without notice.<\\\\\\/p><h2>7. Changes to the Terms<\\\\\\/h2><p>We reserve the right to modify these terms of usage at any time. Your continued use of our platform after any such modifications constitutes your acceptance of the updated terms<\\\\\\/p><\\\\\\/div>\\\",\\\"files\\\":{\\\"images\\\":[],\\\"videos\\\":[]}}\"}', NULL, NULL, NULL, '2023-12-06 02:09:15');
INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(9, 2, '07e3de4c02', '3e92c18162_0', 'cta', '{\"wid_name\":\"cta\",\"wid_title\":\"Support\",\"wid_sub_data\":\"Need help? We&#039;ve got your app covered!\",\"font_size\":\"medium\",\"img_place\":\"left\",\"height\":\"auto\",\"btn_title_1\":\"Support Center\",\"btn_link_1\":\"https:\\/\\/support.busyowl.co\\/\",\"wid_id\":\"07e3de4c02\"}', NULL, NULL, NULL, '2023-12-06 02:09:15');
INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(10, 2, '0b4b1ad6aa', '3e92c18162_1', 'cta', '{\"wid_name\":\"cta\",\"wid_title\":\"Get Inspired\",\"wid_sub_data\":\"&quot;Export&quot; favorite page from demo site &amp; &quot;import&quot; to your app!\",\"font_size\":\"medium\",\"img_place\":\"left\",\"height\":\"auto\",\"btn_title_1\":\"Demo\",\"btn_link_1\":\"https:\\/\\/support.busyowl.co\\/documentation\\/demo\",\"wid_id\":\"0b4b1ad6aa\"}', NULL, NULL, NULL, '2023-12-06 02:09:15');
INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(11, 2, '3e92c18162', '2', 'grid', '{\"wid_name\":\"grid\",\"fitMain\":1,\"columns\":\"6_6\",\"wid_id\":\"3e92c18162\"}', NULL, NULL, NULL, '2023-12-06 02:09:15');
INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(12, 5, 'a3dd84adaf', '0', 'grid', '{\"wid_name\":\"grid\",\"fitMain\":1,\"columns\":\"4_4_4\",\"wid_id\":\"a3dd84adaf\"}', 'bigslider', 1, NULL, '2023-12-06 03:42:19');
INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(13, 5, '9e61e0ea19', 'a3dd84adaf_0', 'cta', '{\"wid_name\":\"cta\",\"wid_title\":\"Slider One\",\"wid_sub_data\":\"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&#039;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it\",\"background_img_url\":\"https:\\/\\/images.unsplash.com\\/photo-1537730748877-5d8fcd41a7ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80\",\"background_img_dim\":\"radial_med_high\",\"font_size\":\"vlarge\",\"img_place\":\"right\",\"height\":\"full\",\"btn_title_1\":\"Read more\",\"btn_link_1\":\"https:\\/\\/facebook.com\",\"wid_id\":\"9e61e0ea19\"}', 'bsi0', 1, NULL, '2023-12-06 03:42:19');
INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(14, 5, '1241087678', 'a3dd84adaf_1', 'cta', '{\"wid_name\":\"cta\",\"wid_title\":\"Slider Two\",\"wid_sub_data\":\"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&#039;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it\",\"background_img_url\":\"https:\\/\\/images.unsplash.com\\/photo-1516981442399-a91139e20ff8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80\",\"background_img_dim\":\"radial_med_high\",\"font_size\":\"vlarge\",\"img_place\":\"right\",\"height\":\"full\",\"btn_title_1\":\"Read more\",\"btn_link_1\":\"https:\\/\\/facebook.com\",\"btn_title_2\":\"Test\",\"btn_link_2\":\"https:\\/\\/facebook.com\",\"wid_id\":\"1241087678\"}', 'bsi1', 1, NULL, '2023-12-06 03:42:19');
INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(15, 5, 'b009665ab1', 'a3dd84adaf_2', 'cta', '{\"wid_name\":\"cta\",\"wid_title\":\"Slider Three\",\"wid_sub_data\":\"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&#039;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it\",\"background_img_url\":\"https:\\/\\/images.unsplash.com\\/photo-1531077435623-9520a54b5046?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80\",\"background_img_dim\":\"radial_med_high\",\"font_size\":\"vlarge\",\"img_place\":\"right\",\"height\":\"full\",\"btn_title_1\":\"Read more\",\"btn_link_1\":\"https:\\/\\/google.com\",\"wid_id\":\"b009665ab1\"}', 'bsi2', 1, NULL, '2023-12-06 03:42:19');
INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(16, 5, '6febe3c852', '99', 'm_album', '{\"wid_name\":\"m_album\",\"wid_title\":\"\",\"order_by\":\"title\",\"wid_limit\":18,\"wid_type\":\"slider\",\"wid_slider_size\":\"large\",\"wid_slider_rows\":1,\"wid_id\":\"6febe3c852\"}', 'footer', 1, NULL, '2023-12-06 03:42:19');
INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(17, 5, '4f4a533c78', '2', 'm_track', '{\"wid_name\":\"m_track\",\"order_by\":\"title\",\"wid_title\":\"Track list #1\",\"wid_sub_data\":\"Title #2 be here!\",\"wid_limit\":10,\"wid_type\":\"slider\",\"wid_slider_size\":\"medium\",\"wid_slider_rows\":1,\"wid_id\":\"4f4a533c78\"}', 'tl1', 1, NULL, '2023-12-06 03:42:19');
INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(18, 5, '27837a7056', '3', 'm_track', '{\"wid_name\":\"m_track\",\"order_by\":\"title\",\"wid_title\":\"Track list #2\",\"wid_sub_data\":\"Title #2 be here!\",\"wid_limit\":10,\"wid_type\":\"slider\",\"wid_slider_size\":\"medium\",\"wid_slider_rows\":1,\"wid_id\":\"27837a7056\"}', 'tl2', 1, NULL, '2023-12-06 03:42:19');
INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(19, 5, 'ad64856960', '4', 'm_track', '{\"wid_name\":\"m_track\",\"order_by\":\"title\",\"wid_title\":\"Track list #3\",\"wid_sub_data\":\"Title #2 be here!\",\"wid_limit\":10,\"wid_type\":\"slider\",\"wid_slider_size\":\"medium\",\"wid_slider_rows\":1,\"wid_id\":\"ad64856960\"}', 'tl3', 1, NULL, '2023-12-06 03:42:19');
INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(20, 5, 'b888719b34', '5', 'm_track', '{\"wid_name\":\"m_track\",\"order_by\":\"title\",\"wid_title\":\"Track list #4\",\"wid_sub_data\":\"Title #2 be here!\",\"wid_limit\":10,\"wid_type\":\"slider\",\"wid_slider_size\":\"medium\",\"wid_slider_rows\":1,\"wid_id\":\"b888719b34\"}', 'tl4', 1, NULL, '2023-12-06 03:42:19');
INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(21, 5, 'e0e812c049', '6', 'cta', '{\"wid_name\":\"cta\",\"wid_title\":\"Call to action\",\"wid_sub_data\":\"Ask users to do smth like signing up!\",\"background_img_url\":\"https:\\/\\/images.unsplash.com\\/photo-1566055909643-a51b4271aa47?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80\",\"background_img_dim\":\"radial_high_high\",\"font_color\":\"#fff\",\"font_size\":\"vlarge\",\"img_place\":\"left\",\"height\":\"auto\",\"btn_title_1\":\"Click me\",\"btn_link_1\":\"https:\\/\\/google.com\",\"wid_id\":\"e0e812c049\"}', 'midcta', 1, NULL, '2023-12-06 03:42:19');
INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(22, 5, '3dd8e50dad', '7', 'grid', '{\"wid_name\":\"grid\",\"columns\":\"4_4_4\",\"wid_id\":\"3dd8e50dad\"}', 'footgrid', 1, NULL, '2023-12-06 03:42:19');
INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(23, 5, 'd74b0f00f6', '3dd8e50dad_0', 'm_track', '{\"wid_name\":\"m_track\",\"order_by\":\"s_likes\",\"wid_table_column\":[\"s_likes\"],\"wid_table_title\":\"Likes\",\"wid_title\":\"Track table #1\",\"wid_sub_data\":\"Title #2 be here!\",\"wid_pagination\":true,\"wid_limit\":10,\"wid_type\":\"table\",\"wid_id\":\"d74b0f00f6\"}', 'tt1', 1, NULL, '2023-12-06 03:42:19');
INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(24, 5, 'd16ff3cc3c', '3dd8e50dad_1', 'm_track', '{\"wid_name\":\"m_track\",\"order_by\":\"s_plays\",\"wid_table_column\":[\"s_plays\"],\"wid_table_title\":\"Streams\",\"wid_title\":\"Track table #2\",\"wid_sub_data\":\"Title #2 be here!\",\"wid_pagination\":true,\"wid_limit\":10,\"wid_type\":\"table\",\"wid_id\":\"d16ff3cc3c\"}', 'tt2', 1, NULL, '2023-12-06 03:42:19');
INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(25, 5, '98052efaf3', '3dd8e50dad_2', 'm_track', '{\"wid_name\":\"m_track\",\"order_by\":\"title\",\"wid_table_column\":[\"duration\"],\"wid_table_title\":\"Duration\",\"wid_title\":\"Track table #3\",\"wid_sub_data\":\"Title #2 be here!\",\"wid_pagination\":true,\"wid_limit\":10,\"wid_type\":\"table\",\"wid_id\":\"98052efaf3\"}', 'tt3', 1, NULL, '2023-12-06 03:42:19');
INSERT INTO `_d_pages_widgets` (`ID`, `page_id`, `unique_id`, `i`, `name`, `args`, `native`, `active`, `time_update`, `time_add`) VALUES(26, 2, '6cfec1db12', '3', 'm_track', '{\"wid_name\":\"m_track\",\"order_by\":\"title\",\"wid_title\":\"Sample Tracks\",\"wid_sub_data\":\"Royalty free music\",\"wid_limit\":10,\"wid_type\":\"slider\",\"wid_slider_size\":\"medium\",\"wid_slider_rows\":1,\"wid_id\":\"6cfec1db12\"}', NULL, 0, '2023-12-06 05:02:11', '2023-12-06 05:02:11');

DROP TABLE IF EXISTS `_d_search_history`;
CREATE TABLE `_d_search_history` (
  `ID` int(11) NOT NULL,
  `hash` varchar(32) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `user_ip` varchar(40) DEFAULT NULL,
  `query` tinytext NOT NULL,
  `token` tinytext NOT NULL,
  `object_type` varchar(20) DEFAULT NULL,
  `target_object_type` varchar(30) DEFAULT NULL,
  `target_object_id` int(11) DEFAULT NULL,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_exe` float DEFAULT NULL,
  `time_redirect` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_d_search_history_terms`;
CREATE TABLE `_d_search_history_terms` (
  `history_id` int(11) NOT NULL,
  `term_group` tinyint(4) NOT NULL,
  `term_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_d_search_postings`;
CREATE TABLE `_d_search_postings` (
  `term_id` int(11) DEFAULT NULL,
  `object_type` varchar(20) NOT NULL,
  `object_id` int(11) NOT NULL,
  `sugg_id` int(11) DEFAULT NULL,
  `score` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_d_search_suggestions`;
CREATE TABLE `_d_search_suggestions` (
  `ID` int(11) NOT NULL,
  `string` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_d_search_terms`;
CREATE TABLE `_d_search_terms` (
  `ID` int(11) NOT NULL,
  `term` varchar(150) NOT NULL,
  `count` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_u_actions`;
CREATE TABLE `_u_actions` (
  `ID` int(7) NOT NULL,
  `hash` varchar(32) NOT NULL,
  `user_id` int(7) NOT NULL,
  `type` varchar(60) NOT NULL,
  `object_name` varchar(50) NOT NULL,
  `object_id` int(11) NOT NULL,
  `related_object_type` varchar(50) DEFAULT NULL,
  `related_object_id` int(11) DEFAULT NULL,
  `extra_data` mediumblob DEFAULT NULL,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_u_list`;
CREATE TABLE `_u_list` (
  `ID` int(7) NOT NULL,
  `hash` varchar(32) NOT NULL,
  `username` varchar(50) NOT NULL,
  `name` varchar(60) DEFAULT NULL,
  `password` varchar(60) NOT NULL,
  `email` varchar(150) NOT NULL,
  `role_ids` tinytext DEFAULT NULL,
  `external_addresses` text DEFAULT NULL,
  `avatar_id` int(11) DEFAULT NULL,
  `bg_img_id` int(11) DEFAULT NULL,
  `fund` float DEFAULT 0,
  `fund_by_deposit` float DEFAULT 0,
  `fund_by_revenue` float DEFAULT 0,
  `fund_by_referring` float NOT NULL DEFAULT 0,
  `s_posts` int(7) NOT NULL DEFAULT 0,
  `s_followers` int(11) DEFAULT 0,
  `s_followings` int(5) DEFAULT 0,
  `s_subscriptions` int(7) NOT NULL DEFAULT 0,
  `s_likes` int(7) DEFAULT 0,
  `s_playlists` int(5) DEFAULT 0,
  `s_playlists_followers` int(7) DEFAULT 0,
  `s_payments` int(11) NOT NULL DEFAULT 0,
  `s_transactions` int(11) NOT NULL DEFAULT 0,
  `s_managed_artists` int(3) NOT NULL DEFAULT 0,
  `feed_setting` tinytext DEFAULT NULL,
  `not_setting` tinytext DEFAULT NULL,
  `email_setting` tinytext DEFAULT NULL,
  `time_add` timestamp NULL DEFAULT current_timestamp(),
  `time_verify` timestamp NULL DEFAULT NULL,
  `time_online` timestamp NULL DEFAULT NULL,
  `time_notified` timestamp NULL DEFAULT NULL,
  `time_verify_try` timestamp NULL DEFAULT NULL,
  `verification_code` varchar(32) DEFAULT NULL,
  `extraData` mediumblob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_u_notifications`;
CREATE TABLE `_u_notifications` (
  `ID` int(11) NOT NULL,
  `hook` varchar(100) NOT NULL,
  `user_id` int(7) DEFAULT NULL,
  `target_email` varchar(200) DEFAULT NULL,
  `target_push_count` int(3) DEFAULT NULL,
  `triggerer_object` varchar(60) DEFAULT NULL,
  `triggerer_id` int(11) DEFAULT NULL,
  `source_object` varchar(60) DEFAULT NULL,
  `source_id` int(11) DEFAULT NULL,
  `message_type` varchar(100) NOT NULL,
  `message_texts` longtext DEFAULT NULL CHECK (json_valid(`message_texts`)),
  `message_params` longtext DEFAULT NULL CHECK (json_valid(`message_params`)),
  `message_image` text DEFAULT NULL,
  `message_link` text DEFAULT NULL,
  `method_email` int(1) DEFAULT 0,
  `method_push` int(1) DEFAULT 0,
  `extra` longtext DEFAULT NULL CHECK (json_valid(`extra`)),
  `time_add` timestamp NULL DEFAULT current_timestamp(),
  `time_seen` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_u_payments`;
CREATE TABLE `_u_payments` (
  `ID` int(11) NOT NULL,
  `_num` varchar(12) NOT NULL,
  `_key` varchar(32) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` float NOT NULL,
  `currency` varchar(3) NOT NULL,
  `data` mediumtext DEFAULT NULL,
  `mode` varchar(10) NOT NULL,
  `gateway_name` varchar(30) NOT NULL,
  `gateway_id` varchar(100) DEFAULT NULL,
  `gateway_amount` float DEFAULT NULL,
  `gateway_currency` varchar(3) DEFAULT NULL,
  `gateway_data` mediumtext DEFAULT NULL,
  `sub_id` varchar(60) DEFAULT NULL,
  `purchase_data` longtext DEFAULT NULL,
  `paid` int(1) NOT NULL DEFAULT 0,
  `approved` int(1) NOT NULL DEFAULT 0,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_pay` timestamp NULL DEFAULT NULL,
  `time_approve` timestamp NULL DEFAULT NULL,
  `time_reject` timestamp NULL DEFAULT NULL,
  `time_recur` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_u_playlists`;
CREATE TABLE `_u_playlists` (
  `ID` int(11) NOT NULL,
  `hash` varchar(32) NOT NULL,
  `user_id` int(11) NOT NULL,
  `cover_id` int(11) DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `private` int(1) NOT NULL DEFAULT 0,
  `object_type` varchar(50) DEFAULT NULL,
  `s_items` int(4) NOT NULL DEFAULT 0,
  `s_subscribers` int(9) NOT NULL DEFAULT 0,
  `s_views` int(11) NOT NULL DEFAULT 0,
  `s_views_unique` int(11) NOT NULL DEFAULT 0,
  `extra_data` longtext DEFAULT NULL,
  `spotify_id` varchar(30) DEFAULT NULL,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_update` timestamp NOT NULL DEFAULT current_timestamp(),
  `seo_url` varchar(100) NOT NULL,
  `seo_image` int(11) DEFAULT NULL,
  `seo_data` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_u_properties`;
CREATE TABLE `_u_properties` (
  `ID` int(7) NOT NULL,
  `hash` varchar(32) NOT NULL,
  `user_id` int(7) NOT NULL,
  `type` varchar(60) NOT NULL,
  `object_name` varchar(50) NOT NULL,
  `object_id` int(11) NOT NULL,
  `related_object_name` varchar(50) DEFAULT NULL,
  `related_object_id` int(11) DEFAULT NULL,
  `i` int(4) DEFAULT NULL,
  `extra_data` tinyblob DEFAULT NULL,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `_u_properties` (`ID`, `hash`, `user_id`, `type`, `object_name`, `object_id`, `related_object_name`, `related_object_id`, `i`, `extra_data`, `time_add`) VALUES(1, 'ded68e9a281ffe362cac7d5ca3c2345e', 1, 'upload', 'm_album', 1, NULL, NULL, NULL, NULL, '2023-12-06 03:29:41');
INSERT INTO `_u_properties` (`ID`, `hash`, `user_id`, `type`, `object_name`, `object_id`, `related_object_name`, `related_object_id`, `i`, `extra_data`, `time_add`) VALUES(2, '11c762f3ede21db2100921ad2c8bee4f', 1, 'upload', 'm_track', 1, NULL, NULL, NULL, NULL, '2023-12-06 03:29:42');
INSERT INTO `_u_properties` (`ID`, `hash`, `user_id`, `type`, `object_name`, `object_id`, `related_object_name`, `related_object_id`, `i`, `extra_data`, `time_add`) VALUES(3, '3090eb9a1a138842fc47da9555bca53c', 1, 'upload', 'm_album', 2, NULL, NULL, NULL, NULL, '2023-12-06 03:29:44');
INSERT INTO `_u_properties` (`ID`, `hash`, `user_id`, `type`, `object_name`, `object_id`, `related_object_name`, `related_object_id`, `i`, `extra_data`, `time_add`) VALUES(4, '145fc24acc8e19902a585cf076de0a7c', 1, 'upload', 'm_track', 2, NULL, NULL, NULL, NULL, '2023-12-06 03:29:44');
INSERT INTO `_u_properties` (`ID`, `hash`, `user_id`, `type`, `object_name`, `object_id`, `related_object_name`, `related_object_id`, `i`, `extra_data`, `time_add`) VALUES(5, 'f3d73904e606e9df7f76e7446eacbb3d', 1, 'upload', 'm_album', 3, NULL, NULL, NULL, NULL, '2023-12-06 03:30:16');
INSERT INTO `_u_properties` (`ID`, `hash`, `user_id`, `type`, `object_name`, `object_id`, `related_object_name`, `related_object_id`, `i`, `extra_data`, `time_add`) VALUES(6, '5d4100653ef10cbc005574add5f8744d', 1, 'upload', 'm_track', 3, NULL, NULL, NULL, NULL, '2023-12-06 03:30:16');
INSERT INTO `_u_properties` (`ID`, `hash`, `user_id`, `type`, `object_name`, `object_id`, `related_object_name`, `related_object_id`, `i`, `extra_data`, `time_add`) VALUES(7, 'f4a93b8cbc831d0c15194b60d0416fb9', 1, 'upload', 'm_album', 4, NULL, NULL, NULL, NULL, '2023-12-06 03:30:34');
INSERT INTO `_u_properties` (`ID`, `hash`, `user_id`, `type`, `object_name`, `object_id`, `related_object_name`, `related_object_id`, `i`, `extra_data`, `time_add`) VALUES(8, '3717606ebcb7cf948c763d52067e47cd', 1, 'upload', 'm_track', 4, NULL, NULL, NULL, NULL, '2023-12-06 03:30:35');
INSERT INTO `_u_properties` (`ID`, `hash`, `user_id`, `type`, `object_name`, `object_id`, `related_object_name`, `related_object_id`, `i`, `extra_data`, `time_add`) VALUES(9, '85248ee6b0daccbd87ad69aee426d3e0', 1, 'upload', 'm_album', 5, NULL, NULL, NULL, NULL, '2023-12-06 03:30:52');
INSERT INTO `_u_properties` (`ID`, `hash`, `user_id`, `type`, `object_name`, `object_id`, `related_object_name`, `related_object_id`, `i`, `extra_data`, `time_add`) VALUES(10, 'a0bd9f1a378ca41261e9f96cec8cc1c1', 1, 'upload', 'm_track', 5, NULL, NULL, NULL, NULL, '2023-12-06 03:30:52');
INSERT INTO `_u_properties` (`ID`, `hash`, `user_id`, `type`, `object_name`, `object_id`, `related_object_name`, `related_object_id`, `i`, `extra_data`, `time_add`) VALUES(11, 'd08b6d8f71375a16e3bbfe58355fc12f', 1, 'upload', 'm_album', 6, NULL, NULL, NULL, NULL, '2023-12-06 03:31:16');
INSERT INTO `_u_properties` (`ID`, `hash`, `user_id`, `type`, `object_name`, `object_id`, `related_object_name`, `related_object_id`, `i`, `extra_data`, `time_add`) VALUES(12, 'fcc4164e8e6d4f11009ec9d730d44edd', 1, 'upload', 'm_track', 6, NULL, NULL, NULL, NULL, '2023-12-06 03:31:16');
INSERT INTO `_u_properties` (`ID`, `hash`, `user_id`, `type`, `object_name`, `object_id`, `related_object_name`, `related_object_id`, `i`, `extra_data`, `time_add`) VALUES(13, 'a3ab4bdeae78c4181fa23f29ae3e8d91', 1, 'upload', 'm_album', 7, NULL, NULL, NULL, NULL, '2023-12-06 03:31:34');
INSERT INTO `_u_properties` (`ID`, `hash`, `user_id`, `type`, `object_name`, `object_id`, `related_object_name`, `related_object_id`, `i`, `extra_data`, `time_add`) VALUES(14, '566630b52d055e6f9ae0cdcb7efa334a', 1, 'upload', 'm_track', 7, NULL, NULL, NULL, NULL, '2023-12-06 03:31:35');

DROP TABLE IF EXISTS `_u_push_subs`;
CREATE TABLE `_u_push_subs` (
  `ID` int(11) NOT NULL,
  `user_id` int(7) NOT NULL,
  `data` longtext NOT NULL CHECK (json_valid(`data`)),
  `data_hash` varchar(32) NOT NULL,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_u_relations`;
CREATE TABLE `_u_relations` (
  `user_id` int(9) NOT NULL,
  `target_id` int(9) NOT NULL,
  `type` varchar(10) NOT NULL,
  `i` int(3) DEFAULT NULL,
  `time_add` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_u_reports`;
CREATE TABLE `_u_reports` (
  `ID` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `user_ip` varchar(50) NOT NULL,
  `object_type` varchar(20) NOT NULL,
  `object_id` int(11) NOT NULL,
  `source_id` int(11) NOT NULL,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_u_requests`;
CREATE TABLE `_u_requests` (
  `ID` int(6) NOT NULL,
  `type` varchar(30) NOT NULL,
  `user_id` int(7) NOT NULL,
  `real_name` varchar(150) NOT NULL,
  `extra_data` longtext DEFAULT NULL CHECK (json_valid(`extra_data`)),
  `additional_data` mediumtext NOT NULL,
  `sta` int(1) DEFAULT 0,
  `time_add` timestamp NULL DEFAULT current_timestamp(),
  `time_review` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_u_roles`;
CREATE TABLE `_u_roles` (
  `ID` int(3) NOT NULL,
  `name` varchar(50) NOT NULL,
  `comment` text DEFAULT NULL,
  `type` varchar(20) NOT NULL,
  `def` int(1) NOT NULL DEFAULT 0,
  `bofAdmin_access` longtext DEFAULT NULL,
  `access` longtext DEFAULT NULL,
  `data` longtext DEFAULT NULL,
  `comparators` longtext DEFAULT NULL,
  `s_users` int(11) NOT NULL DEFAULT 0,
  `time_add` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `_u_roles` (`ID`, `name`, `comment`, `type`, `def`, `bofAdmin_access`, `access`, `data`, `comparators`, `s_users`, `time_add`) VALUES(1, 'Guests', 'Not logged-in visitors', 'guest', 1, '[]', NULL, '{\"guest\":{\"guest_ads\":true,\"guest_download\":true,\"guest_download_in\":true,\"guest_download_out\":true,\"guest_language\":true,\"guest_signup\":true,\"guest_signup_verify\":true,\"guest_player\":\"audio_quality_1;audio_quality_2;audio_quality_3;audio_quality_4;audio_quality_5;video_quality_1;video_quality_2;video_quality_3;video_quality_4;video_quality_5;soundcloud;youtube\",\"guest_download_types\":\"audio_quality_1;audio_quality_2;audio_quality_3;audio_quality_4;audio_quality_5;video_quality_1;video_quality_2;video_quality_3;video_quality_4;video_quality_5\"},\"podcaster\":[],\"artist\":[]}', NULL, 0, '2021-12-28 19:06:56');
INSERT INTO `_u_roles` (`ID`, `name`, `comment`, `type`, `def`, `bofAdmin_access`, `access`, `data`, `comparators`, `s_users`, `time_add`) VALUES(2, 'Users', 'Logged-in users\r\nDefault role for new users', 'user', 1, '[]', NULL, '{\"user\":{\"user_ads\":true,\"user_language\":true,\"user_download\":true,\"user_download_in\":true,\"user_download_out\":true,\"user_upload\":true,\"user_upload_music\":true,\"user_upload_music_types\":\"audio;video;soundcloud;youtube\",\"user_upload_podcast\":true,\"user_upload_podcast_types\":\"audio;video;youtube\",\"user_premium\":\"none\",\"user_premium_b_post\":false,\"user_premium_p_podcaster\":false,\"user_premium_p_show\":false,\"user_premium_p_tag\":false,\"user_premium_p_category\":false,\"user_premium_m_artist\":false,\"user_premium_m_genre\":false,\"user_premium_m_tag\":false,\"user_player\":\"audio_quality_1;audio_quality_2;audio_quality_3;audio_quality_4;audio_quality_5;video_quality_1;video_quality_2;video_quality_3;video_quality_4;video_quality_5;soundcloud;youtube\",\"user_download_types\":\"audio_quality_1;audio_quality_2;audio_quality_3;audio_quality_4;audio_quality_5;video_quality_1;video_quality_2;video_quality_3;video_quality_4;video_quality_5\",\"user_p_download_types\":null,\"user_p_player\":null},\"podcaster\":[],\"artist\":[]}', NULL, 186, '2021-12-28 20:34:07');
INSERT INTO `_u_roles` (`ID`, `name`, `comment`, `type`, `def`, `bofAdmin_access`, `access`, `data`, `comparators`, `s_users`, `time_add`) VALUES(3, 'Moderators', 'Logged-in users with limited access to admin', 'moderator', 1, '{\"objects\":[\"language\"],\"objects_args\":{\"language\":{\"new\":true,\"list\":true}},\"type\":\"all\"}', NULL, '{\"podcaster\":[]}', NULL, 0, '2021-12-28 20:39:43');
INSERT INTO `_u_roles` (`ID`, `name`, `comment`, `type`, `def`, `bofAdmin_access`, `access`, `data`, `comparators`, `s_users`, `time_add`) VALUES(4, 'Admins', 'Logged-in super heroes', 'admin', 1, NULL, NULL, NULL, NULL, 1, '2021-12-28 20:41:00');
INSERT INTO `_u_roles` (`ID`, `name`, `comment`, `type`, `def`, `bofAdmin_access`, `access`, `data`, `comparators`, `s_users`, `time_add`) VALUES(5, 'Artist Managers', 'Default `Artist Manager` role', 'artist', 1, '[]', NULL, '{\"artist\":{\"fixed_fee\":0,\"dyna_fee\":30,\"streaming_royalty\":0.001},\"affiliate\":[]}', NULL, 0, '2023-12-06 02:09:23');

DROP TABLE IF EXISTS `_u_setting`;
CREATE TABLE `_u_setting` (
  `ID` int(11) NOT NULL,
  `user_id` int(7) NOT NULL,
  `type` varchar(20) NOT NULL DEFAULT 'raw',
  `var` varchar(40) NOT NULL,
  `val` longtext NOT NULL,
  `time_add` timestamp NULL DEFAULT current_timestamp(),
  `time_update` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_u_subs`;
CREATE TABLE `_u_subs` (
  `ID` int(11) NOT NULL,
  `user_id` int(7) NOT NULL,
  `subs_plan_id` int(3) NOT NULL,
  `subs_plan_time_range` varchar(20) NOT NULL,
  `subs_plan_price` float DEFAULT 0,
  `time_purchased` timestamp NULL DEFAULT current_timestamp(),
  `payment_id` int(11) DEFAULT NULL,
  `payment_time` timestamp NULL DEFAULT NULL,
  `payment_count` int(11) NOT NULL DEFAULT 0,
  `gateway_name` varchar(30) DEFAULT NULL,
  `gateway_sub_id` varchar(100) DEFAULT NULL,
  `gateway_time_recur` timestamp NULL DEFAULT NULL,
  `time_expire` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_u_subs_plans`;
CREATE TABLE `_u_subs_plans` (
  `ID` int(3) NOT NULL,
  `hash` varchar(32) NOT NULL,
  `name` varchar(100) NOT NULL,
  `comment` tinytext NOT NULL,
  `detail` mediumtext NOT NULL,
  `prices` mediumtext DEFAULT NULL,
  `discount` float DEFAULT NULL,
  `target_role_id` int(3) NOT NULL,
  `free` int(1) NOT NULL DEFAULT 0,
  `active` int(1) DEFAULT 1,
  `priority` int(3) NOT NULL DEFAULT 1,
  `translations` longtext DEFAULT NULL CHECK (json_valid(`translations`)),
  `time_add` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_u_transactions`;
CREATE TABLE `_u_transactions` (
  `ID` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_fund` float NOT NULL,
  `amount` float NOT NULL,
  `currency` varchar(3) DEFAULT NULL,
  `revenue` double NOT NULL DEFAULT 0,
  `type` varchar(30) NOT NULL,
  `object_type` varchar(50) DEFAULT NULL,
  `object_id` int(11) DEFAULT NULL,
  `data` text DEFAULT NULL,
  `time_add` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

DROP TABLE IF EXISTS `_u_withdrawal`;
CREATE TABLE `_u_withdrawal` (
  `ID` int(6) NOT NULL,
  `user_id` int(7) NOT NULL,
  `amount` float NOT NULL,
  `receiver` varchar(200) DEFAULT NULL,
  `additional_data` longtext DEFAULT NULL,
  `sta` int(1) NOT NULL DEFAULT 1,
  `time_add` timestamp NULL DEFAULT current_timestamp(),
  `time_review` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


ALTER TABLE `_bof_ads`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `type` (`type`),
  ADD KEY `place_id` (`place_id`),
  ADD KEY `active` (`active`),
  ADD KEY `fund_remain` (`fund_remain`),
  ADD KEY `fund_limit` (`fund_limit`),
  ADD KEY `fund_spent_day` (`fund_spent_day`),
  ADD KEY `fund_spent_day_code` (`fund_spent_day_code`);

ALTER TABLE `_bof_blacklist`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `object_type_2` (`object_type`,`code`),
  ADD KEY `object_type` (`object_type`),
  ADD KEY `code` (`code`);

ALTER TABLE `_bof_cache_db`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `query_hash` (`query_hash`),
  ADD KEY `params_hash` (`params_hash`),
  ADD KEY `__select` (`query_hash`,`params_hash`,`time_add`) USING BTREE,
  ADD KEY `time_add` (`time_add`),
  ADD KEY `time_expire` (`time_expire`);

ALTER TABLE `_bof_cache_files_access`
  ADD KEY `object_type` (`object_type`,`object_hash`,`source_hash`,`path_hash`,`key1`,`key2`,`key3`),
  ADD KEY `time_expire` (`time_expire`),
  ADD KEY `time_add` (`time_add`);

ALTER TABLE `_bof_cache_sessions`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `session_id` (`session_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `active` (`active`);

ALTER TABLE `_bof_cache_sessions_admin`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `session_id` (`session_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `active` (`active`);

ALTER TABLE `_bof_cache_stream_royalties`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `target_id` (`target_id`),
  ADD KEY `time_end` (`time_end`),
  ADD KEY `target_type` (`target_type`,`target_id`);

ALTER TABLE `_bof_cache_unsubscribe_links`
  ADD KEY `time_add` (`time_add`),
  ADD KEY `time_used` (`time_used`),
  ADD KEY `key1` (`key1`,`key2`,`key3`);

ALTER TABLE `_bof_currencies`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `iso_code` (`iso_code`),
  ADD KEY `active` (`active`),
  ADD KEY `_default` (`_default`),
  ADD KEY `time_add` (`time_add`);

ALTER TABLE `_bof_files`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `pass` (`pass`),
  ADD KEY `type` (`type`),
  ADD KEY `host_id` (`host_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `used` (`used`),
  ADD KEY `object_type` (`object_type`),
  ADD KEY `time_add` (`time_add`),
  ADD KEY `time_used` (`time_moved`),
  ADD KEY `used_in_object` (`used_in_object`),
  ADD KEY `dest_host_id` (`dest_host_id`),
  ADD KEY `type_2` (`type`);

ALTER TABLE `_bof_files_hosts`
  ADD PRIMARY KEY (`ID`);

ALTER TABLE `_bof_log_ai_fees`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `service` (`service`),
  ADD KEY `ai` (`ai`),
  ADD KEY `action` (`action`),
  ADD KEY `fee` (`fee`),
  ADD KEY `time_add` (`time_add`);

ALTER TABLE `_bof_log_api_requests`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ip` (`ip`),
  ADD KEY `time_add` (`time_add`),
  ADD KEY `page_type` (`endpoint_name`),
  ADD KEY `request_sessid` (`request_sessid`),
  ADD KEY `object_type` (`object_type`,`object_hash`),
  ADD KEY `object_type_2` (`object_type`,`object_id`),
  ADD KEY `bofClient_slug` (`bofClient_slug`),
  ADD KEY `endpoint_name` (`endpoint_name`,`user_id`,`object_type`,`bofClient_slug`);

ALTER TABLE `_bof_log_api_requests_admin`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ip` (`ip`),
  ADD KEY `time_add` (`time_add`),
  ADD KEY `page_type` (`endpoint_name`),
  ADD KEY `request_sessid` (`request_sessid`);

ALTER TABLE `_bof_log_cronjob_g`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `PID` (`PID`),
  ADD KEY `code` (`code`),
  ADD KEY `sta` (`sta`),
  ADD KEY `time_start` (`time_start`),
  ADD KEY `time_end` (`time_end`);

ALTER TABLE `_bof_log_cronjob_p`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `PID` (`PID`),
  ADD KEY `GID` (`GID`),
  ADD KEY `time_add` (`time_add`);

ALTER TABLE `_bof_log_curls`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `hook` (`hook`),
  ADD KEY `hook_2` (`hook`,`time_start`),
  ADD KEY `response_body_size` (`response_body_size`,`time_start`),
  ADD KEY `hook_3` (`hook`,`response_header_code`,`time_start`);

ALTER TABLE `_bof_log_db`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `exe_time` (`exe_time`),
  ADD KEY `table` (`table`),
  ADD KEY `action` (`action`),
  ADD KEY `time_add` (`time_start`),
  ADD KEY `critical` (`critical`);

ALTER TABLE `_bof_log_errors`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `time_add` (`time_add`),
  ADD KEY `bof_version` (`bof_version`);

ALTER TABLE `_bof_log_ips`
  ADD PRIMARY KEY (`IP`),
  ADD KEY `time_expire` (`time_expire`),
  ADD KEY `time_add` (`time_add`);

ALTER TABLE `_bof_log_requests`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ip` (`ip`),
  ADD KEY `time_add` (`time_add`),
  ADD KEY `page_type` (`endpoint_name`),
  ADD KEY `request_sessid` (`request_sessid`),
  ADD KEY `agent_type` (`agent_type`),
  ADD KEY `agent_os` (`agent_os`),
  ADD KEY `agent_browser` (`agent_browser`);

ALTER TABLE `_bof_log_requests_admin`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ip` (`ip`),
  ADD KEY `time_add` (`time_add`),
  ADD KEY `page_type` (`endpoint_name`),
  ADD KEY `request_sessid` (`request_sessid`),
  ADD KEY `agent_type` (`agent_type`),
  ADD KEY `agent_os` (`agent_os`),
  ADD KEY `agent_browser` (`agent_browser`);

ALTER TABLE `_bof_notification`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `hook` (`hook`),
  ADD KEY `time_add` (`time_add`);

ALTER TABLE `_bof_plug_logs`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `process_id` (`process_id`),
  ADD KEY `time_add` (`time_add`);

ALTER TABLE `_bof_plug_processes`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `time_add` (`time_add`),
  ADD KEY `time_start` (`time_start`);

ALTER TABLE `_bof_setting`
  ADD PRIMARY KEY (`var`);

ALTER TABLE `_c_b_categories`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `seo_url` (`seo_url`),
  ADD UNIQUE KEY `hash` (`hash`),
  ADD KEY `s_views` (`s_views`),
  ADD KEY `s_views_unique` (`s_views_unique`),
  ADD KEY `s_posts` (`s_posts`),
  ADD KEY `code` (`code`),
  ADD KEY `time_add` (`time_add`);

ALTER TABLE `_c_b_posts`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `url` (`seo_url`),
  ADD UNIQUE KEY `hash` (`hash`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `time_add` (`time_add`),
  ADD KEY `time_edit` (`time_edit`),
  ADD KEY `s_views` (`s_views`),
  ADD KEY `s_views_unique` (`s_views_unique`),
  ADD KEY `s_shares` (`s_shares`),
  ADD KEY `s_categories` (`s_categories`),
  ADD KEY `active` (`active`);

ALTER TABLE `_c_b_posts_relations`
  ADD PRIMARY KEY (`post_id`,`target_id`,`type`),
  ADD KEY `ID1` (`post_id`,`type`),
  ADD KEY `ID2` (`target_id`,`type`);

ALTER TABLE `_c_b_tags`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `seo_url` (`seo_url`),
  ADD UNIQUE KEY `hash` (`hash`),
  ADD KEY `code` (`code`),
  ADD KEY `s_views` (`s_views`),
  ADD KEY `s_views_unique` (`s_views_unique`),
  ADD KEY `s_posts` (`s_posts`),
  ADD KEY `time_add` (`time_add`);

ALTER TABLE `_c_m_albums`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `hash` (`hash`),
  ADD UNIQUE KEY `code` (`code`),
  ADD UNIQUE KEY `seo_url` (`seo_url`),
  ADD KEY `type` (`type`),
  ADD KEY `price` (`price`),
  ADD KEY `explicit` (`explicit`),
  ADD KEY `artist_id` (`artist_id`),
  ADD KEY `user_id` (`uploader_id`),
  ADD KEY `spotify_id` (`spotify_id`),
  ADD KEY `s_views` (`s_views`),
  ADD KEY `s_views_unique` (`s_views_unique`),
  ADD KEY `s_likes` (`s_likes`),
  ADD KEY `s_reposts` (`s_reposts`),
  ADD KEY `s_comments` (`s_comments`),
  ADD KEY `s_sales` (`s_sales`),
  ADD KEY `s_shares` (`s_shares`),
  ADD KEY `s_popularity` (`s_popularity`),
  ADD KEY `time_play` (`time_play`),
  ADD KEY `time_release` (`time_release`),
  ADD KEY `time_add` (`time_add`),
  ADD KEY `s_tracks` (`s_tracks`),
  ADD KEY `cover_id` (`cover_id`),
  ADD KEY `bg_id` (`bg_id`);
ALTER TABLE `_c_m_albums` ADD FULLTEXT KEY `title` (`title`);

ALTER TABLE `_c_m_albums_relations`
  ADD PRIMARY KEY (`album_id`,`target_id`,`type`),
  ADD KEY `ID1` (`album_id`,`type`),
  ADD KEY `ID2` (`target_id`,`type`);

ALTER TABLE `_c_m_artists`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `hash` (`hash`),
  ADD UNIQUE KEY `code` (`code`),
  ADD UNIQUE KEY `seo_url` (`seo_url`),
  ADD KEY `spotify_id` (`spotify_id`),
  ADD KEY `spotify_popularity` (`spotify_popularity`),
  ADD KEY `s_views` (`s_views`),
  ADD KEY `s_views_unique` (`s_views_unique`),
  ADD KEY `time_add` (`time_add`),
  ADD KEY `time_release` (`time_release`),
  ADD KEY `time_play` (`time_play`),
  ADD KEY `s_popularity` (`s_popularity`),
  ADD KEY `s_albums` (`s_albums`),
  ADD KEY `s_subscribers` (`s_subscribers`),
  ADD KEY `s_tracks` (`s_tracks`),
  ADD KEY `s_tracks_as_ft` (`s_tracks_as_ft`),
  ADD KEY `s_albums_as_ft` (`s_albums_as_ft`),
  ADD KEY `cover_id` (`cover_id`),
  ADD KEY `bg_id` (`bg_id`);
ALTER TABLE `_c_m_artists` ADD FULLTEXT KEY `name` (`name`);

ALTER TABLE `_c_m_artists_relations`
  ADD PRIMARY KEY (`artist_id`,`target_id`,`type`),
  ADD KEY `ID1` (`artist_id`,`type`),
  ADD KEY `ID2` (`target_id`,`type`);

ALTER TABLE `_c_m_cronjobs`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `update_interval` (`update_interval`,`time_update`,`active`),
  ADD KEY `execution_interval` (`execution_interval`);

ALTER TABLE `_c_m_cronjobs_spotify`
  ADD PRIMARY KEY (`cron_id`,`spotify_id`),
  ADD KEY `local_id` (`local_id`),
  ADD KEY `time_check` (`time_check`);

ALTER TABLE `_c_m_events`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `seo_url` (`seo_url`),
  ADD UNIQUE KEY `hash` (`hash`),
  ADD KEY `manager_id` (`manager_id`);

ALTER TABLE `_c_m_genres`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `seo_url` (`seo_url`),
  ADD UNIQUE KEY `hash` (`hash`),
  ADD KEY `code` (`code`),
  ADD KEY `s_views` (`s_views`),
  ADD KEY `s_views_unique` (`s_views_unique`),
  ADD KEY `s_tracks` (`s_tracks`),
  ADD KEY `s_albums` (`s_albums`),
  ADD KEY `s_artists` (`s_artists`),
  ADD KEY `time_add` (`time_add`),
  ADD KEY `cover_id` (`cover_id`),
  ADD KEY `bg_id` (`bg_id`),
  ADD KEY `parent_id` (`parent_id`),
  ADD KEY `s_childs` (`s_childs`);

ALTER TABLE `_c_m_genres_hiearchy`
  ADD PRIMARY KEY (`genre_id`,`hook_id`);

ALTER TABLE `_c_m_langs`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `seo_url` (`seo_url`),
  ADD UNIQUE KEY `hash` (`hash`),
  ADD KEY `code` (`code`),
  ADD KEY `s_views` (`s_views`),
  ADD KEY `s_views_unique` (`s_views_unique`),
  ADD KEY `s_tracks` (`s_tracks`),
  ADD KEY `s_albums` (`s_albums`),
  ADD KEY `s_artists` (`s_artists`),
  ADD KEY `time_add` (`time_add`),
  ADD KEY `cover_id` (`cover_id`),
  ADD KEY `bg_id` (`bg_id`);

ALTER TABLE `_c_m_tags`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `seo_url` (`seo_url`),
  ADD UNIQUE KEY `hash` (`hash`),
  ADD KEY `code` (`code`),
  ADD KEY `s_views` (`s_views`),
  ADD KEY `s_views_unique` (`s_views_unique`),
  ADD KEY `s_tracks` (`s_tracks`),
  ADD KEY `s_albums` (`s_albums`),
  ADD KEY `s_artists` (`s_artists`),
  ADD KEY `time_add` (`time_add`),
  ADD KEY `cover_id` (`cover_id`),
  ADD KEY `bg_id` (`bg_id`);

ALTER TABLE `_c_m_tracks`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `hash` (`hash`),
  ADD UNIQUE KEY `code` (`code`),
  ADD UNIQUE KEY `seo_url` (`seo_url`),
  ADD KEY `price` (`price`),
  ADD KEY `explicit` (`explicit`),
  ADD KEY `artist_id` (`artist_id`),
  ADD KEY `album_id` (`album_id`),
  ADD KEY `album_artist_id` (`album_artist_id`),
  ADD KEY `user_id` (`uploader_id`),
  ADD KEY `spotify_id` (`spotify_id`),
  ADD KEY `spotify_popularity` (`spotify_popularity`),
  ADD KEY `s_views` (`s_views`),
  ADD KEY `s_views_unique` (`s_views_unique`),
  ADD KEY `s_plays` (`s_plays`),
  ADD KEY `time_add` (`time_add`),
  ADD KEY `time_release` (`time_release`),
  ADD KEY `time_play` (`time_play`),
  ADD KEY `s_sources_local` (`s_sources_local`),
  ADD KEY `s_sources` (`s_sources`),
  ADD KEY `s_plays_unique` (`s_plays_unique`),
  ADD KEY `s_likes` (`s_likes`),
  ADD KEY `s_reposts` (`s_reposts`),
  ADD KEY `s_downloads` (`s_downloads`),
  ADD KEY `s_dowloads_unique` (`s_downloads_unique`),
  ADD KEY `s_comments` (`s_comments`),
  ADD KEY `s_playlists` (`s_playlists`),
  ADD KEY `s_sales` (`s_sales`),
  ADD KEY `s_shares` (`s_shares`),
  ADD KEY `s_popularity` (`s_popularity`),
  ADD KEY `time_spotify` (`time_spotify`),
  ADD KEY `cover_id` (`cover_id`),
  ADD KEY `bg_id` (`bg_id`);
ALTER TABLE `_c_m_tracks` ADD FULLTEXT KEY `title` (`title`);

ALTER TABLE `_c_m_tracks_relations`
  ADD PRIMARY KEY (`track_id`,`target_id`,`type`),
  ADD KEY `ID1` (`track_id`,`type`),
  ADD KEY `ID2` (`target_id`,`type`);

ALTER TABLE `_c_m_tracks_sources`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `hash` (`hash`),
  ADD KEY `track_id` (`target_id`),
  ADD KEY `type` (`type`),
  ADD KEY `track_id_2` (`target_id`,`type`),
  ADD KEY `quality` (`quality`),
  ADD KEY `force_free` (`force_free`),
  ADD KEY `queue` (`queue`),
  ADD KEY `download_able` (`download_able`),
  ADD KEY `stream_able` (`stream_able`),
  ADD KEY `protected` (`protected`),
  ADD KEY `encrypted` (`encrypted`);

ALTER TABLE `_d_languages`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `code2` (`code2`),
  ADD UNIQUE KEY `code3` (`code3`),
  ADD KEY `time_add` (`time_add`);

ALTER TABLE `_d_languages_items`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `hook` (`hook`,`lang_code2`),
  ADD KEY `lang_code2` (`lang_code2`);

ALTER TABLE `_d_menus`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `time_add` (`time_add`);

ALTER TABLE `_d_pages`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `seo_url` (`seo_url`),
  ADD UNIQUE KEY `hash` (`hash`),
  ADD KEY `pre_design` (`pre_design`),
  ADD KEY `active` (`active`),
  ADD KEY `private` (`private`),
  ADD KEY `seo_url_2` (`seo_url`,`active`);

ALTER TABLE `_d_pages_widgets`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `active` (`active`),
  ADD KEY `page_id` (`page_id`),
  ADD KEY `unique_id` (`unique_id`),
  ADD KEY `i` (`i`),
  ADD KEY `native` (`native`);

ALTER TABLE `_d_search_history`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `hash` (`hash`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `time_add` (`time_add`),
  ADD KEY `submit_check` (`hash`,`time_add`,`time_redirect`) USING BTREE,
  ADD KEY `user_ip` (`user_ip`);

ALTER TABLE `_d_search_history_terms`
  ADD KEY `history_id` (`history_id`);

ALTER TABLE `_d_search_postings`
  ADD KEY `term_id` (`term_id`),
  ADD KEY `object_type` (`object_type`) USING BTREE,
  ADD KEY `object_type_2` (`object_type`,`object_id`),
  ADD KEY `term_id_2` (`term_id`,`object_type`);

ALTER TABLE `_d_search_suggestions`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `string` (`string`);

ALTER TABLE `_d_search_terms`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `term` (`term`),
  ADD KEY `count` (`count`);

ALTER TABLE `_u_actions`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `hash` (`hash`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `type` (`type`),
  ADD KEY `object_type` (`object_name`,`object_id`),
  ADD KEY `related_object_type` (`related_object_type`,`related_object_id`),
  ADD KEY `time_add` (`time_add`),
  ADD KEY `user_id_2` (`user_id`,`type`),
  ADD KEY `user_id_3` (`user_id`,`type`,`object_name`,`object_id`);

ALTER TABLE `_u_list`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `hash` (`hash`),
  ADD KEY `time_online` (`time_online`),
  ADD KEY `time_verify` (`time_verify`),
  ADD KEY `time_add` (`time_add`),
  ADD KEY `time_notified` (`time_notified`),
  ADD KEY `s_managed_artists` (`s_managed_artists`);

ALTER TABLE `_u_notifications`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `method_email` (`method_email`),
  ADD KEY `method_push` (`method_push`),
  ADD KEY `source_object` (`source_object`),
  ADD KEY `source_id` (`source_id`),
  ADD KEY `source_object_2` (`source_object`,`source_id`),
  ADD KEY `time_seen` (`time_seen`),
  ADD KEY `time_add` (`time_add`),
  ADD KEY `target_object` (`triggerer_object`),
  ADD KEY `target_id` (`triggerer_id`),
  ADD KEY `target_email` (`target_email`),
  ADD KEY `user_id_2` (`user_id`,`source_object`,`source_id`),
  ADD KEY `hook` (`hook`);

ALTER TABLE `_u_payments`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `gateway_name` (`gateway_name`),
  ADD KEY `_key` (`_key`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `gateway_id` (`gateway_id`),
  ADD KEY `time_add` (`time_add`),
  ADD KEY `time_pay` (`time_pay`),
  ADD KEY `time_approve` (`time_approve`),
  ADD KEY `time_reject` (`time_reject`),
  ADD KEY `paid` (`paid`),
  ADD KEY `approved` (`approved`),
  ADD KEY `mode` (`mode`),
  ADD KEY `time_recur` (`time_recur`),
  ADD KEY `sub_id` (`sub_id`);

ALTER TABLE `_u_playlists`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `hash` (`hash`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `time_add` (`time_add`),
  ADD KEY `private` (`private`),
  ADD KEY `spotify_id` (`spotify_id`);

ALTER TABLE `_u_properties`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `hash` (`hash`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `type` (`type`),
  ADD KEY `object_type` (`object_name`,`object_id`),
  ADD KEY `time_add` (`time_add`),
  ADD KEY `user_id_2` (`user_id`,`type`),
  ADD KEY `type_2` (`type`,`related_object_name`,`related_object_id`);

ALTER TABLE `_u_push_subs`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `data_hash` (`data_hash`),
  ADD KEY `time_add` (`time_add`),
  ADD KEY `user_id_2` (`user_id`,`data_hash`);

ALTER TABLE `_u_relations`
  ADD PRIMARY KEY (`user_id`,`target_id`,`type`),
  ADD KEY `ID1` (`user_id`,`type`),
  ADD KEY `ID2` (`target_id`,`type`);

ALTER TABLE `_u_reports`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `user_ip` (`user_ip`),
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `_u_requests`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `time_add` (`time_add`),
  ADD KEY `time_review` (`time_review`),
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `_u_roles`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `type` (`type`),
  ADD KEY `def` (`def`),
  ADD KEY `type_2` (`type`,`def`),
  ADD KEY `time_add` (`time_add`);

ALTER TABLE `_u_setting`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `user_id` (`user_id`,`var`);

ALTER TABLE `_u_subs`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `subs_plan` (`subs_plan_id`),
  ADD KEY `user_id_2` (`user_id`,`time_expire`),
  ADD KEY `user_id_3` (`user_id`,`subs_plan_id`),
  ADD KEY `gateway_sub_id` (`gateway_sub_id`);

ALTER TABLE `_u_subs_plans`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `free` (`free`),
  ADD KEY `priority` (`priority`);

ALTER TABLE `_u_transactions`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `type` (`type`),
  ADD KEY `object_type` (`object_type`),
  ADD KEY `object_id` (`object_id`),
  ADD KEY `time_add` (`time_add`);

ALTER TABLE `_u_withdrawal`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `sta` (`sta`),
  ADD KEY `time_add` (`time_add`),
  ADD KEY `time_review` (`time_review`);


ALTER TABLE `_bof_ads`
  MODIFY `ID` int(6) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_bof_blacklist`
  MODIFY `ID` int(9) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_bof_cache_db`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_bof_cache_sessions`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_bof_cache_sessions_admin`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_bof_cache_stream_royalties`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_bof_currencies`
  MODIFY `ID` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `_bof_files`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

ALTER TABLE `_bof_files_hosts`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `_bof_log_ai_fees`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_bof_log_api_requests`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_bof_log_api_requests_admin`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_bof_log_cronjob_g`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_bof_log_cronjob_p`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_bof_log_curls`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_bof_log_db`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_bof_log_errors`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_bof_log_requests`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_bof_log_requests_admin`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_bof_notification`
  MODIFY `ID` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

ALTER TABLE `_bof_plug_logs`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_bof_plug_processes`
  MODIFY `ID` int(9) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_c_b_categories`
  MODIFY `ID` int(5) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_c_b_posts`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_c_b_tags`
  MODIFY `ID` int(5) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_c_m_albums`
  MODIFY `ID` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

ALTER TABLE `_c_m_artists`
  MODIFY `ID` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

ALTER TABLE `_c_m_cronjobs`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_c_m_events`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_c_m_genres`
  MODIFY `ID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `_c_m_langs`
  MODIFY `ID` int(5) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_c_m_tags`
  MODIFY `ID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `_c_m_tracks`
  MODIFY `ID` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

ALTER TABLE `_c_m_tracks_sources`
  MODIFY `ID` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

ALTER TABLE `_d_languages`
  MODIFY `ID` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `_d_languages_items`
  MODIFY `ID` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=520;

ALTER TABLE `_d_menus`
  MODIFY `ID` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `_d_pages`
  MODIFY `ID` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `_d_pages_widgets`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

ALTER TABLE `_d_search_history`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_d_search_suggestions`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_d_search_terms`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_u_actions`
  MODIFY `ID` int(7) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_u_list`
  MODIFY `ID` int(7) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_u_notifications`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_u_payments`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_u_playlists`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_u_properties`
  MODIFY `ID` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

ALTER TABLE `_u_push_subs`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_u_reports`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_u_requests`
  MODIFY `ID` int(6) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_u_roles`
  MODIFY `ID` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `_u_setting`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_u_subs`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_u_subs_plans`
  MODIFY `ID` int(3) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_u_transactions`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `_u_withdrawal`
  MODIFY `ID` int(6) NOT NULL AUTO_INCREMENT;
SET FOREIGN_KEY_CHECKS=1;
COMMIT;