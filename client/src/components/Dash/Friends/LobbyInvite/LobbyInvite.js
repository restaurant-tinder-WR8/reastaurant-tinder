import { useState } from 'react';

const LobbyInvite = props => {
    const { lobbyStarted, el, handleAcceptJoinInvite, handleDeclineInvite } = props;
    const [showInvite, setShowInvite] = useState(false)
    return (

        <section className='friend-list-item online-friend'
            onMouseEnter={() => !lobbyStarted ? setShowInvite(true) : null} onMouseLeave={() => !lobbyStarted ? setShowInvite(false) : null}
        >
            <p key={el.row_id}>{el.username} has invited you to their lobby!</p>
            {/* {showInvite && ( */}
            <div id='lobby-invite-item-btn-container'>
                <button id='friend-invite-btn' className='lobby-invite-btn' onClick={() => handleAcceptJoinInvite(el.lobby_id)}>JOIN</button>
                <button id='friend-invite-btn' className='lobby-invite-btn' onClick={() => handleDeclineInvite(el.lobby_id)}>DECLINE</button>
            </div>
        </section>
    )
}

export default LobbyInvite;