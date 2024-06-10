/*
A user's primary account for the platform.
*/
create table if not exists users
(
    id                  bigserial primary key               not null,
    name                text                                not null,
    email               text                                not null,
    image               text,
    bio                 text,
    show_favorite_songs boolean   default true              not null,
    show_reviews        boolean   default true              not null,
    show_explicit       boolean   default true              not null,
    join_date           timestamp default current_timestamp not null,
    is_admin            boolean   default false             not null
);

/*
Each row in this table represents a link between a user and a third party provider, such as Spotify or Google.
One user can have multiple entries in this table for different providers that they are authenticated with.
An auth account is tied to a user account, and for each provider, there can only be one account (these are 2 constraints).
*/
create table if not exists accounts
(
    id                  bigserial primary key not null,
    user_id             bigint                not null,
    type                text                  not null,
    provider            text                  not null,
    provider_account_id text                  not null,
    refresh_token       text,
    access_token        text,
    expires_at          bigint,
    id_token            text,
    scope               text,
    session_state       text,
    token_type          text,
    unique (provider, provider_account_id),
    foreign key (user_id) references users (id) on delete cascade
);

create table if not exists sessions
(
    id            bigserial primary key not null,
    user_id       bigint                not null,
    expires       timestamp             not null,
    session_token text                  not null
);

create table if not exists comments
(
    id              bigserial primary key               not null,
    user_id         bigint                              not null,
    spotify_work_id text                                not null,
    comment_text    text                                not null,
    time            TIMESTAMP DEFAULT CURRENT_TIMESTAMP not null,
    foreign key (user_id) references users (id) on delete cascade
);

create table if not exists user_comment
(
    user_id    bigint                not null,
    comment_id bigint                not null,
    liked      boolean default false not null,
    primary key (user_id, comment_id),
    foreign key (comment_id) REFERENCES comments (id) on delete cascade,
    foreign key (user_id) REFERENCES users (id) on delete cascade
);

create table if not exists user_song
(
    user_id         bigint                not null,
    spotify_work_id text                  not null,
    rating          int     DEFAULT 0,
    favorite        boolean default false not null,
    pinned          boolean default false not null,
    primary key (user_id, spotify_work_id),
    foreign key (user_id) references users (id) on delete cascade
);
