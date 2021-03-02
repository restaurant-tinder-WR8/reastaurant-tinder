select d2.socket_id from friend_list fl
left join decidee d on fl.main_decidee_id = d.decidee_id
left join decidee d2 on fl.friend_decidee_id = d2.decidee_id
where d.socket_id = ${socket_id} and d2.socket_id is not null;