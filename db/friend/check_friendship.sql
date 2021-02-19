SELECT * FROM friend_list
WHERE main_decidee_id = $1
AND friend_decidee_id = $2;