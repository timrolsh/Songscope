-- Use our assigned schema
USE capstone_2324_songscope;

/*
Each row in this table represents a link between a user and a third party provider, such as Spotify or Google.
One user can have multiple entries in this table for different providers that they are authenticated with.
An auth account is tied to a user account, and for each provider, there can only be one account (these are 2 constraints).
*/
create table accounts
(
    id                bigint unsigned auto_increment not null primary key,
    userId            int                            not null,
    type              varchar(255)                   not null,
    provider          varchar(255)                   not null,
    providerAccountId varchar(255)                   not null,
    refresh_token     text                           null,
    access_token      text                           null,
    expires_at        bigint                         null,
    id_token          text                           null,
    scope             text                           null,
    session_state     text                           null,
    token_type        text                           null,
    constraint accounts_pk
        unique (provider, providerAccountId),
    constraint accounts_users_id_fk
        foreign key (userId) references users (id)
);

create table if not exists sessions
(
    id           bigint unsigned auto_increment
        primary key,
    userId       int          not null,
    expires      timestamp    not null,
    sessionToken varchar(255) not null,
    constraint id
        unique (id)
);

/*
A user's primary account for the platform.
*/
create table if not exists users
(
    id                  bigint unsigned auto_increment
        primary key,
    name                varchar(255)                         not null,
    first_name          text                                 null,
    last_name           text                                 null,
    email               varchar(255)                         not null,
    image               text                                 null,
    emailVerified       timestamp                            null,
    bio                 text                                 null,
    show_favorite_songs tinyint(1) default 1                 not null,
    show_reviews        tinyint(1) default 1                 not null,
    join_date           timestamp  default CURRENT_TIMESTAMP not null,
    isAdmin             tinyint(1) default 0                 not null,
    constraint id
        unique (id)
);

create table if not exists comment
(
    id              int auto_increment
        primary key,
    user_id         bigint unsigned                     not null,
    spotify_work_id text                                not null,
    comment_text    text                                not null,
    time            timestamp default CURRENT_TIMESTAMP not null,
    constraint comment_users_id_fk
        foreign key (user_id) references users (id)
);

create table if not exists user_comment
(
    user_id    bigint unsigned      not null,
    comment_id int                  not null,
    liked      tinyint(1) default 0 not null,
    primary key (user_id, comment_id),
    constraint user_comment_comment_fk
        foreign key (comment_id) references comment (id)
            on delete cascade,
    constraint user_comment_user_fk
        foreign key (user_id) references users (id)
            on delete cascade
);

create table if not exists user_song
(
    user_id         bigint unsigned      not null,
    spotify_work_id varchar(255)         not null,
    rating          int        default 0 null,
    favorite        tinyint(1) default 0 not null,
    pinned          tinyint(1) default 0 not null,
    primary key (user_id, spotify_work_id),
    constraint user_song_users_id_fk
        foreign key (user_id) references users (id)
);

create table if not exists verification_token
(
    identifier text      not null,
    expires    timestamp not null,
    token      text      not null,
    primary key (identifier(128), token(128))
);
