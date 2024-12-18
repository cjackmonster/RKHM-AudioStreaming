ALTER TABLE `_u_list` DROP `s_affiliate`;
ALTER TABLE `_u_list` DROP `referrer_id`;
DELETE FROM `_u_roles` WHERE type = 'affiliate';
