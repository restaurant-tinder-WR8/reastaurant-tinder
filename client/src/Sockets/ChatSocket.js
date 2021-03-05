import io from 'socket.io-client';
import axios from 'axios';
let socket;

export const initSocket = (myId, cb1, cb2, cb3, cb4) => {
    if (!socket) {
        socket = io(process.env.REACT_APP_API_URL, {
            withCredentials: true
        });

        socket.on('connect', () => {
            socket.emit('addSocket', myId)
        })

        socket.on('notify', ({ receiverId, notificationList }) => {
            if (myId === receiverId) {
                return cb1(notificationList)
            }
        })
        socket.on('newLobbyMemberList', (memberList) => {
            return cb2(memberList)
        })

        socket.on('newFriendOnline', () => {
            return cb3()
        })

        socket.on('notifyFriendInvite', () => {
            console.log('hit')
            return cb4();
        })
    }
}
//LSJODIJOJOSIJFOIJSODIFJo
//MORE TESTINGION

export const notifyFriendInvite = (newFriendId) => {
    console.log(newFriendId)
    socket.emit('notifyFriendInvite', newFriendId)
}

export const sendNotification = (receiverId, notificationList) => {
    socket.emit('newNotification', { receiverId, notificationList })
}

export const subscribeToChat = (lobbyId, cb, cb2, cb3, cb4, cb5, cb6) => {
    if (socket) {
        console.log('HIT SUBSCRIBE STUFF')
        axios.get(`/api/lobby-members/${lobbyId}`)
            .then(res => {
                socket.emit('join', { lobbyId, memberList: res.data })
                socket.on('newMessage', () => {
                    console.log('hit')
                    return cb();
                });
                socket.on('lobbyStart', (restaurantList) => {
                    return cb2(restaurantList)
                })
                socket.on('lobbyVote', ({ lobbyVoteArr }) => {
                    console.log(lobbyVoteArr)
                    return cb3(lobbyVoteArr)
                })
                socket.on('lobbyResult', (restaurant) => {
                    return cb4(restaurant)
                })
                socket.on('nextRestaurant', (newIndex) => {
                    return cb5(newIndex)
                })
                socket.on('updateLobby', () => {
                    return cb6()
                })
            })
            .catch(err => console.log(err))
    }


}

export const addedFriend = (myId) => {
    socket.emit('addSocket', myId)
}

export const lobbyStart = (lobbyId, restaurantList) => {
    socket.emit('lobbyStart', { lobbyId, restaurantList })
}

export const lobbyVote = (lobbyId, vote, memberLength) => {
    console.log(memberLength)
    socket.emit('lobbyVote', { lobbyId, vote, memberLength })
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

export const leaveLobbyRoom = (lobbyId, memberList) => {
    if (lobbyId && socket) {
        if (memberList !== 'OK') {
            socket.emit('leave', { lobbyId, memberList })
        }
    }
}

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect()
        socket = undefined;
    }
}