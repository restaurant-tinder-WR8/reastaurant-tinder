import { useState, useEffect } from 'react';
import { lobbyVote } from '../../../Sockets/ChatSocket';
import "./LobbyActive.scss"

const LobbyActive = props => {
    const { restaurantList, lobbyId, memberLength, currentRestaurantsIndex } = props
    const [voted, setVoted] = useState(false)

    const [time, setTime] = useState(30000);
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
        setTime(30000)
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
                        <div><h3>Rating: {restaurantList[currentRestaurantsIndex]?.rating}</h3><h3>Cost({restaurantList[currentRestaurantsIndex]?.price}) </h3></div>
                    </div>
                </div>

                <div className="vote-btns">
                    <button className="stomp" onClick={() => handleVoteBtn(false)}>Stomp</button>
                    <div id="timer-middle"><span className="timer">{(`${Math.floor((time / 1000) % 60)}`).slice(-2)}</span></div>
                    <button className="chomp" onClick={() => handleVoteBtn(true)}>Chomp</button>

                </div>

                <div className="Timers">

                    <div id="display">

                        <div id='timer-middle'>
                            <span >{(`${Math.floor((time / 1000) % 60)}`).slice(-2)}</span>
                        </div>
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