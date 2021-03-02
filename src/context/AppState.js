import { useState, useCallback } from "react";
import axios from 'axios';
import AppContext from "./app-context";
import logo from '../assets/hungree.svg'

const AppState = (props) => {
    const [decidee, setDecidee] = useState(null);
    const [onlineFriends, setOnlineFriends] = useState([]);
    const [offlineFriends, setOfflineFriends] = useState([]);
    const [pending, setPending] = useState([])

    const contextGetFriendsList = useCallback(() => {
        axios.get(`/api/friends/${decidee.decidee_id}`)
            .then(res => {
                const { offlineArr, onlineArr } = res.data
                setOnlineFriends(onlineArr);
                setOfflineFriends(offlineArr);
            })
            .catch(err => console.log(err))
    })

    const getPendingFriends = useCallback(() => {
        axios.get(`/api/pending/${decidee.decidee_id}`)
            .then(res => {
                setPending(res.data)
            })
    })

    return (
        <AppContext.Provider
            value={{
                logo,
                decidee,
                setDecidee,
                pending,
                setPending,
                onlineFriends,
                offlineFriends,
                setOnlineFriends,
                setOfflineFriends,
                contextGetFriendsList,
                getPendingFriends
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};

export default AppState;