import { useState, useEffect, useContext, useCallback } from "react";
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { initSocket, disconnectSocket, subscribeToChat, sendMessage } from '../../Sockets/ChatSocket';
import axios from 'axios';
import AppContext from "../../context/app-context";
import Friends from './Friends/Friends';
import Lobby from './Lobby/Lobby';
import './Dash.scss';

const Dash = (props) => {
    const { decidee } = useContext(AppContext)
    //Path and url used for nested Switch/Routes
    const { path, url } = useRouteMatch();
    const [joinLobbyView, setJoinLobbyView] = useState(false)
    const [lobbyView, setLobbyView] = useState(false)
    const [lobbyId, setLobbyId] = useState(null)
    const [lobbyIdInput, setLobbyIdInput] = useState('')

    const handleBackBtn = () => {
        setJoinLobbyView(false);
        setLobbyView(false);
        props.history.goBack();
    }

    const [chatArr, setChatArr] = useState([])
    const [messageInput, setMessage] = useState('');

    const handleHostLobby = () => {
        axios.post('/api/lobby')
            .then(res => {
                console.log('SDE', res.data)
                setLobbyId(res.data.lobby_id)
                props.history.push(`${url}/lobby/${res.data.lobby_id}`)
                setLobbyView(true)
            })
            .catch(err => {
                console.log(err.response)
                if (err.response.status === 302) {
                    setLobbyId(err.response.data.lobby_id)
                    props.history.push(`${url}/lobby/${err.response.data.lobby_id}`)
                    setLobbyView(true)
                }
            })
    }

    const handleJoinLobby = () => {
        axios.get(`/api/lobby/${lobbyIdInput}`)
            .then(res => {
                console.log(res.data)
                setLobbyId(res.data.lobby_id)
                props.history.push(`${url}/lobby/${lobbyId}`)
                setJoinLobbyView(false)
                setLobbyView(true)
            })
            .catch(err => console.log(err))
    }

    const getLobbyChat = useCallback(() => {
        axios.get(`/api/lobby-chat/${lobbyId}`)
            .then(res => {
                console.log(res.data)
                setChatArr(res.data)

            })
            .catch(err => console.log(err))
    })

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

    useEffect(() => {
        if (decidee) {
            console.log('TAS', decidee)
            props.history.push('/dash')
        }
        else {
            console.log('TAS', decidee)
            props.history.push('/')
        }
    }, [decidee])
    console.log(props)

    return (
        <main>
            {props.history.location.pathname === '/dash' &&
                <h2>Welcome to HUNGREE, {decidee?.username}!</h2>
            }

            <Switch>
                <Route exact path={`${path}`}>
                    <button onClick={handleHostLobby}>HOST LOBBY</button>
                    <button onClick={() => setJoinLobbyView(true)}>JOIN LOBBY</button>
                </Route>
                <Route
                    path={`${path}/lobby/:id`}
                    render={props => (
                        <Lobby {...props} lobbyId={lobbyId} handleBackBtn={handleBackBtn} />
                    )}
                />
            </Switch>
            {joinLobbyView
                && (
                    <>
                        <button onClick={handleBackBtn}>CLOSE FORM</button>
                        <div>
                            <input value={lobbyIdInput} onChange={(e) => setLobbyIdInput(e.target.value)} placeholder="ENTER LOBBY ID"></input>
                            <button onClick={handleJoinLobby}>JOIN</button>
                        </div>
                    </>

                )}
            {lobbyView &&
                <>
                    <section id='chat-container'>
                        <h2>LOBBY CHAT: {lobbyId}</h2>
                        <div>
                            <h3>Live Chat:</h3>

                            {chatArr?.map(message => <p key={message.message_id}>{message.message_text}</p>)}
                            <input
                                type="text"
                                name="name"
                                value={messageInput}
                                onChange={e => setMessage(e.target.value)}
                            />
                            <button onClick={() => sendMessage(lobbyId, messageInput)}>Send</button>
                        </div>
                    </section>
                </>
            }

            <Friends />
        </main>

    )


}


export default Dash