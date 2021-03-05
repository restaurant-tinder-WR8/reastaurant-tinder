import { useState, useEffect, useContext, useCallback } from "react";
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { initSocket, leaveLobbyRoom, subscribeToChat, sendNotification, lobbyResult, nextRestaurant, joinLobby } from '../../Sockets/ChatSocket';
import useGeolocation from 'react-hook-geolocation'
import axios from 'axios';
import AppContext from "../../context/app-context";
import Friends from './Friends/Friends';
import Lobby from './Lobby/Lobby';
import LobbyActive from './LobbyActive/LobbyActive';
import LobbyResult from './LobbyResult/LobbyResult';
import './Dash.scss';

const Dash = (props) => {
    const { decidee, contextGetFriendsList, getPendingFriends, logo } = useContext(AppContext)
    //Path and url used for nested Switch/Routes
    // const { path, url } = useRouteMatch();
    const [lobbyId, setLobbyId] = useState(null)
    const [lobbyMemberList, setLobbyMemberList] = useState(null)
    const [receiverPendingList, setReceiverPendingList] = useState(null)
    const [lobbyPendingList, setLobbyPendingList] = useState(null)
    const [joinLobbyView, setJoinLobbyView] = useState(false)
    const [lobbyStarted, setLobbyStarted] = useState(false)
    const [lobbyIdInput, setLobbyIdInput] = useState('')
    const [restaurantList, setRestaurants] = useState([])
    const [currentRestaurantsIndex, setCurrentRestaurantIndex] = useState(0)
    const [lobbyVotes, setLobbyVotes] = useState([])
    const [result, setResult] = useState(null)
    const [hostId, setHostId] = useState(null)
    const geoLocation = useGeolocation()
    const [subbed, setSubbed] = useState(false)
    // const [lobbyVoteIndicatorArr, setLobbyVoteIndicatorArr] = useState([])

    const [chatArr, setChatArr] = useState([])

    const handleHostLobby = () => {
        axios.post('/api/lobby')
            .then(res => {
                const { lobby_id, memberList, host_id } = res.data
                setHostId(host_id)
                setLobbyId(lobby_id)
                joinLobby({ lobbyId: lobby_id, memberList })
                setLobbyMemberList(memberList)
                props.history.push(`/dash/lobby/${lobby_id}`)
                setLobbyStarted(true)
            })
            .catch(err => console.log(err))
    }

    const handleJoinLobby = (targetLobbyId) => {
        axios.put(`/api/lobby/${targetLobbyId}`)
            .then(res => {
                const { lobby_id, host_id, memberList, newInviteList } = res.data;
                setHostId(host_id)
                setLobbyId(lobby_id)
                setLobbyMemberList(memberList)
                joinLobby({ lobbyId: lobby_id, memberList })
                setReceiverPendingList(newInviteList)
                props.history.push(`/dash/lobby/${lobby_id}`)
                setJoinLobbyView(false)
                setLobbyStarted(true)
            })
            .catch(err => console.log(err))
    }

    const handleDeclineInvite = (targetLobbyId) => {
        axios.delete(`/api/lobby-invites/${targetLobbyId}`)
            .then(res => {
                setReceiverPendingList(res.data)
            })
            .catch(err => console.log(err))
    }

    const handleLeaveLobby = () => {
        const { decidee_id } = decidee
        axios.put(`/api/lobby-members`, { decidee_id, lobbyId })
            .then(res => {
                setChatArr([])
                setLobbyVotes([])
                leaveLobbyRoom(lobbyId, res.data)
                setLobbyId(null)
                setJoinLobbyView(false);
                props.history.push(`/dash`)
                setLobbyStarted(false)
            })
            .catch(err => console.log(err))
    }

    const handleInviteTolobby = (friend_id) => {
        if (lobbyId) {
            axios.post('/api/pending-lobby', { lobbyId, friend_id })
                .then(res => {
                    const { newLobbyPendingList, newReceiverPendingList } = res.data;
                    setLobbyPendingList(newLobbyPendingList)
                    sendNotification(friend_id, newReceiverPendingList)
                })
                .catch(err => console.log(err))
        }
    }

    // const addLobbyMember = useCallback((decidee_id) => {
    //     axios.post(`/api/lobby-members`, { lobbyId, decidee_id })
    //         .then(res => setLobbyMemberList(res.data))
    //         .catch(err => console.log(err.data))
    // })

    // const removeLobbyMember = useCallback((decidee_id) => {
    //     axios.put(`/api/lobby-members`, { lobbyId, decidee_id })
    //         .then(res => setLobbyMemberList(res.data))
    //         .catch(err => console.log(err))
    // })
    const scrollToEnd = useCallback(() => {
        const chatScroll = document.querySelector('#chat-inner-container');
        chatScroll.scrollTop = chatScroll.scrollHeight;
    })


    const getLobbyMembers = useCallback(() => {
        axios.get(`/api/lobby-members/${lobbyId}`)
            .then(res => {
                setLobbyMemberList(res.data)
            })
            .catch(err => console.log(err))
    })

    const getLobbyChat = useCallback((tempLobbyId) => {
        axios.get(`/api/lobby-chat/${tempLobbyId}`)
            .then(res => {
                setChatArr(res.data)
                scrollToEnd();
                console.log(res.data)
            })
            .catch(err => console.log(err))
    })
    //Redundancy to push user back to auth if not logged in
    useEffect(() => {
        if (decidee) {
            props.history.push('/dash')
        }
        else {
            props.history.push('/')
        }
    }, [decidee])

    useEffect(() => {
        if (lobbyMemberList) {
            if (!lobbyMemberList.some(e => hostId === e.decidee_id)) {
                setHostId(decidee.decidee_id)
            }
        }
    }, [lobbyMemberList])

    useEffect(() => {
        //Create socket on component mount as well as socket listeners for notifications and lobby member changes
        if (!lobbyId && decidee) {
            //This has a cb functions that are not ran by this invocation but only on socket event that it is being passed to in ChatSocket.js
            console.log('SOCKET-INIT-RUNNING')
            initSocket(
                decidee.decidee_id,
                (notificationList) => {
                    setReceiverPendingList(notificationList)
                },
                (memberList => {
                    setLobbyMemberList(memberList)

                }),
                () => {
                    contextGetFriendsList()
                },
                () => {
                    getPendingFriends()
                })
        } else if (lobbyId && decidee && subbed === false) {
            //This has a cb function that is not ran by this invocation but only on socket event that it is being passed to in ChatSocket.js
            subscribeToChat(
                lobbyId,
                (lobbyId) => {
                    getLobbyChat(lobbyId);
                },
                (newRestaurantList) => {
                    setRestaurants(newRestaurantList)
                    props.history.push(`/dash/lobbyactive/${lobbyId}`)
                },
                (lobbyVoteArr) => {
                    setLobbyVotes(lobbyVoteArr)
                },
                (restaurant) => {
                    setResult(restaurant)
                    setCurrentRestaurantIndex(0)
                    props.history.push(`/dash/lobby-result/${lobbyId}`)
                },
                (newIndex) => {
                    setLobbyVotes([])
                    setCurrentRestaurantIndex(newIndex)
                },
                () => {
                    getLobbyMembers()
                }
            )
            setSubbed(true)

        };
    }, [lobbyId, decidee])

    useEffect(() => {
        if (lobbyId) {
            getLobbyChat(lobbyId)
        }
    }, [lobbyId])

    useEffect(() => {
        if (lobbyVotes.length > 0) {
            if (lobbyVotes.length === lobbyMemberList?.length && !lobbyVotes.some(vote => vote === false)) {
                console.log('EVERYONE MATCHED!')
                setTimeout(() => {
                    lobbyResult(lobbyId, restaurantList[currentRestaurantsIndex])
                }, 1000)
            } else if (lobbyVotes.length === lobbyMemberList?.length && lobbyVotes.some(vote => vote === false)) {
                console.log('NO MATCH VOTING DONE!')
                if (currentRestaurantsIndex === restaurantList.length - 1) {
                    setTimeout(() => {
                        lobbyResult(lobbyId, null)
                    }, 1000)
                    console.log('NOOOOOOOOOO MMMMMMMAAAAAAAAAATCHES EEEEEVERERRRRRR')
                } else {
                    setTimeout(() => {
                        nextRestaurant(lobbyId, currentRestaurantsIndex + 1)
                    }, 1000)
                }
            }
        }
    }, [lobbyVotes])

    useEffect(() => {
        if (decidee) {
            axios.get(`/api/lobby-invites/${decidee.decidee_id}`)
                .then(res => setReceiverPendingList(res.data))
                .catch(err => console.log(err))
        }
        if (lobbyId) {
            props.history.push(`/dash/lobby/${lobbyId}`)
        }

    }, [])

    return (
        <main>
            <Switch>
                <Route exact path={`/dash`}>
                    <div className="welcome-container">
                        {props.history.location.pathname === '/dash' &&
                            <div className="welcome">
                                <h2>Welcome to HUNGREE, {decidee?.username}!</h2>
                            </div>
                        }
                        <div className="button-container">
                            <button className="dash-button" onClick={handleHostLobby}>HOST LOBBY</button>
                            {/* <button className="dash-button" onClick={() => setJoinLobbyView(true)}>JOIN LOBBY</button> */}
                        </div>

                    </div>

                </Route>
                <Route
                    path={`/dash/lobby/:id`}
                    render={props => (
                        //Using render props in order to pass lobby info and functions within routes
                        <Lobby {...props}
                            scrollToEnd={scrollToEnd}
                            logo={logo}
                            hostId={hostId}
                            lobbyId={lobbyId}
                            chatArr={chatArr}
                            lobbyMemberList={lobbyMemberList}
                            handleLeaveLobby={handleLeaveLobby}
                            geoLocation={geoLocation}
                        />
                    )}
                />
                <Route
                    path={`/dash/lobbyactive/:id`}
                    render={props => (
                        <LobbyActive {...props}
                            scrollToEnd={scrollToEnd}
                            logo={logo}
                            decidee_id={decidee?.decidee_id}
                            lobbyId={lobbyId}
                            chatArr={chatArr}
                            lobbyVotes={lobbyVotes}

                            memberLength={lobbyMemberList?.length}
                            handleLeaveLobby={handleLeaveLobby}
                            restaurantList={restaurantList}
                            currentRestaurantsIndex={currentRestaurantsIndex}
                            lobbyVotes={lobbyVotes}
                        />
                    )}
                />
                <Route
                    path={`/dash/lobby-result/:id`}
                    render={props => (
                        <LobbyResult {...props}
                            scrollToEnd={scrollToEnd}
                            logo={logo}
                            lobbyId={lobbyId}
                            chatArr={chatArr}
                            handleLeaveLobby={handleLeaveLobby}
                            lobbyId={lobbyId}
                            result={result}
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
                            <button onClick={() => handleJoinLobby(lobbyIdInput)}>JOIN</button>
                        </div>
                    </>

                )
            }

            <Friends
                handleInviteTolobby={handleInviteTolobby}
                lobbyStarted={lobbyStarted}
                receiverPendingList={receiverPendingList}
                handleJoinLobby={handleJoinLobby}
                handleDeclineInvite={handleDeclineInvite} />
        </main >

    )


}


export default Dash