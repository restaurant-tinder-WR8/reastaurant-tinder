select p.*, d.username from pending_lobby_invite p
left join decidee d on p.sender_id = d.decidee_id
where p.invited_decidee_id = ${id};