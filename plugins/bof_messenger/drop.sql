DELETE FROM `_bof_notification` WHERE hook = 'new_group_message';
DELETE FROM `_bof_notification` WHERE hook = 'new_1on1_message';
DELETE FROM `_u_notifications` WHERE triggerer_object = 'ms_group';
