import io from 'socket.io-client';
import axios from 'axios';
let socket;

export const initSocket = (myId, cb1, cb2) => {
    socket = io();
    socket.on('notify', ({ receiverId, notificationList }) => {
        console.log("hit", receiverId, notificationList)
        if (myId === receiverId) {
            return cb1(notificationList)
        }
    })
    socket.on('newLobbyMemberList', (memberList) => {
        return cb2(memberList)
    })
}

export const sendNotification = (receiverId, notificationList) => {
    socket.emit('newNotification', { receiverId, notificationList })
}

export const subscribeToChat = (lobbyId, cb, cb2) => {
    if (!socket) return (true);
    axios.get(`/api/lobby-members/${lobbyId}`)
        .then(res => {
            socket.emit('join', { lobbyId, memberList: res.data })
            socket.on('newMessage', () => {
                return cb(null);
            });
            socket.on('lobbyStart', (restaurantList) => {
                return cb2(restaurantList)
            })
        })
        .catch(err => console.log(err))

}

export const lobbyStart = (lobbyId, restaurantList) => {
    socket.emit('lobbyStart', { lobbyId, restaurantList })
}

export const sendMessage = (lobbyId, message) => {
    if (message === '') return
    if (socket) {
        axios.post('/api/lobby-chat', { lobbyId, message })
            .then(res => {
                console.log(res.data)
                socket.emit('chat', lobbyId)
            })
            .catch(err => console.log(err))
    }
}

export const disconnectSocket = (lobbyId, memberList) => {
    if (lobbyId && socket) {
        socket.emit('leave', { lobbyId, memberList })
        socket.disconnect()
    } else if (socket) {
        socket.disconnect();
    }

    // console.log('A USER DISCONNECTED!')
    // if (socket) socket.disconnect();
}