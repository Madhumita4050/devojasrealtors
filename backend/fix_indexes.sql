-- Drop all duplicate indexes on users table (keep only the original ones)
-- email
ALTER TABLE `users` DROP INDEX `email_2`;
ALTER TABLE `users` DROP INDEX `email_3`;
ALTER TABLE `users` DROP INDEX `email_4`;
ALTER TABLE `users` DROP INDEX `email_5`;
ALTER TABLE `users` DROP INDEX `email_6`;
ALTER TABLE `users` DROP INDEX `email_7`;
ALTER TABLE `users` DROP INDEX `email_8`;
ALTER TABLE `users` DROP INDEX `email_9`;
ALTER TABLE `users` DROP INDEX `email_10`;
ALTER TABLE `users` DROP INDEX `email_11`;

-- phone
ALTER TABLE `users` DROP INDEX `phone_2`;
ALTER TABLE `users` DROP INDEX `phone_3`;
ALTER TABLE `users` DROP INDEX `phone_4`;
ALTER TABLE `users` DROP INDEX `phone_5`;
ALTER TABLE `users` DROP INDEX `phone_6`;
ALTER TABLE `users` DROP INDEX `phone_7`;
ALTER TABLE `users` DROP INDEX `phone_8`;
ALTER TABLE `users` DROP INDEX `phone_9`;
ALTER TABLE `users` DROP INDEX `phone_10`;
ALTER TABLE `users` DROP INDEX `phone_11`;

-- login_id
ALTER TABLE `users` DROP INDEX `login_id_2`;
ALTER TABLE `users` DROP INDEX `login_id_3`;
ALTER TABLE `users` DROP INDEX `login_id_4`;
ALTER TABLE `users` DROP INDEX `login_id_5`;
ALTER TABLE `users` DROP INDEX `login_id_6`;
ALTER TABLE `users` DROP INDEX `login_id_7`;
ALTER TABLE `users` DROP INDEX `login_id_8`;

-- pan_number
ALTER TABLE `users` DROP INDEX `pan_number_2`;
ALTER TABLE `users` DROP INDEX `pan_number_3`;
ALTER TABLE `users` DROP INDEX `pan_number_4`;
ALTER TABLE `users` DROP INDEX `pan_number_5`;
ALTER TABLE `users` DROP INDEX `pan_number_6`;
ALTER TABLE `users` DROP INDEX `pan_number_7`;
ALTER TABLE `users` DROP INDEX `pan_number_8`;
ALTER TABLE `users` DROP INDEX `pan_number_9`;
ALTER TABLE `users` DROP INDEX `pan_number_10`;

-- aadhar_number
ALTER TABLE `users` DROP INDEX `aadhar_number_2`;
ALTER TABLE `users` DROP INDEX `aadhar_number_3`;
ALTER TABLE `users` DROP INDEX `aadhar_number_4`;
ALTER TABLE `users` DROP INDEX `aadhar_number_5`;
ALTER TABLE `users` DROP INDEX `aadhar_number_6`;
ALTER TABLE `users` DROP INDEX `aadhar_number_7`;
ALTER TABLE `users` DROP INDEX `aadhar_number_8`;
ALTER TABLE `users` DROP INDEX `aadhar_number_9`;
ALTER TABLE `users` DROP INDEX `aadhar_number_10`;

-- referral_code
ALTER TABLE `users` DROP INDEX `referral_code_2`;
ALTER TABLE `users` DROP INDEX `referral_code_3`;
ALTER TABLE `users` DROP INDEX `referral_code_4`;
ALTER TABLE `users` DROP INDEX `referral_code_5`;
ALTER TABLE `users` DROP INDEX `referral_code_6`;
ALTER TABLE `users` DROP INDEX `referral_code_7`;
ALTER TABLE `users` DROP INDEX `referral_code_8`;
ALTER TABLE `users` DROP INDEX `referral_code_9`;
ALTER TABLE `users` DROP INDEX `referral_code_10`;
ALTER TABLE `users` DROP INDEX `referral_code_11`;

SELECT 'All duplicate indexes dropped!' as result;
