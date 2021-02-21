insert into pending_lobby_invite (
    lobby_id,
    sender_id,
    invited_decidee_id
) values (
    ${lobbyId},
    ${decidee_id},
    ${friend_id}
);

select * from pending_lobby_invite
where lobby_id = ${lobbyId};