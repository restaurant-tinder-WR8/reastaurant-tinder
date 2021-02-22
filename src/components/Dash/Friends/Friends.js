import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/app-context';
import './Friends.scss';

const Friends = (props) => {
    const { decidee } = useContext(AppContext);
    const { handleInviteTolobby } = props;
    const [friends, setFriends] = useState([]);
    const [pending, setPending] = useState([]);
    const [input, setInput] = useState('');
    const [potentialFriend, setPotentialFriend] = useState(null);

    useEffect(() => {
        if (decidee) {
            axios.get(`/api/friends/${decidee.decidee_id}`)
                .then(res => {
                    setFriends(res.data);
                });
            axios.get(`/api/pending/${decidee.decidee_id}`)
                .then(res => {
                    setPending(res.data)
                })
        }

    }, [decidee])

    const getPotentialFriend = () => {
        if (input !== '') {
            if (input === `${decidee.decidee_id}`) {
                return alert('You cannot add yourself as a friend.')
            } else {
                axios.get(`/api/friend/${input}`)
                    .then(res => {
                        setPotentialFriend(res.data);
                    })
                    .catch(err => console.log(err));
            }
        } else {
            return alert('Please enter a friend code')
        }
    }

    const sendFriendInvite = () => {
        axios.post(`/api/friend/${decidee.decidee_id}`, { friendId: potentialFriend[0].decidee_id })
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
        axios.post(`/api/pending/${decidee.decidee_id}`, { friendId, pendingId })
            .then(res => {
                setFriends(res.data[0]);
                setPending(res.data[1]);
            })
            .catch(err => console.log(err));
    }

    const rejectInvite = (pendingId) => {
        axios.put(`/api/pending/${decidee.decidee_id}`, { pendingId })
            .then(res => {
                setPending(res.data);
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
            <p onClick={() => handleInviteTolobby(el.friend_decidee_id)}>{el.username}</p>
        </section>
    })

    return (
        <section id='friends-container'>
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
                onChange={(e) => setInput(e.target.value)} />
            <button onClick={getPotentialFriend}>Search For Friend</button>
            {potentialFriend && potentialFriend[0]
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