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

CREATE TABLE chat_message (
    message_id serial primary key,
    lobby_id INT REFERENCES lobby(lobby_id),
    decidee_id INT REFERENCES decidee(decidee_id),
    post_time TIMESTAMP,
    message_text text
);