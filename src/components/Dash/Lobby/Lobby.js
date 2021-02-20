

const Lobby = props => {

    const { lobbyId, handleBackBtn } = props;


    return (
        <div>
            <button onClick={handleBackBtn}>BACK</button>
            <h3>LOBBY-ID: {lobbyId}</h3>
            <button>INVITE FRIENDS</button>
        </div>
    )
}

export default Lobby;