insert into decidee (
    email,
    username,
    password,
    profile_pic
) values (
    ${email},
    ${username},
    ${hash},
    ${profilePic}
)
returning decidee_id, email, username;