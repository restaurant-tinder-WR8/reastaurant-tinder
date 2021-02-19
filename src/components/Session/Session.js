import axios from "axios";
import { useState, useEffect, useContext } from "react";
import AppContext from "../../context/app-context";
import "./Session.scss"




const Session = () => {

    return (
        <section className="session">
            <div className="restaurant-container">
                <div className="photo-container"/> 
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
export default Session;