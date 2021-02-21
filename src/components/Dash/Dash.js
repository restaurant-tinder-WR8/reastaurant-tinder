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
    const [lobbyId, setLobbyId] = useState(null)
    const [lobbyMemberList, setLobbyMemberList] = useState(null)
    const [pendingList, setPendingList] = useState(null)
    const [joinLobbyView, setJoinLobbyView] = useState(false)
    const [chatView, setChatView] = useState(false)
    const [lobbyIdInput, setLobbyIdInput] = useState('')

    const [chatArr, setChatArr] = useState([])
    const [messageInput, setMessage] = useState('');

    const handleBackBtn = () => {
        setJoinLobbyView(false);
        setChatView(false);
        removeLobbyMember(decidee.decidee_id)
        props.history.goBack();
    }


    const handleHostLobby = () => {
        axios.post('/api/lobby')
            .then(res => {
                const { lobby_id, memberList } = res.data
                setLobbyId(lobby_id)
                console.log(memberList)
                setLobbyMemberList(memberList)
                props.history.push(`${url}/lobby/${res.data.lobby_id}`)
                setChatView(true)
            })
            .catch(err => console.log(err))
    }

    const handleJoinLobby = () => {
        axios.put(`/api/lobby/${lobbyIdInput}`)
            .then(res => {
                console.log(res.data)
                const { lobby_id, memberList } = res.data;
                setLobbyId(lobby_id)
                setLobbyMemberList(memberList)
                props.history.push(`${url}/lobby/${lobbyId}`)
                setJoinLobbyView(false)
                setChatView(true)
            })
            .catch(err => console.log(err))
    }

    const handleInviteTolobby = (friend_id) => {
        if (lobbyId) {
            axios.post('/api/pending-lobby', { lobbyId, friend_id })
                .then(res => console.log(res.data))
                .catch(err => console.log(err))
        }
    }

    const addLobbyMember = useCallback((decidee_id) => {
        axios.post(`/api/lobby-members`, { lobbyId, decidee_id })
            .then(res => setLobbyMemberList(res.data))
            .catch(err => console.log(err.data))
    })

    const removeLobbyMember = useCallback((decidee_id) => {
        axios.put(`/api/lobby-members`, { lobbyId, decidee_id })
            .then(res => setLobbyMemberList(res.data))
            .catch(err => console.log(err))
    })

    const getLobbyMembers = useCallback(() => {
        axios.get(`/api/lobby-members/${lobbyId}`)
            .then(res => console.log('SDE: ', res.data))
            .catch(err => console.log(err))
    })

    const getLobbyChat = useCallback(() => {
        axios.get(`/api/lobby-chat/${lobbyId}`)
            .then(res => {
                console.log(res.data)
                setChatArr(res.data)

            })
            .catch(err => console.log(err))
    })

    useEffect(() => {
        if (!lobbyId) {
            initSocket(lobbyId)
        } else {
            subscribeToChat(lobbyId, err => {
                if (err) return;
                getLobbyChat();
            });

            getLobbyChat();
        };


    }, [lobbyId])

    useEffect(() => {
        if (decidee) {
            axios.get(`/api/lobby-invites/${decidee.decidee_id}`)
                .then(res => setPendingList(res.data))
                .catch(err => console.log(err))
        }
        return () => {
            disconnectSocket()
        }
    }, [])

    useEffect(() => {
        if (decidee) {
            props.history.push('/dash')
        }
        else {
            props.history.push('/')
        }
    }, [decidee])

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
                        <Lobby {...props}
                            lobbyId={lobbyId}
                            lobbyMemberList={lobbyMemberList}
                            handleBackBtn={handleBackBtn}
                        />
                    )}
                />
            </Switch>
            {joinLobbyView
                && (
                    <>
                        <button onClick={() => setJoinLobbyView(false)}>CLOSE FORM</button>
                        <div>
                            <input value={lobbyIdInput} onChange={(e) => setLobbyIdInput(e.target.value)} placeholder="ENTER LOBBY ID"></input>
                            <button onClick={handleJoinLobby}>JOIN</button>
                        </div>
                    </>

                )
            }
            {
                chatView &&
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
            <div>
                PENDING INVITES:
                {pendingList
                    &&
                    pendingList.map(el => <p>{el.username} has invited you to their lobby!</p>)
                }
            </div>
            <Friends handleInviteTolobby={handleInviteTolobby} />
        </main >

    )


}


export default Dash