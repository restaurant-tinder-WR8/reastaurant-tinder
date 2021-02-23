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

export const subscribeToChat = (lobbyId, cb, cb2, cb3, cb4, cb5) => {
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
            socket.on('lobbyVote', ({ vote, lobbyVotes }) => {
                return cb3(vote, lobbyVotes)
            })
            socket.on('lobbyResult', (restaurant) => {
                return cb4(restaurant)
            })
            socket.on('nextRestaurant', (newIndex) => {
                return cb5(newIndex)
            })
        })
        .catch(err => console.log(err))

}

export const lobbyStart = (lobbyId, restaurantList) => {
    socket.emit('lobbyStart', { lobbyId, restaurantList })
}

export const lobbyVote = (lobbyId, vote, lobbyVotes) => {
    socket.emit('lobbyVote', { lobbyId, vote, lobbyVotes })
}

export const lobbyResult = (lobbyId, restaurant) => {
    socket.emit('lobbyResult', { lobbyId, restaurant })
}

export const nextRestaurant = (lobbyId, newIndex) => {
    console.log('NEXT REST:', newIndex)

    socket.emit('nextRestaurant', { lobbyId, newIndex })
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