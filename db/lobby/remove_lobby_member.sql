delete from lobby_member
where lobby_id = ${lobbyId} and decidee_id = ${decidee_id};

select lm.*, d.username from lobby_member lm
left join decidee d on d.decidee_id = lm.decidee_id
where lobby_id = ${lobbyId};