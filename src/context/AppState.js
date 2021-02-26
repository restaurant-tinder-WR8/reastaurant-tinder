import { useState, useCallback } from "react";
import axios from 'axios';
import AppContext from "./app-context";

const AppState = (props) => {
    const [decidee, setDecidee] = useState(null);
    const [onlineFriends, setOnlineFriends] = useState([]);
    const [offlineFriends, setOfflineFriends] = useState([]);

    const contextGetFriendsList = useCallback(() => {
        axios.get(`/api/friends/${decidee.decidee_id}`)
            .then(res => {
                const { offlineArr, onlineArr } = res.data
                setOnlineFriends(onlineArr);
                setOfflineFriends(offlineArr);
            })
            .catch(err => console.log(err))
    })

    return (
        <AppContext.Provider
            value={{
                decidee,
                setDecidee,
                onlineFriends,
                offlineFriends,
                setOnlineFriends,
                setOfflineFriends,
                contextGetFriendsList
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};

export default AppState;