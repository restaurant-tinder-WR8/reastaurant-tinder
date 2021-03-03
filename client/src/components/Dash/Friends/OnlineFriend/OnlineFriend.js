import { useState } from 'react';

const OnlineFriend = props => {
    const { lobbyStarted, el, handleInviteTolobby } = props;
    const [showInvite, setShowInvite] = useState(false)
    return (
        <section className='friend-list-item online-friend'
            onMouseEnter={() => lobbyStarted ? setShowInvite(true) : null} onMouseLeave={() => lobbyStarted ? setShowInvite(false) : null}
        >
            <div className='fl-img-container' >
                <img className={`fl-pics${el.profile_pic === 'https://demicog-bikes.s3-us-west-1.amazonaws.com/hungreeThumbSvgFixed.svg' ? ' default-pic' : ''}`} src={el.profile_pic} alt='friend' />
            </div>
            <p>{el.username}</p>
            {lobbyStarted && (
                <button id='friend-invite-btn' onClick={() => handleInviteTolobby(el.friend_decidee_id)}>INVITE</button>
            )}
        </section>
    )
}

export default OnlineFriend;