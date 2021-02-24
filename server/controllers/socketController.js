
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
        const [{ decidee_id, lobby_id }] = await db.socket.get_decidee_by_socket({ socket_id })
        await db.socket.remove_socket({ socket_id, decidee_id })

        lobby_id ? res.status(201).send({ lobby_id }) : res.sendStatus(200)
    }
}