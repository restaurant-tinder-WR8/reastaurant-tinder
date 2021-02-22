import "./LobbyActive.scss"

const LobbyActive = props => {
    const { restaurantList } = props

    return (
        <section className="session">
            {/* <button onClick={searchRestaurants}>Get Restaurants</button> */}
            <div className="restaurant-container">
                <img className="photo-container" src={restaurantList[0]?.image_url} />
                <div className="info">
                    <h2>Title of Restaurant</h2>
                    <h3>Rating</h3><h3>Cost($$)</h3>
                </div>
            </div>
            <button className="stomp">Stomp</button>
            <button>Chomp</button>
            <button>End Session</button>

        </section>
    )
}
export default LobbyActive;