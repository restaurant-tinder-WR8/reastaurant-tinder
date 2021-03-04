import { useContext } from 'react';
import Chat from '../Chat/Chat';
import { lobbyStart } from '../../../Sockets/ChatSocket';
import AppContext from "../../../context/app-context";
import './Lobby.scss'
import axios from "axios";

const Lobby = props => {
    const { decidee } = useContext(AppContext)
    const { lobbyId, handleLeaveLobby, lobbyMemberList, geoLocation, hostId, chatArr, logo } = props;

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
                let newArr = shuffle(res.data)
                lobbyStart(lobbyId, newArr);
            })
            .catch(err => console.log(err))
    }
    return (
        <>
            <div className='title-container lobby-title'>
                <img src={logo} alt="Logo" className='logo' />
            </div>
            <Chat lobbyId={lobbyId} chatArr={chatArr} />
            <div className="lobby-controls">
                <button className="lobby-btns" onClick={handleLeaveLobby}>LEAVE LOBBY</button>
                <h3>LOBBY-ID: {lobbyId}</h3>
                <div className='member-list-container'>
                    LOBBY MEMBERS:
                {lobbyMemberList
                        && (
                            lobbyMemberList.map((el, i) => {
                                return <p key={i}>{el.username}</p>
                            })
                        )
                    }
                </div>
                {(hostId === decidee?.decidee_id) && <>< button className="lobby-btns" onClick={startLobby}>Start Lobby</button></>}


            </div >
        </>

    )
}

export default Lobby;