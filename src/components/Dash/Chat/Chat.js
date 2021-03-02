import { useState, useContext } from 'react';
import { sendMessage } from '../../../Sockets/ChatSocket';
import AppContext from "../../../context/app-context";
import './Chat.scss';

const Chat = props => {
    const { lobbyId, chatArr } = props;
    const { decidee } = useContext(AppContext)
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
                    <div className="chat-scroll-box">


                        {chatArr?.map(message => {

                            return (
                                <div className={`message ${decidee.decidee_id === message.decidee_id ? "user-message" : ''}`} key={message.message_id}>
                                    <div className="message-profile">

                                        <img className='chatImg' src={message.profile_pic} />
                                        <p>{message.username} </p>
                                    </div>
                                    <p>{message.message_text}</p>
                                </div>
                            )
                        })}
                        <div className="chat-input-sticky">
                            <input
                                id="chat-input"
                                type="text"
                                name="name"
                                value={messageInput}
                                onChange={e => setMessageInput(e.target.value)}
                            />
                            <button className="pointer" onClick={handleSendMessage}>Send</button>
                        </div>

                    </div>

                </div>
            </section>
        </div>
    )

}

export default Chat;