require('dotenv').config()
const express = require('express'),
    session = require('express-session'),
    massive = require('massive'),
    authCtrl = require('./controllers/authController'),
    lobbyCtrl = require('./controllers/lobbyController'),
    { SERVER_PORT, SESSION_SECRET, CONNECTION_STRING } = process.env,
    app = express()

app.use(express.json())
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 }
}));

massive({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
}).then(db => {
    app.set('db', db)
    console.log('DB ONLINE!!!!')
});

app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)
app.get('/auth/user', authCtrl.getUser)
app.put('/auth/user/:id', authCtrl.editUser)

//LOBBY ENDPOINTS (GRAND MASTER ARCHITECT EXTRAORDINAIRE: SDE )
app.post('/api/lobby', lobbyCtrl.createLobby)
app.put('/api/lobby', lobbyCtrl.recreateLobby)
app.delete('/api/lobby', lobbyCtrl.deleteLobby)
app.get('/api/lobby/:id', lobbyCtrl.getLobby)

app.listen(SERVER_PORT, () => console.log(`APP listening on port: ${SERVER_PORT}`))