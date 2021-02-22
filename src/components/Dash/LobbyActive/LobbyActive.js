import axios from "axios";
import { useState, useEffect, useContext } from "react";
import AppContext from "../../../context/app-context";
import "./LobbyActive.scss"
import useGeolocation from 'react-hook-geolocation'




const LobbyActive = () => {
    const [restaurantList, setRestaurants] = useState([])
    const geoLocation = useGeolocation()
    const searchRestaurants = () => {
        axios.post(`/api/getRestaurants`, geoLocation)
            .then(res => {
                setRestaurants(
                    res.data
                )
            })

    }

    return (
        <section className="session">
            <button onClick={searchRestaurants}>Get Restaurants</button>
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