module.exports = {
    getFriends: (req, res) => {
        const { id } = req.params;
        const db = req.app.get('db');

        db.friend.get_friends(id)
            .then(friends => {
                res.status(200).send(friends)
                console.log('MJW', friends)
            })
            .catch(err => res.status(500).send(err));
    },
    addFriend: (req, res) => {

    }
}