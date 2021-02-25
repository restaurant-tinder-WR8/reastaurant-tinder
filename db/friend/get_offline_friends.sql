SELECT fl.row_id AS row_id, fl.main_decidee_id AS main_decidee_id, fl.friend_decidee_id AS friend_decidee_id, d.username AS username, d.profile_pic AS profile_pic FROM friend_list fl
JOIN decidee d ON fl.friend_decidee_id = d.decidee_id
WHERE fl.main_decidee_id = $1 and d.socket_id is null;