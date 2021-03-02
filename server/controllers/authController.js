const bcrypt = require('bcryptjs');
const { S_S3_BUCKET } = process.env;

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

        const [newUser] = await db.decidee.register_decidee({ email, hash, username, profilePic: `https://${S_S3_BUCKET}.s3-us-west-1.amazonaws.com/hungreeThumbSvgFixed.svg` })

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
    },
    editUser: async (req, res) => {
        console.log(req.body)
        const { username, email } = req.body
        const db = req.app.get('db')
        let newUser = {}
        if (req.session.user.email === email) {
            const [foundUser] = await db.decidee.check_decidee({ username, email: null })
            if (foundUser) {
                return res.status(409).send('Username already taken')
            }
            newUser = db.decidee.edit_decidee_username(+req.params.id, username)

        }
        else if (req.session.user.username === username) {
            const [foundUser] = await db.decidee.check_decidee({ email, username: null })
            if (foundUser) {
                return res.status(409).send('Email already taken')
            }
            newUser = db.decidee.edit_decidee_email(+req.params.id, email)
        }
        else {
            await db.decidee.edit_decidee_username(+req.params.id, username)
            await db.decidee.edit_decidee_email(+req.params.id, email)

        }
        [newUser] = await db.decidee.check_decidee_id(+req.params.id)
        delete newUser.password
        console.log(newUser)
        req.session.user = newUser
        res.status(201).send(req.session.user)
    },
    editProfilePic: (req, res) => {
        const { decideeId } = req.params;
        console.log(decideeId)
        const { newProfilePic } = req.body;
        console.log(newProfilePic)
        const db = req.app.get('db');

        db.decidee.edit_profile_pic([newProfilePic, decideeId])
            .then(user => res.status(200).send(user))
            .catch(err => res.status(500).send(err));
    }
}