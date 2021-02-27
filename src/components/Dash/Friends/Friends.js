import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import AppContext from '../../../context/app-context';
import './Friends.scss';

const Friends = (props) => {
    const { decidee, onlineFriends, offlineFriends, setOfflineFriends, setOnlineFriends, contextGetFriendsList } = useContext(AppContext);
    const { handleInviteTolobby } = props;
    // const [onlineFriends, setOnlineFriends] = useState([]);
    // const [offlineFriends, setOfflineFriends] = useState([]);
    const [pending, setPending] = useState([]);
    const [input, setInput] = useState('');
    const [potentialFriend, setPotentialFriend] = useState(null);

    useEffect(() => {
        if (decidee) {
            // axios.get(`/api/friends/${decidee.decidee_id}`)
            //     .then(res => {
            //         const { offlineArr, onlineArr } = res.data
            //         setOnlineFriends(onlineArr);
            //         setOfflineFriends(offlineArr);
            //     })
            //     .catch(err => console.log(err))
            contextGetFriendsList()
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
                contextGetFriendsList()
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
        return <section className='friend-list' key={i}>
            <img className='fl-pics' src={el.profile_pic} alt='pending friend' />
            <p>{el.username}</p>
            <button onClick={() => acceptInvite(el.sender_id, el.pending_id)}>Accept</button>
            <button onClick={() => rejectInvite(el.pending_id)}>Decline</button>
        </section>
    })

    const mappedOfflineFriends = offlineFriends.map((el, i) => {
        return <section className='friend-list-item' key={i}>
            {/* <div className='fl-img-container'>
                <img className={`fl-pics${el.profile_pic === 'https://demicog-bikes.s3-us-west-1.amazonaws.com/hungreeThumbSvg.svg' ? ' default-pic' : ''}`} src={el.profile_pic} alt='friend' />
            </div> */}
            <p onClick={() => handleInviteTolobby(el.friend_decidee_id)}>{el.username}</p>
        </section>
    })

    const mappedOnlineFriends = onlineFriends.map((el, i) => {
        return <section className='friend-list-item online-friend' key={i}>
            <div className='fl-img-container'>
                <img className={`fl-pics${el.profile_pic === 'https://demicog-bikes.s3-us-west-1.amazonaws.com/hungreeThumbSvg.svg' ? ' default-pic' : ''}`} src={el.profile_pic} alt='friend' />
            </div>
            <p onClick={() => handleInviteTolobby(el.friend_decidee_id)}>{el.username}</p>
        </section>
    })

    return (
        <section id='friends-container'>
            <h1>friends</h1>
            <div id="friend-scroll-box">
                {pending.length > 0
                    ?
                    (
                        <>
                            <h3>Pending Friend Requests</h3>
                            {mappedPending}
                        </>
                    )
                    : null}
                {offlineFriends.length > 0 || onlineFriends.length > 0
                    ?
                    (
                        [mappedOnlineFriends, mappedOfflineFriends]
                    )
                    :
                    (
                        <p>Get started by adding a friend!</p>
                    )}
            </div>

            <h3>Find and Add Friends</h3>
            <input placeholder='Enter Friend Code'
                value={input}
                onChange={(e) => setInput(e.target.value)} />
            <button onClick={getPotentialFriend}>Search For Friend</button>
            {potentialFriend && potentialFriend[0]
                ?
                (
                    <>
                        <img className='fl-pics' src={potentialFriend[0].profile_pic} alt={potentialFriend} />
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