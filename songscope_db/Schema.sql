-- useful for rerunning this script
drop schema if exists songscope cascade;

create schema songscope;

create table songscope.user
(
--     the id that our database will identify users by
    id              integer not null primary key,
-- every user has a unique username and it must be unique, cannot be null
    username        text    not null,
    spotify_id      text,
    google_id       text,
    apple_id        text,
    first_name      text,
    last_name       text,
    email           text,
    password_hash   text,
    profile_picture bytea
);

create table songscope.message
(
    user_id         integer   not null
        constraint message_user_id_fk
            references songscope."user",
    time_sent       timestamp not null,
    message_text    text      not null
);

--  works can have ratings made by users (the rating will be from 0 to 1 and will be a slider in the UI)
create table songscope.rating
(
    spotify_work_id text    not null,
    rating          float4  not null,
    user_id         integer not null
        constraint rating_user_id_fk
            references songscope."user"
);

-- a user can comment on a work
create table songscope.comment
(
    id              integer not null primary key,
    user_id         integer not null
        constraint comment_user_id_fk
            references songscope."user",
    spotify_work_id text    not null,
    comment_text    text    not null
);

-- a user can make like a comment
(
    comment_id integer not null
        constraint comment_like_comment_id_fk
            references songscope.comment,
    user_id    integer not null
        constraint comment_like_user_id_fk
            references songscope."user"
);

-- a user can reply to a comment
create table songscope.reply
(
    id         integer not null primary key,
    user_id    integer not null
        constraint comment_user_id_fk
            references songscope."user",
    comment_id integer not null
        constraint reply_comment_id_fk
            references songscope.comment,
    reply_text text    not null
);

-- a user can like a reply
create table songscope.reply_like
(
    reply_id integer not null
        constraint reply_like_reply_id_fk
            references songscope.reply,
    user_id  integer not null
        constraint reply_like_user_id_fk
            references songscope."user"
);

