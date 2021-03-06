module.exports = {
    getFriends: async (req, res) => {
        const { id } = req.params;
        const db = req.app.get('db');

        const offlineArr = await db.friend.get_offline_friends(id)
        const onlineArr = await db.friend.get_online_friends(id)

        res.status(200).send({ offlineArr, onlineArr })

        // db.friend.get_friends(id)
        //     .then(friends => {
        //         res.status(200).send(friends);
        //     })
        //     .catch(err => res.status(500).send(err));
    },
    getPotentialFriend: (req, res) => {
        const { id } = req.params;
        const db = req.app.get('db');

        db.friend.get_potential_friend(id)
            .then(friend => {
                res.status(200).send(friend);
            })
            .catch(err => res.status(500).send(err));
    },
    getPending: (req, res) => {
        const { id } = req.params;
        const db = req.app.get('db');

        db.friend.get_pending(id)
            .then(pending => {
                res.status(200).send(pending);
            })
            .catch(err => res.status(500).send(err));
    },
    sendFriendInvite: async (req, res) => {
        const { id } = req.params;
        const { friendId } = req.body;
        const db = req.app.get('db');

        const [foundFriendship] = await db.friend.check_friendship(id, friendId);
        if (foundFriendship) {
            return res.status(400).send('You are already friends');
        }

        const [foundPending] = await db.friend.check_pending(id, friendId);
        if (foundPending) {
            return res.status(200).send('Invitation Sent!');
        } else {
            db.friend.add_invitation(id, friendId)
                .then(() => {
                    res.status(200).send('Invitation Sent!');
                })
                .catch(err => res.status(500).send(err));
        }
    },
    acceptInvite: async (req, res) => {
        const { id } = req.params;
        const { friendId, pendingId } = req.body;
        const db = req.app.get('db');

        const friends = await db.friend.add_friend(id, friendId);
        const pending = await db.friend.remove_pending(pendingId, id);

        const acceptArr = [friends, pending];

        res.status(200).send(acceptArr);
    },
    rejectInvite: (req, res) => {
        const { id } = req.params;
        const { pendingId } = req.body;
        const db = req.app.get('db');

        db.friend.remove_pending(pendingId, id)
            .then(pending => {
                res.status(200).send(pending);
            })
            .catch(err => res.status(500).send(err));
    }
}