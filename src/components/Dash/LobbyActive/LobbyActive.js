import { useState, useEffect } from 'react';
import { lobbyVote } from '../../../Sockets/ChatSocket';
import "./LobbyActive.scss"

const LobbyActive = props => {
    const { restaurantList, lobbyId, memberLength, currentRestaurantsIndex } = props
    const [voted, setVoted] = useState(false)

    const [time, setTime] = useState(3000);
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
            if (voted === false) {
                handleVoteBtn(false)
            }

        }

    }, [time])

    const handleVoteBtn = (vote) => {
        console.log('hit')
        console.log('voted: ', voted)
        console.log(memberLength)
        if (!voted) {
            setVoted(true)
            lobbyVote(lobbyId, vote, memberLength)
        }
    }

    useEffect(() => {
        setTime(3000)
        setVoted(false)
        setTimerOn(true)
    }, [currentRestaurantsIndex])

    return (
        <div className="restaurant-master-container active-container">
            <section className="restaurant-container">
                {/* <button onClick={searchRestaurants}>Get Restaurants</button> */}
                <div className="">
                    <img className="photo-container" src={restaurantList[currentRestaurantsIndex]?.image_url} />
                    <div className="info">
                        <h2>{restaurantList[currentRestaurantsIndex]?.name}</h2>
                        <h3>Rating: {restaurantList[currentRestaurantsIndex]?.rating}</h3><h3>Cost({restaurantList[currentRestaurantsIndex]?.price}) </h3>
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



            </section >
        </div>
    )
}
export default LobbyActive;