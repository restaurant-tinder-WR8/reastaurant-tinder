import axios from "axios";
import { useState, useEffect, useContext } from "react";
import AppContext from "../../context/app-context";
import "./Session.scss"

const Session = () => {

    return (
        <div>
            <div className="restaurant-container">
                <div className="photo-container"/> 
            <div className="info">   
            <h2>Title of Restaurant</h2>
            <h3>Rating</h3><h3>Cost($$)</h3>
            </div> 
            </div>
            <button>Stomp</button>
            <button>Chomp</button>
            <button>End Session</button>

        </div>
    )
}
export default Session;