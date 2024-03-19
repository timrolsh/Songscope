/*
This file wipes all associated tables for Songscope from the database. 
To reset the database, run this script and then run the Schema.sql 
file to reset the database with empty data. 
*/

-- Use our assigned schema
USE capstone_2324_songscope;

-- disable foreign key checks so that tables could be dropped
SET FOREIGN_KEY_CHECKS = 0;

-- Drop each table individually if they exist
DROP TABLE IF EXISTS accounts cascade;
DROP TABLE IF EXISTS sessions cascade;
DROP TABLE IF EXISTS users cascade;
DROP TABLE IF EXISTS comment cascade;
DROP TABLE IF EXISTS user_comment cascade;
DROP TABLE IF EXISTS user_song cascade;
DROP TABLE IF EXISTS verification_token cascade;

-- re-enable foreign key checks for normal functionality
SET FOREIGN_KEY_CHECKS = 1;