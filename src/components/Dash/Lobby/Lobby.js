

const Lobby = props => {

    const { lobbyId, handleBackBtn, lobbyMemberList } = props;

    console.log(lobbyMemberList)
    return (
        <div>
            <button onClick={handleBackBtn}>BACK</button>
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
            <button>INVITE FRIENDS</button>
        </div>
    )
}

export default Lobby;