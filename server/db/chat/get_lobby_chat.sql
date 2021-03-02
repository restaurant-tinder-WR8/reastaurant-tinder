select c.*, d.profile_pic, d.username from chat_message c
left join decidee d on c.decidee_id = d.decidee_id
where lobby_id = ${lobbyId}
order by c.post_time;
