SELECT p.pending_id AS pending_id, p.sender_id AS sender_id, d.username AS username, d.profile_pic AS profile_pic FROM pending_friend p
JOIN decidee d ON p.sender_id = d.decidee_id
WHERE p.receiver_id = $1;