const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const { email, password, username } = req.body;

        const db = req.app.get('db')

        const [foundUser] = await db.decidee.check_decidee({ email, username })
        if (foundUser) {
            return res.status(409).send('Email/Username already taken')
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const [newUser] = await db.decidee.register_decidee({ email, hash, username })

        req.session.user = newUser;
        res.status(201).send(req.session.user)
    },
    login: async (req, res) => {
        const { userOrEmail, password } = req.body;
        const db = req.app.get('db')

        const [foundUser] = await db.decidee.check_decidee_login({ userOrEmail })

        if (!foundUser) {
            return res.status(400).send('Account not found')
        }

        const authenticated = bcrypt.compareSync(password, foundUser.password)
        if (!authenticated) {
            return res.status(401).send('Password is incorrect!')
        }

        delete foundUser.password
        req.session.user = foundUser
        res.status(202).send(req.session.user)
    },
    logout: (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    },
    getUser: async (req, res) => {
        if (!req.session.user) {
            return res.status(404).send('No user is logged in')
        }
        res.status(200).send(req.session.user)
    }
}