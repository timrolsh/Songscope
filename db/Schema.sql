-- Use our assigned schema
USE capstone_2324_songscope;

create table if not exists accounts
(
    id                bigint unsigned auto_increment
        primary key,
    userId            int          not null,
    type              varchar(255) not null,
    provider          varchar(255) not null,
    providerAccountId varchar(255) not null,
    refresh_token     text         null,
    access_token      text         null,
    expires_at        bigint       null,
    id_token          text         null,
    scope             text         null,
    session_state     text         null,
    token_type        text         null
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

create table if not exists users
(
    id            bigint unsigned auto_increment
        primary key,
    name          varchar(255) not null,
    first_name    text         null,
    last_name     text         null,
    email         varchar(255) not null,
    image         text         null,
    emailVerified timestamp    null,
    bio           text         null,
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

create table if not exists rating
(
    spotify_work_id text            not null,
    rating          float           not null,
    user_id         bigint unsigned not null,
    constraint user_id
        unique (user_id),
    constraint review_user_fk
        foreign key (user_id) references users (id)
);

create table if not exists verification_token
(
    identifier text      not null,
    expires    timestamp not null,
    token      text      not null,
    primary key (identifier(128), token(128))
);
