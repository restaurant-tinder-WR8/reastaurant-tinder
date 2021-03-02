select * from decidee 
where lower(username) = lower(${userOrEmail}) or lower(email) = lower(${userOrEmail});