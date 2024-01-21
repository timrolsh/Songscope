-- Use our assigned schema
USE capstone_2324_songscope;

-- disable foreign key checks so that tables could be dropped
SET FOREIGN_KEY_CHECKS = 0;

-- Drop each table individually if they exist
DROP TABLE IF EXISTS user cascade;
DROP TABLE IF EXISTS conversation cascade;
DROP TABLE IF EXISTS conversation_user cascade;
DROP TABLE IF EXISTS message cascade;
DROP TABLE IF EXISTS rating cascade;
DROP TABLE IF EXISTS comment cascade;
DROP TABLE IF EXISTS comment_like cascade;
DROP TABLE IF EXISTS reply_like cascade;
DROP TABLE IF EXISTS reply cascade;

-- re-enable foreign key checks for normal functionality
SET FOREIGN_KEY_CHECKS = 1;

-- Create the user table
CREATE TABLE user
(
    id              INT  NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username        TEXT NOT NULL,
    spotify_id      TEXT,
    google_id       TEXT,
    first_name       TEXT,
    last_name       TEXT,
    email           TEXT,
    profile_picture BLOB
);

-- Create the rating table
CREATE TABLE rating
(
    spotify_work_id TEXT  NOT NULL,
    rating          FLOAT NOT NULL,
    user_id         INT   NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (id)
);

-- Create the comment table
CREATE TABLE comment
(
    id              INT  NOT NULL PRIMARY KEY,
    user_id         INT  NOT NULL,
    spotify_work_id TEXT NOT NULL,
    comment_text    TEXT NOT NULL,
    # a user does not have to provide a timestamp for a comment
    time            TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user (id)
);

-- Create the comment_like table
CREATE TABLE comment_like
(
    comment_id INT NOT NULL,
    user_id    INT NOT NULL,
    FOREIGN KEY (comment_id) REFERENCES comment (id),
    FOREIGN KEY (user_id) REFERENCES user (id)
);

-- Create the reply table
CREATE TABLE reply
(
    id         INT  NOT NULL PRIMARY KEY,
    user_id    INT  NOT NULL,
    comment_id INT  NOT NULL,
    reply_text TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (id),
    FOREIGN KEY (comment_id) REFERENCES comment (id)
);

-- Create the reply_like table
CREATE TABLE reply_like
(
    reply_id INT NOT NULL,
    user_id  INT NOT NULL,
    FOREIGN KEY (reply_id) REFERENCES reply (id),
    FOREIGN KEY (user_id) REFERENCES user (id)
);