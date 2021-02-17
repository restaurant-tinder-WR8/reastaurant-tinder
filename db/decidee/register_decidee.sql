insert into decidee (
    email,
    username,
    password
) values (
    ${email},
    ${username},
    ${hash}
)
returning decidee_id, email, username;