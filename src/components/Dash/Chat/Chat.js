import { useState } from 'react';
import { sendMessage } from '../../../Sockets/ChatSocket';
import './Chat.scss';

const Chat = props => {
    const { lobbyId, chatArr } = props;

    const [messageInput, setMessage] = useState('');
    return (
        <section id='chat-container'>
            <h2>LOBBY CHAT: {lobbyId}</h2>
            <div>
                <h3>Live Chat:</h3>

                {chatArr?.map(message => {
                    return (
                        <div key={message.message_id}>
                            <img className='chatImg' src={message.profile_pic} />
                            <p>{message.username}</p>
                            <p>{message.message_text}</p>
                        </div>
                    )
                })}
                <input
                    type="text"
                    name="name"
                    value={messageInput}
                    onChange={e => setMessage(e.target.value)}
                />
                <button onClick={() => sendMessage(lobbyId, messageInput)}>Send</button>
            </div>
        </section>
    )

}

export default Chat;