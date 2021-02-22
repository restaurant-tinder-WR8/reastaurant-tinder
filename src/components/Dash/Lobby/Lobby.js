

const Lobby = props => {

    const { lobbyId, handleLeaveLobby, lobbyMemberList } = props;

    const startLobby = () => {
        props.history.push(`/dash/lobbyactive/${lobbyId}`)
    }

    console.log(lobbyMemberList)
    return (
        <div>
            <button onClick={handleLeaveLobby}>LEAVE LOBBY</button>
            <h3>LOBBY-ID: {lobbyId}</h3>
            <div className='member-list-container'>
                LOBBY MEMBERS:
                {lobbyMemberList
                    && (
                        lobbyMemberList.map((el) => {
                            return <p>{el.username}</p>
                        })
                    )
                }
            </div>
            <button onClick={startLobby}>Start Lobby</button>

        </div>
    )
}

export default Lobby;