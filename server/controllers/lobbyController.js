
module.exports = {
    createLobby: async (req, res) => {
        const { decidee_id } = req.session.user
        const db = req.app.get('db')

        const foundLobby = await db.lobby.check_for_lobby_host_id({ decidee_id })
        const [newLobby] = foundLobby[0] ? foundLobby : await db.lobby.create_lobby({ decidee_id })
        const { lobby_id } = newLobby

        let memberList = await db.lobby.get_lobby_members({ lobbyId: lobby_id })
        if (!memberList.some(member => member.decidee_id === decidee_id)) {
            memberList = await db.lobby.add_lobby_member({ lobbyId: lobby_id, decidee_id })
        }
        res.status(201).send({ lobby_id, memberList })
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
    joinLobby: async (req, res) => {
        const { id } = req.params
        const { decidee_id } = req.session.user;
        const db = req.app.get('db')

        const [foundLobby] = await db.lobby.get_lobby({ lobby_id: id })
        if (!foundLobby) {
            return res.status(404).send('Lobby ID does not exist')
        }
        const { lobby_id } = foundLobby
        const newInviteList = await db.lobby.remove_lobby_invites({ id, decidee_id });
        let memberList = await db.lobby.get_lobby_members({ lobbyId: lobby_id })
        if (!memberList.some(member => member.decidee_id === decidee_id)) {
            memberList = await db.lobby.add_lobby_member({ lobbyId: lobby_id, decidee_id })
        }
        res.status(200).send({ lobby_id, memberList, newInviteList })
    },
    addLobbyMember: async (req, res) => {
        const { decidee_id, lobbyId } = req.body
        const db = req.app.get('db')

        const lobbyMemberList = await db.lobby.add_lobby_member({ decidee_id, lobbyId })
        res.status(200).send(lobbyMemberList)
    },
    removeLobbyMember: async (req, res) => {
        const { decidee_id, lobbyId } = req.body
        const db = req.app.get('db')
        const lobbyMemberList = await db.lobby.remove_lobby_member({ decidee_id, lobbyId })
        res.status(200).send(lobbyMemberList)
    },
    addPendingInvite: async (req, res) => {
        const { friend_id, lobbyId } = req.body
        const { decidee_id } = req.session.user
        const db = req.app.get('db')
        const newLobbyPendingList = await db.lobby.add_pending_invite({ friend_id, decidee_id, lobbyId })
        const newReceiverPendingList = await db.lobby.get_pending_invites({ id: friend_id })
        res.status(200).send({ newLobbyPendingList, newReceiverPendingList })
    },
    getLobbyInvites: async (req, res) => {
        const { id } = req.params;
        const db = req.app.get('db')
        const inviteList = await db.lobby.get_pending_invites({ id })
        res.status(200).send(inviteList[0] ? inviteList : null)
    },
    getLobbyMembers: async (req, res) => {
        const { id } = req.params
        const db = req.app.get('db')
        const lobbyMemberList = await db.lobby.get_lobby_members({ lobbyId: id })
        res.status(200).send(lobbyMemberList)
    },
    removeLobbyInvites: async (req, res) => {
        const { id } = req.params
        const { decidee_id } = req.session.user
        const db = req.app.get('db')

        await db.lobby.remove_lobby_invites({ id, decidee_id })
        //FINISH THIS!
    }
}