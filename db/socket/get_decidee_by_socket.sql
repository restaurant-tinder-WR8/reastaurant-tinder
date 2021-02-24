select d.decidee_id, lm.lobby_id from decidee d 
left join lobby_member lm on d.decidee_id = lm.decidee_id
where d.socket_id = ${socket_id}