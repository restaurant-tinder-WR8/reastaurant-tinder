UPDATE decidee
SET profile_pic = $1
WHERE decidee_id = $2;

SELECT decidee_id, email, username, profile_pic FROM decidee
WHERE decidee_id = $2;