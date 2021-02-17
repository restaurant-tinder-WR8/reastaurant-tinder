import { render } from "@testing-library/react"
import { useState, useEffect, useContext } from "react";
import AppContext from "../../context/app-context";

const Dash = (props) => {

    const { decidee } = useContext(AppContext)

    useEffect(() => {

        if (decidee !== null) {
            console.log('TAS', decidee)
            props.history.push('/dash')
        }
        else {
            console.log('TAS', decidee)
            props.history.push('/')
        }
    }, [decidee])

    return (
        <div>
            <p>this is dash</p>
        </div>
    )


}


export default Dash