import axios from "axios";
import { useState, useEffect, useContext } from "react";
import AppContext from "../../context/app-context";
import "./Completed.scss"




const Completed = () => {

    return (
        <section className="session">
            <div className="restaurant-container">
                Photo
            </div> 
            <button>Menu</button>
            <button>End</button>

        </section>
    )
}
export default Completed;