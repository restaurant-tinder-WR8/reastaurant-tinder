import { useState, useEffect, useContext } from "react";
import { lobbyStart } from '../../../Sockets/ChatSocket';
import axios from "axios";

const Lobby = props => {
    const { lobbyId, handleLeaveLobby, lobbyMemberList, geoLocation } = props;

    const shuffle = (array) => {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    const startLobby = () => {
        axios.post(`/api/getRestaurants`, geoLocation)
            .then(res => {
                console.log(res.data)
                let newArr = shuffle(res.data)
                console.log(newArr)
                lobbyStart(lobbyId, newArr);
            })
            .catch(err => console.log(err))
    }

    console.log(lobbyMemberList)
    return (
        <div>
            <button onClick={handleLeaveLobby}>LEAVE LOBBY</button>
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
            <button onClick={startLobby}>Start Lobby</button>

        </div>
    )
}

export default Lobby;