import "./LobbyResult.scss"

const LobbyResult = props => {
    const { result, handleLeaveLobby } = props


    return (
        <section className="session">
            <div className="restaurant-container">
                <img className="photo-container" src={result?.image_url} />
                <div className="info">
                    <h2>{result?.name}</h2>
                    <h3>Rating {result?.rating}</h3><h3>Cost({result?.price})</h3>
                </div>
            </div>
            {/* <button onClick={ }>Menu </button> */}
            <button onClick={handleLeaveLobby}>Leave Lobby</button>

        </section>
    )
}
export default LobbyResult;