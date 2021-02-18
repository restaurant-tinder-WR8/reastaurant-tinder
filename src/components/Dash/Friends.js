import axios from 'axios';
import {useState, useEffect, useContext} from 'react';
import AppContext from '../../context/app-context';

const Friends = (props) => {
    const {decidee, setDecidee} = useContext(AppContext);
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        axios.get(`/api/friend/${decidee.decidee_id}`)
            .then(res => {
                setFriends(res.data)
            })
    }, [])

    const mappedFriends = friends.map((el, i) => {
        return <section key={i}>
            <p>{el.username}</p>
        </section>
    })

    return (
        <section>
            <h1>Friends</h1>
            {mappedFriends}
        </section>
    )
}

export default Friends;