CREATE TABLE decidee (
    decidee_id SERIAL PRIMARY KEY,
    email VARCHAR(250),
    username VARCHAR(50),
    password VARCHAR(250)
);

CREATE TABLE friend_list (
    row_id SERIAL PRIMARY KEY,
    main_decidee_id INT REFERENCES decidee(decidee_id),
    friend_decidee_id INT REFERENCES decidee(decidee_id)
);

CREATE TABLE pending_friend (
    pending_id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES decidee(decidee_id),
    receiver_id INT REFERENCES decidee(decidee_id)
);

CREATE TABLE lobby (
    lobby_id SERIAL PRIMARY KEY,
    lobby_socket_key INT (comes from sockets)
    host_id INT REFERENCES decidee(decidee_id),
    lobby_closed BOOLEAN default false,
);

create table pending_lobby_invite (
    row_id serial primary key,
    lobby_id int references lobby(lobby_id),
    sender_id int references decidee(decidee_id),
    invited_decidee_id int references decidee(decidee_id)
)

create table lobby_member (
    row_id serial primary key,
    lobby_id int references lobby(lobby_id),
    decidee_id int references decidee(decidee_id),
    id_ready boolean default FALSE
);


CREATE TABLE chat_message (
    message_id serial primary key,
    lobby_id INT REFERENCES lobby(lobby_id),
    decidee_id INT REFERENCES decidee(decidee_id),
    post_time TIMESTAMP,
    message_text text
);