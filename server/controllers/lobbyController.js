
module.exports = {
    createLobby: async (req, res) => {
        const { decidee_id } = req.session.user
        const db = req.app.get('db')

        const [foundLobby] = await db.lobby.check_for_lobby_host_id({ decidee_id })
        if (foundLobby) {
            return res.status(302).send(foundLobby)
        }
        const [newLobby] = await db.lobby.create_lobby({ decidee_id })
        console.log('SDE:', newLobby)
        res.status(201).send(newLobby)
    },
    deleteLobby: async (req, res) => {
        const { decidee_id } = req.session.user
        const db = req.app.get('db')
        await db.lobby.delete_lobby({ decidee_id })
        res.status(200).send('Lobby deleted')
    },
    recreateLobby: async (req, res) => {
        const { decidee_id } = req.session.user
        const db = req.app.get('db')

        await db.lobby.delete_lobby({ decidee_id })
        const [newLobby] = await db.lobby.create_lobby({ decidee_id })
        res.status(201).send(newLobby)
    },
    getLobby: async (req, res) => {
        const { id } = req.params
        const db = req.app.get('db')

        const [foundLobby] = await db.lobby.get_lobby({ lobby_id: +id })
        if (!foundLobby) {
            return res.status(404).send('Lobby ID does not exist')
        }

        res.status(200).send(foundLobby)
    }
}