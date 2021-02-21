module.exports = {
    getLobbyChat: async (req, res) => {
        const { lobbyId } = req.params
        const db = req.app.get('db')

        const chatArr = await db.chat.get_lobby_chat({ lobbyId })
        res.status(200).send(chatArr)
    },
    addMessageToLobby: async (req, res) => {
        const { lobbyId, message } = req.body
        const { decidee_id } = req.session.user
        const db = req.app.get('db')
        console.log('hit')
        await db.chat.add_message_to_lobby({ lobbyId, message, decidee_id })
        const newChatArr = await db.chat.get_lobby_chat({ lobbyId })
        res.status(201).send(newChatArr)
    }
}