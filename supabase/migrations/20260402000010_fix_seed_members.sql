-- Fix seed member data overwritten by on_auth_user_created trigger
UPDATE member SET display_name = 'Priya Aurosmith',      is_admin = true,  is_approved = true WHERE id = 'a0a0a0a0-0000-0000-0000-000000000001';
UPDATE member SET display_name = 'Ravi Sundaram',         is_admin = false, is_approved = true WHERE id = 'a0a0a0a0-0000-0000-0000-000000000002';
UPDATE member SET display_name = 'Lakshmi Devi',          is_admin = false, is_approved = true WHERE id = 'a0a0a0a0-0000-0000-0000-000000000003';
UPDATE member SET display_name = 'Thomas Weber',          is_admin = false, is_approved = true WHERE id = 'a0a0a0a0-0000-0000-0000-000000000004';
UPDATE member SET display_name = 'Ananda Krishnamurthy',  is_admin = false, is_approved = true WHERE id = 'a0a0a0a0-0000-0000-0000-000000000005';
UPDATE member SET display_name = 'Sofia Bernhardt',       is_admin = false, is_approved = true WHERE id = 'a0a0a0a0-0000-0000-0000-000000000006';
UPDATE member SET display_name = 'Arjun Mehta',           is_admin = false, is_approved = true WHERE id = 'a0a0a0a0-0000-0000-0000-000000000007';
UPDATE member SET display_name = 'Meera Patel',           is_admin = false, is_approved = true WHERE id = 'a0a0a0a0-0000-0000-0000-000000000008';
