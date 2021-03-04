import { useState, useEffect, useCallback } from 'react';
import Chat from '../Chat/Chat';
import { lobbyVote } from '../../../Sockets/ChatSocket';
import ThumbUpRoundedIcon from '@material-ui/icons/ThumbUpRounded';
import ThumbDownRoundedIcon from '@material-ui/icons/ThumbDownRounded';
import HourglassEmptyRoundedIcon from '@material-ui/icons/HourglassEmptyRounded';
import "./LobbyActive.scss"

const LobbyActive = props => {
    const { restaurantList, lobbyId, memberLength, currentRestaurantsIndex, chatArr, logo, lobbyVotes } = props
    const [voted, setVoted] = useState(false)

    const [time, setTime] = useState(30000);
    const [timerOn, setTimerOn] = useState(false);
    const [lobbyVoteIndicatorArr, setLobbyVoteIndicatorArr] = useState([])
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

    useEffect(() => {
        let newLobbyArr = []
        for (let i = 0; i < memberLength; i++) {
            newLobbyArr.push(lobbyVotes[i] !== null ? lobbyVotes[i] : null)
        }
        setLobbyVoteIndicatorArr(newLobbyArr)
        console.log(newLobbyArr)
    }, [lobbyVotes])

    const handleVoteBtn = (vote) => {
        if (!voted) {
            setVoted(true)
            lobbyVote(lobbyId, vote, memberLength)
        }
    }

    useEffect(() => {
        console.log(lobbyVotes)
    }, [lobbyVotes])
    useEffect(() => {
        setTime(30000)
        setVoted(false)
        setTimerOn(true)
    }, [currentRestaurantsIndex])

    return (
        <>
            <div className='title-container lobby-title'>
                <img src={logo} alt="Logo" className='logo' />
            </div>
            <Chat lobbyId={lobbyId} chatArr={chatArr} />
            <div className="restaurant-master-container active-container">
                <section className="restaurant-container">
                    {/* <button onClick={searchRestaurants}>Get Restaurants</button> */}
                    <div className="restaurant-container-active">
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

                    <div id='vote-indicator-container'>
                        {lobbyVoteIndicatorArr.map((vote, i) => {
                            if (vote) {
                                return <span className='vote-circle'><ThumbUpRoundedIcon /></span>
                            } else if (vote === false) {
                                return <span className='vote-circle'><ThumbDownRoundedIcon /></span>
                            } else {
                                return <span className='vote-circle'><HourglassEmptyRoundedIcon /></span>
                            }

                        })}
                    </div>

                    {/* <div className="Timers">

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
                </div> */}



                </section >
            </div>
        </>


    )
}
export default LobbyActive;