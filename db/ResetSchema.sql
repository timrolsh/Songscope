/*
This file wipes all associated tables for Songscope from the database. 
To reset the database, run this script and then run the Schema.sql 
file to reset the database with empty data. 
*/
-- Drop each table individually if they exist
DROP TABLE IF EXISTS accounts cascade;
DROP TABLE IF EXISTS sessions cascade;
DROP TABLE IF EXISTS users cascade;
DROP TABLE IF EXISTS comment cascade;
DROP TABLE IF EXISTS user_comment cascade;
DROP TABLE IF EXISTS user_song cascade;
DROP TABLE IF EXISTS verification_token cascade;
