import { useState } from 'react';
import { sendMessage } from '../../../Sockets/ChatSocket';
import './Chat.scss';

const Chat = props => {
    const { lobbyId, chatArr } = props;

    const [messageInput, setMessageInput] = useState('');

    const handleSendMessage = () => {
        if (messageInput != '') {
            sendMessage(lobbyId, messageInput)
            setMessageInput('')
        }
    }
    return (
        <div className="chat-master-container active-container">
            <section id='chat-container' >
                <div id='chat-inner-container'>
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
                            onChange={e => setMessageInput(e.target.value)}
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            </section>
        </div>
    )

}

export default Chat;