delete from pending_lobby_invite
where lobby_id = ${id} and invited_decidee_id = ${decidee_id};

select p.*, d.username from pending_lobby_invite p
left join decidee d on p.sender_id = d.decidee_id
where p.invited_decidee_id = ${id};