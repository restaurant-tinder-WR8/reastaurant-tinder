import { useState, useEffect } from 'react';
import { lobbyVote } from '../../../Sockets/ChatSocket';
import "./LobbyActive.scss"

const LobbyActive = props => {
    const { restaurantList, lobbyId, lobbyVotes, currentRestaurantsIndex } = props
    const [voted, setVoted] = useState(false)

    const handleVoteBtn = (vote) => {
        if (!voted) {
            setVoted(true)
            lobbyVote(lobbyId, vote, lobbyVotes)
        }
    }

    useEffect(() => {
        setVoted(false)
    }, [currentRestaurantsIndex])

    return (
        <section className="session">
            {/* <button onClick={searchRestaurants}>Get Restaurants</button> */}
            <div className="restaurant-container">
                <img className="photo-container" src={restaurantList[currentRestaurantsIndex]?.image_url} />
                <div className="info">
                    <h2>Title of Restaurant</h2>
                    <h3>Rating</h3><h3>Cost($$)</h3>
                </div>
            </div>

            <>
                <button className="stomp" onClick={() => handleVoteBtn(false)}>Stomp</button>
                <button onClick={() => handleVoteBtn(true)}>Chomp</button>
            </>


            <button>End Session</button>

        </section >
    )
}
export default LobbyActive;