import axios from 'axios';
import {useState, useEffect, useContext} from 'react';
import AppContext from '../../context/app-context';

const Friends = (props) => {
    const {decidee} = useContext(AppContext);
    const [friends, setFriends] = useState([]);
    const [pending, setPending] = useState([]);
    const [input, setInput] = useState('');
    const [potentialFriend, setPotentialFriend] = useState(null);

    useEffect(() => {
        axios.get(`/api/friends/${decidee.decidee_id}`)
            .then(res => {
                setFriends(res.data);
            });

        axios.get(`/api/pending/${decidee.decidee_id}`)
            .then(res => {
                setPending(res.data)
            })
    }, [])

    const getPotentialFriend = () => {
        if (input !== ''){
            axios.get(`/api/friend/${input}`)
                .then(res => {
                    setPotentialFriend(res.data);
                })
                .catch(err => console.log(err));
        } else {
            return alert('Please enter a friend code')
        }
    }

    const sendFriendInvite = () => {
        axios.post(`/api/friend/${decidee.decidee_id}`, {friendId: potentialFriend[0].decidee_id})
            .then(res => {
                setPotentialFriend(null);
                setInput('');
                alert(res.data);
            })
            .catch(err => console.log(err));
    }

    const cancelInvite = () => {
        setPotentialFriend(null);
        setInput('');
    }

    const acceptInvite = (friendId, pendingId) => {
        axios.post(`/api/pending/${decidee.decidee_id}`, {friendId, pendingId})
            .then(res => {
                alert(res.data);
            })
            .catch(err => console.log(err));
    }

    const rejectInvite = (pendingId) => {
        axios.delete(`/api/pending/${pendingId}`)
            .then(res => {
                alert(res.data);
            })
            .catch(err => console.log(err));
    }

    const mappedPending = pending.map((el, i) => {
        return <section key={i}>
            <p>{el.username}</p>
            <button onClick={() => acceptInvite(el.sender_id, el.pending_id)}>Accept</button>
            <button onClick={() => rejectInvite(el.pending_id)}>Decline</button>
        </section>
    })

    const mappedFriends = friends.map((el, i) => {
        return <section key={i}>
            <p>{el.username}</p>
        </section>
    })

    return (
        <section>
            <h1>Friends</h1>
            {pending.length > 0 
                ? 
                (
                    <>
                        <h3>Pending Friend Requests</h3>
                        {mappedPending}
                    </>
                ) 
                : null}
            {friends.length > 0 
                ? 
                (
                    mappedFriends
                ) 
                : 
                (
                    <p>Get started by adding a friend!</p>
                )}
            <h3>Find and Add Friends</h3>
            <input placeholder='Enter Friend Code'
                   value={input}
                   onChange={(e) => setInput(e.target.value)}/>
            <button onClick={getPotentialFriend}>Search For Friend</button>
            {potentialFriend
                ? 
                (
                    <>
                        <p>Result: {potentialFriend[0].username}</p>
                        <button onClick={sendFriendInvite}>Send Invite</button>
                        <button onClick={cancelInvite}>Cancel</button>
                    </>
                ) 
                : null}
        </section>
    )
}

export default Friends;