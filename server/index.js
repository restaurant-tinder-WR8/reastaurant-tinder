require('dotenv').config()
const express = require('express'),
    session = require('express-session'),
    massive = require('massive'),
    axios = require('axios'),
    cors = require('cors'),
    authCtrl = require('./controllers/authController'),
    lobbyCtrl = require('./controllers/lobbyController'),
    friendCtrl = require('./controllers/friendController'),
    chatCtrl = require('./controllers/chatController'),
    yelpCtrl = require('./controllers/yelpCtrl'),
    socketCtrl = require('./controllers/socketController'),
    upCtrl = require('./controllers/uploadController'),
    { PORT, SESSION_SECRET, DATABASE_URL, API_BASE_URL, APP_BASE_URL } = process.env,
    app = express(),
    http = require('http'),
    socketio = require('socket.io'),
    server = http.createServer(app),
    io = socketio(server, {
        cors: {
            origin: APP_BASE_URL,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true
        }
    })

let lobbyVoteObj = {}
let socketObj = {}

app.set('trust proxy', 1)
app.use(cors({
    credentials: true,
    origin: APP_BASE_URL
}));
app.use(express.json());
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
        secure: true,
        sameSite: 'none'
        // ARBITRARY CHANGE
    }
}));

massive({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
}).then(db => {
    app.set('db', db)
    console.log('DB ONLINE!!!!')
    server.listen(PORT, () => console.log(`APP listening on port: ${PORT}`))
});

io.on('connection', (socket) => {
    console.log(`Connected: ${socket.id}`)

    socket.on('addSocket', (decidee_id) => {
        socketObj[decidee_id] = socket.id
        axios.put(`http://localhost:${PORT}/api/socket/${socket.id}`, { decidee_id })
            .then(res => {
                console.log(res.data)
                const onlineFriendSocketArr = res.data
                onlineFriendSocketArr.forEach(e => {
                    const { socket_id } = e
                    socket.to(socket_id).emit('newFriendOnline')
                })
            })
            .catch(err => console.log(err))
    })

    socket.on('notifyFriendInvite', newFriendId => {
        const foundSocket = socketObj[newFriendId]
        if (foundSocket) {
            socket.to(foundSocket).emit('notifyFriendInvite')
        }
    })

    socket.on('newNotification', ({ receiverId, notificationList }) => {
        socket.broadcast.emit('notify', { receiverId, notificationList })
    })

    socket.on('join', ({ lobbyId, memberList }) => {
        socket.join(lobbyId)
        io.in(lobbyId).emit('newLobbyMemberList', memberList)
    })

    socket.on('leave', ({ lobbyId, memberList }) => {

        socket.leave(lobbyId)
        io.in(lobbyId).emit('newLobbyMemberList', memberList)
    })

    socket.on('chat', (lobbyId) => {
        io.in(lobbyId).emit('newMessage', lobbyId)
    })

    socket.on('lobbyStart', (obj) => {
        const { lobbyId, restaurantList } = obj
        io.in(lobbyId).emit('lobbyStart', restaurantList)
    })

    socket.on('lobbyVote', (obj) => {
        const { lobbyId, vote, memberLength } = obj
        tempArr = lobbyVoteObj[lobbyId] ? lobbyVoteObj[lobbyId] : []
        lobbyVoteObj[lobbyId] = [...tempArr, vote]
        io.in(lobbyId).emit('lobbyVote', { lobbyVoteArr: lobbyVoteObj[lobbyId] })
        if (lobbyVoteObj[lobbyId].length === memberLength) {
            lobbyVoteObj[lobbyId] = []
        }
    })

    socket.on('lobbyResult', (obj) => {
        const { lobbyId, restaurant } = obj
        if (restaurant) {
            axios.get(`http://localhost:${PORT}/api/getRestaurant/${restaurant.id}`)
                .then(res => {
                    io.to(lobbyId).emit('lobbyResult', res.data)
                })
                .catch(err => console.log(err))
        }
        io.to(lobbyId).emit('lobbyResult', null)


    })

    socket.on('nextRestaurant', (obj) => {
        const { lobbyId, newIndex } = obj
        io.to(lobbyId).emit('nextRestaurant', newIndex)
    })

    socket.on('disconnect', () => {
        console.log(`Disconnected: ${socket.id}`)
        axios.delete(`http://localhost:${PORT}/api/socket/${socket.id}`)
            .then(res => {
                const { lobby_id, onlineFriendSockets, decidee_id } = res.data
                delete socketObj[decidee_id]
                if (lobby_id) {
                    io.to(lobby_id).emit('updateLobby', lobby_id)
                }
                onlineFriendSockets.forEach(e => {
                    const { socket_id } = e
                    socket.to(socket_id).emit('newFriendOnline')
                })
            })
            .catch(err => console.log(err))
    })

});

//AUTH ENDPOINTS
app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);
app.get('/auth/user', authCtrl.getUser);
app.put('/auth/user/:id', authCtrl.editUser);
app.put('/auth/picture/:decideeId', authCtrl.editProfilePic);

//LOBBY ENDPOINTS (GRAND MASTER ARCHITECT EXTRAORDINAIRE: SDE, who is very very very handsome... Like WOW! )
app.post('/api/lobby', lobbyCtrl.createLobby);
app.put('/api/lobby', lobbyCtrl.recreateLobby);
app.delete('/api/lobby', lobbyCtrl.deleteLobby);
app.put('/api/lobby/:id', lobbyCtrl.joinLobby);
app.get('/api/lobby-members/:id', lobbyCtrl.getLobbyMembers);
app.post('/api/lobby-members', lobbyCtrl.addLobbyMember);
app.put('/api/lobby-members', lobbyCtrl.removeLobbyMember);
app.post('/api/pending-lobby', lobbyCtrl.addPendingInvite);
app.get('/api/lobby-invites/:id', lobbyCtrl.getLobbyInvites);
app.delete('/api/lobby-invites/:id', lobbyCtrl.removeLobbyInvites);

//SOCKET ENDPOINTS
app.put('/api/socket/:socket_id', socketCtrl.addSocket);
app.delete('/api/socket/:socket_id', socketCtrl.removeSocket);

//FRIENDS ENDPOINTS
app.get('/api/friends/:id', friendCtrl.getFriends);
app.get('/api/friend/:id', friendCtrl.getPotentialFriend);
app.get('/api/pending/:id', friendCtrl.getPending);
app.post('/api/friend/:id', friendCtrl.sendFriendInvite);
app.post('/api/pending/:id', friendCtrl.acceptInvite);
app.put('/api/pending/:id', friendCtrl.rejectInvite);

//CHAT ENDPOINTS
app.get('/api/lobby-chat/:lobbyId', chatCtrl.getLobbyChat);
app.post('/api/lobby-chat', chatCtrl.addMessageToLobby);

//YELP ENDPOINTS
app.post(`/api/getRestaurants`, yelpCtrl.getRestaurants);
app.get(`/api/getRestaurant/:id`, yelpCtrl.getRestaurant);

//UPLOAD ENDPOINTS (S3)
app.get('/api/signs3', upCtrl.upload);


//COMEMEMETMOEITJEOITJOj


