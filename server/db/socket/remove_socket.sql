delete from lobby_member 
where decidee_id = ${decidee_id};

update decidee
set socket_id = null
where socket_id = ${socket_id};
