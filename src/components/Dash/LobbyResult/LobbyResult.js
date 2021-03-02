import Chat from '../Chat/Chat';
import "./LobbyResult.scss"

const LobbyResult = props => {
    const { result, handleLeaveLobby, chatArr, lobbyId } = props


    return (
        <>
            <Chat lobbyId={lobbyId} chatArr={chatArr} />
            <div className="restaurant-master-container active-container">
                <section className="restaurant-container">
                    <div className="restuarant-result">
                        <img className="photo-container" src={result?.image_url} />
                        <div className="info">
                            <h2>{result?.name}</h2>
                            <h3>Rating {result?.rating}</h3><h3>Cost({result?.price})</h3>
                        </div>
                    </div>
                    {/* <button onClick={ }>Menu </button> */}
                    <button className="lobby-result-button pointer" onClick={handleLeaveLobby}>Leave Lobby</button>

                </section>
            </div>
        </>

    )
}
export default LobbyResult;