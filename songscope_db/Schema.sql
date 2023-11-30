-- Use our assigneed schema
USE capstone_2324_songscope;

-- Drop each table individually if they exist
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS conversation;
DROP TABLE IF EXISTS conversation_user;
DROP TABLE IF EXISTS message;
DROP TABLE IF EXISTS rating;
DROP TABLE IF EXISTS comment;
DROP TABLE IF EXISTS comment_like;
DROP TABLE IF EXISTS reply;
DROP TABLE IF EXISTS reply_like;

-- Create the user table
CREATE TABLE user
(
    id              INT  NOT NULL PRIMARY KEY,
    username        TEXT NOT NULL,
    spotify_id      TEXT,
    google_id       TEXT,
    apple_id        TEXT,
    first_name      TEXT,
    last_name       TEXT,
    email           TEXT,
    password_hash   TEXT,
    profile_picture BLOB
);

-- Create the conversation table
CREATE TABLE conversation
(
    id INT NOT NULL PRIMARY KEY
);

-- Create the conversation_user table
CREATE TABLE conversation_user
(
    conversation_id INT NOT NULL,
    user_id         INT NOT NULL,
    FOREIGN KEY (conversation_id) REFERENCES conversation (id),
    FOREIGN KEY (user_id) REFERENCES user (id)
);

-- Create the message table
CREATE TABLE message
(
    conversation_id INT       NOT NULL,
    user_id         INT       NOT NULL,
    time_sent       TIMESTAMP NOT NULL,
    message_text    TEXT      NOT NULL,
    FOREIGN KEY (conversation_id) REFERENCES conversation (id),
    FOREIGN KEY (user_id) REFERENCES user (id)
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
