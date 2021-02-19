import io from 'socket.io-client';
import axios from 'axios';
let socket;

export const initSocket = (lobbyId) => {
    socket = io();
    if (socket && lobbyId) {
        socket.emit('join', lobbyId)
    }
}

export const subscribeToChat = (cb) => {
    if (!socket) return (true);
    socket.on('newMessage', () => {
        return cb(null);
    });
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

export const disconnectSocket = () => {
    console.log('A USER DISCONNECTED!')
    if (socket) socket.disconnect();
}