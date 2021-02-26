
module.exports = {
    addSocket: async (req, res) => {
        const { socket_id } = req.params
        const { decidee_id } = req.body
        const db = req.app.get('db')
        if (db !== undefined) {
            await db.socket.add_socket({ decidee_id, socket_id })
            const onlineFriendSockets = await db.friend.get_online_friends_socket({ socket_id })
            return res.status(200).send(onlineFriendSockets)
        }
        res.sendStatus(200)
    },
    removeSocket: async (req, res) => {
        const { socket_id } = req.params
        const db = req.app.get('db')
        const [decidee] = await db.socket.get_decidee_by_socket({ socket_id })
        const onlineFriendSockets = await db.friend.get_online_friends_socket({ socket_id })
        if (decidee) {
            const { decidee_id, lobby_id } = decidee
            await db.socket.remove_socket({ socket_id, decidee_id })
            if (lobby_id) {
                const result = await db.lobby.check_lobby_empty({ lobby_id })
                if (result.length === 0) {
                    db.chat.clear_lobby_chat({ lobby_id })
                    return res.status(200).send({ onlineFriendSockets })
                }
                return res.status(201).send({ lobby_id, onlineFriendSockets })
            }
        }
        res.status(200).send({ onlineFriendSockets })
    }
}