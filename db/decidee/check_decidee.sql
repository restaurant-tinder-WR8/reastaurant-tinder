select * from decidee 
where lower(username) = lower(${username}) or lower(email) = lower(${email});