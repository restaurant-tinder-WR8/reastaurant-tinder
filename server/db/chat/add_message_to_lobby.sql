insert into chat_message (
    lobby_id,
    decidee_id,
    post_time,
    message_text
) values (
    ${lobbyId},
    ${decidee_id},
    CURRENT_TIMESTAMP,
    ${message}
);
