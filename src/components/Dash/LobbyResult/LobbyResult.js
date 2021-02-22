import "./LobbyResult.scss"

const LobbyResult = props => {
    const { result } = props
    return (
        <section className="session">
            <div className="restaurant-container">
                <img className="photo-container" src={result?.image_url} />
                <div className="info">
                    <h2>Title of Restaurant</h2>
                    <h3>Rating</h3><h3>Cost($$)</h3>
                </div>
            </div>
            <button>Menu</button>
            <button>End</button>

        </section>
    )
}
export default LobbyResult;