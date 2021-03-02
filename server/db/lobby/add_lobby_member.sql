insert into lobby_member (
    lobby_id,
    decidee_id
) values (
    ${lobbyId},
    ${decidee_id}
);

select lm.*, d.username from lobby_member lm
left join decidee d on d.decidee_id = lm.decidee_id
where lobby_id = ${lobbyId};