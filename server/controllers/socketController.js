
module.exports = {
    addSocket: async (req, res) => {
        const { socket_id } = req.params
        const { decidee_id } = req.body
        const db = req.app.get('db')
        await db.socket.add_socket({ decidee_id, socket_id })
        res.sendStatus(200)
    },
    removeSocket: async (req, res) => {
        const { socket_id } = req.params
        const db = req.app.get('db')
        const [decidee] = await db.socket.get_decidee_by_socket({ socket_id })
        if (decidee) {
            const { decidee_id, lobby_id } = decidee
            await db.socket.remove_socket({ socket_id, decidee_id })
            if (lobby_id) {
                const result = await db.lobby.check_lobby_empty({ lobby_id })
                if (result.length === 0) {
                    db.chat.clear_lobby_chat({ lobby_id })
                    return res.sendStatus(200)
                }
                return res.status(201).send({ lobby_id })
            }
        }
        res.sendStatus(200)
    }
}