import { useState, useEffect } from 'react';
import { lobbyVote } from '../../../Sockets/ChatSocket';
import "./LobbyActive.scss"

const LobbyActive = props => {
    const { restaurantList, lobbyId, lobbyVotes, currentRestaurantsIndex } = props
    const [voted, setVoted] = useState(false)

    const [time, setTime] = useState(5000);
    const [timerOn, setTimerOn] = useState(false);


    useEffect(() => {
        let interval = null;

        if (timerOn) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime - 10);
            }, 10);
        } else if (!timerOn) {
            clearInterval(interval);
        }


        return () => clearInterval(interval);
    }, [timerOn]);

    useEffect(() => {
        if (time <= 0) {
            console.log('5 seconds done')
            setTimerOn(false)
            setTime(5000)
            if (voted === false) {
                handleVoteBtn(false)
            }

        }

    }, [time])

    const handleVoteBtn = (vote) => {
        console.log('hit')
        console.log('vote: ', vote)
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

            <div className="Timers">
                <h2>CountDown</h2>
                <div id="display">
                    <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
                    <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
                    <span>{("0" + ((time / 10) % 100)).slice(-2)}</span>
                </div>

                <div id="buttons">

                    <button onClick={() => setTimerOn(true)}>Start</button>
                    <button onClick={() => setTimerOn(false)}>Stop</button>
                    <button onClick={() => setTime(5000, time)}>Reset</button>
                    <button onClick={() => setTimerOn(true)}>Resume</button>


                </div>
            </div>


            <button>End Session</button>

        </section >
    )
}
export default LobbyActive;