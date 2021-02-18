import { useState, useEffect, useContext } from "react";
import axios from 'axios';
import AppContext from "../../context/app-context";
import Friends from './Friends';

const Dash = (props) => {
    const { decidee } = useContext(AppContext)
    const [joinLobbyView, setJoinLobbyView] = useState(false)
    const [lobbyView, setLobbyView] = useState(false)
    const [lobbyId, setLobbyId] = useState(null)
    const [lobbyIdInput, setLobbyIdInput] = useState('')

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