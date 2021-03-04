import axios from 'axios';
import { useState, useEffect, useContext, useCallback } from 'react';
import AppContext from '../../../context/app-context';
import OnlineFriend from './OnlineFriend/OnlineFriend';
import LobbyInvite from './LobbyInvite/LobbyInvite';
import PageviewOutlinedIcon from '@material-ui/icons/PageviewOutlined';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import MailRoundedIcon from '@material-ui/icons/MailRounded';
import './Friends.scss';
import { addedFriend, lobbyStart, notifyFriendInvite } from '../../../Sockets/ChatSocket';

const Friends = (props) => {
    const { decidee, onlineFriends, offlineFriends, contextGetFriendsList, pending, setPending, getPendingFriends } = useContext(AppContext);
    const { handleInviteTolobby, lobbyStarted, receiverPendingList, handleJoinLobby, handleDeclineInvite } = props;
    // const [onlineFriends, setOnlineFriends] = useState([]);
    // const [offlineFriends, setOfflineFriends] = useState([]);
    // const [pending, setPending] = useState([]);
    const [input, setInput] = useState('');
    const [potentialFriend, setPotentialFriend] = useState(null);
    const [friendView, setFriendView] = useState(false);
    const [inviteView, setInviteView] = useState(false);

    useEffect(() => {
        if (decidee) {
            contextGetFriendsList()
            getPendingFriends()
        }

    }, [decidee])

    const handleCloseSliders = () => {
        setFriendView(false);
        setInviteView(false);
    }

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
                notifyFriendInvite(potentialFriend[0].decidee_id)
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
                addedFriend(decidee.decidee_id)
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
            <p>{el.username}</p>
            <button onClick={() => acceptInvite(el.sender_id, el.pending_id)}>ACCEPT</button>
            <button onClick={() => rejectInvite(el.pending_id)}>DECLINE</button>
        </section>
    })

    const mappedOfflineFriends = offlineFriends.map((el, i) => {
        return <section className='friend-list-item' key={i}>
            <p onClick={() => handleInviteTolobby(el.friend_decidee_id)}>{el.username}</p>
        </section>
    })

    const mappedOnlineFriends = onlineFriends.map((el, i) => {
        return <OnlineFriend el={el} key={el.friend_decidee_id} lobbyStarted={lobbyStarted} handleInviteTolobby={handleInviteTolobby} />
    })

    return (
        <>

            {(friendView || inviteView) && (
                <div id='page-block-btn' onClick={handleCloseSliders}></div>
            )}

            <section id='friends-container' className={`${friendView ? 'show-friend-container' : ''}`}>
                <div id='notification-container' className={`${inviteView ? 'show-invite-container' : ''}`}>
                    <div className='friends-toggle-button invite-toggle' onClick={() => setInviteView(!inviteView)}>
                        <div className={`button-text ${receiverPendingList?.length > 0 ? 'notify-color' : ''}`}>
                            {/* <div className={`${friendView ? 'friend-arrow-open' : ''}`}><ArrowDropDownIcon /></div> */}
                            <div className={`${inviteView ? 'invite-flip' : ''}`}>
                                <MailRoundedIcon />
                            </div>
                            {/* <div className={`${friendView ? 'friend-arrow-open' : ''}`}><ArrowDropDownIcon /></div> */}
                        </div>
                    </div>
                    <div id='notification-scroll-container'>
                        <h3>LOBBY INVITES</h3>
                        {receiverPendingList
                            &&
                            receiverPendingList.map(el => <LobbyInvite key={el.row_id} el={el} lobbyStarted={lobbyStarted} handleJoinLobby={handleJoinLobby} handleDeclineInvite={handleDeclineInvite} />)
                        }
                    </div>

                </div>
                <div className='friends-toggle-button' onClick={() => setFriendView(!friendView)}>
                    <div className='button-text'>
                        <div className={`${friendView ? 'friend-arrow-open' : ''}`}><ArrowDropDownIcon /></div>
                    FRIENDS
                    <div className={`${friendView ? 'friend-arrow-open' : ''}`}><ArrowDropDownIcon /></div>
                    </div>

                </div>
                <div className="friend-scroll-box-outer-container">

                    <div className="friend-scroll-box">
                        <h3>friends</h3>
                        <div id='list-container'>
                            {pending.length > 0
                                ?
                                (
                                    <>
                                        <h2>PENDING FRIENDS:</h2>
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
                        {potentialFriend && potentialFriend[0]
                            ?
                            (
                                <div id='potential-friend-container'>
                                    <h3>SEARCH RESULT:</h3>
                                    <div id='potential-friend-title-container'>
                                        <div className='fl-img-container' >
                                            <img className={`fl-pics ${potentialFriend[0].profile_pic === 'https://demicog-bikes.s3-us-west-1.amazonaws.com/hungreeThumbSvgFixed.svg' ? 'default-pic' : ''}`} src={potentialFriend[0].profile_pic} alt={potentialFriend[0].username} />
                                        </div>
                                        <p>{potentialFriend[0].username}</p>
                                    </div>

                                    <div className='potential-friend-btn-container'>
                                        <button onClick={sendFriendInvite}>ADD</button>
                                        <button onClick={cancelInvite}>CANCEL</button>
                                    </div>

                                </div>
                            )
                            : null}

                        <div id='find-friend-container'>
                            <h3>Add Friend</h3>
                            <div id="find-friend-input-container">
                                <input className='find-friend-input' placeholder='Enter Friend Code'
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)} />
                                <button className='find-friend-input' onClick={getPotentialFriend}><PageviewOutlinedIcon /></button>
                            </div>

                        </div>

                    </div>
                </div>
            </section>
        </>

    )
}

export default Friends;