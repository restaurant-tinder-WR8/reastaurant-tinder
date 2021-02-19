import { useState, useEffect, useContext, useCallback } from "react";
import axios from 'axios';
import AppContext from "../../context/app-context";
import { initSocket, disconnectSocket, subscribeToChat, sendMessage } from '../../Sockets/ChatSocket'
import Friends from './Friends';

const Dash = (props) => {
    const { decidee } = useContext(AppContext)
    const [joinLobbyView, setJoinLobbyView] = useState(false)
    const [lobbyView, setLobbyView] = useState(false)
    const [lobbyId, setLobbyId] = useState(null)
    const [lobbyIdInput, setLobbyIdInput] = useState('')

    const [messageInput, setMessage] = useState('')
    const [chatArr, setChatArr] = useState([])

    const getLobbyChat = useCallback(() => {
        axios.get(`/api/lobby-chat/${lobbyId}`)
            .then(res => {
                console.log(res.data)
                setChatArr(res.data)

            })
            .catch(err => console.log(err))
    })
    console.log(chatArr)
    useEffect(() => {
        if (lobbyId) {
            initSocket(lobbyId)
            getLobbyChat();
        };
        subscribeToChat(err => {
            if (err) return;
            getLobbyChat();
        });
        return () => {
            disconnectSocket();
        }

    }, [lobbyId])

    const handleBackBtn = () => {
        setJoinLobbyView(false);
        setLobbyView(false);
    }

    const handleCreateLobby = () => {
        axios.post('/api/lobby')
            .then(res => {
                console.log('SDE', res.data)
                setLobbyId(res.data.lobby_id)
                setLobbyView(true)
            })
            .catch(err => {
                console.log(err.response)
                if (err.response.status === 302) {
                    setLobbyId(err.response.data.lobby_id)
                    setLobbyView(true)
                }
            })
    }

    const handleJoinLobby = () => {
        axios.get(`/api/lobby/${lobbyIdInput}`)
            .then(res => {
                console.log(res.data)
                setLobbyId(res.data.lobby_id)
                setJoinLobbyView(false)
                setLobbyView(true)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        if (decidee !== null) {
            console.log('TAS', decidee)
            props.history.push('/dash')
        }
        else {
            console.log('TAS', decidee)
            props.history.push('/')
        }
    }, [decidee])

    return (
        <main>
            <h2>Welcome to HUNGREE, {decidee?.username}!</h2>

            {!joinLobbyView && !lobbyView && (
                <>
                    <button onClick={handleCreateLobby}>CREATE LOBBY</button>
                    <button onClick={() => setJoinLobbyView(true)}>JOIN LOBBY</button>
                </>
            )}

            {lobbyView
                && (
                    <>
                        <button onClick={handleBackBtn}>BACK</button>
                        <div>
                            <h3>LOBBY-ID: {lobbyId}</h3>
                            <button>INVITE FRIENDS</button>
                        </div>
                        <div>
                            <h1>lobbyId: {lobbyId}</h1>
                            <h1>Live Chat:</h1>
                            <input
                                type="text"
                                name="name"
                                value={messageInput}
                                onChange={e => setMessage(e.target.value)}
                            />
                            <button onClick={() => sendMessage(lobbyId, messageInput)}>Send</button>
                            {chatArr?.map(message => <p key={message.message_id}>{message.message_text}</p>)}
                        </div>
                    </>

                )}

            {joinLobbyView
                && (
                    <>
                        <button onClick={handleBackBtn}>BACK</button>
                        <div>
                            <input value={lobbyIdInput} onChange={(e) => setLobbyIdInput(e.target.value)} placeholder="ENTER LOBBY ID"></input>
                            <button onClick={handleJoinLobby}>JOIN</button>
                        </div>
                    </>

                )}
            <div>
                <p>this is dash</p>
                <Friends />
            </div>
        </main>

    )


}


export default Dash