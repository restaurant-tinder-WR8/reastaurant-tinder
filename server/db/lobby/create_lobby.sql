insert into lobby (
    host_id
) values (
    ${decidee_id}
)
returning *;