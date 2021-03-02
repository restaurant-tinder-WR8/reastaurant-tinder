INSERT INTO friend_list
(main_decidee_id, friend_decidee_id)
VALUES
($1, $2);

INSERT INTO friend_list
(main_decidee_id, friend_decidee_id)
VALUES
($2, $1);

SELECT fl.row_id AS row_id, fl.main_decidee_id AS main_decidee_id, fl.friend_decidee_id AS friend_decidee_id, d.username AS username FROM friend_list fl
JOIN decidee d ON fl.friend_decidee_id = d.decidee_id
WHERE fl.main_decidee_id = $1;