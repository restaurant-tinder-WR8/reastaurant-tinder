import { useState, useContext, useRef } from 'react';
import { sendMessage } from '../../../Sockets/ChatSocket';
import AppContext from "../../../context/app-context";
import './Chat.scss';

const Chat = props => {
    const { lobbyId, chatArr, scrollToEnd } = props;
    const { decidee } = useContext(AppContext)
    const [messageInput, setMessageInput] = useState('');
    const messageInputRef = useRef()
    // const scrollToEnd = () => {
    //     const chatScroll = document.querySelector('#chat-inner-container');
    //     chatScroll.scrollTop = chatScroll.scrollHeight;
    // }

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (messageInput != '') {
            scrollToEnd();
            sendMessage(lobbyId, messageInput);
            setMessageInput('');
            messageInputRef.current.focus()
        }
    }

    return (
        <div className="chat-master-container active-container">
            <section id='chat-container' >
                <div id='chat-inner-container'>
                    {/* <h2>LOBBY CHAT: {lobbyId}</h2> */}
                    <div className="chat-scroll-box">


                        {chatArr?.map(message => {

                            return (
                                <div className={`message ${decidee.decidee_id === message.decidee_id ? "user-message" : ''}`} key={message.message_id}>
                                    <div className="message-profile">

                                        <img className='chatImg' src={message.profile_pic} />
                                        <p>{message.username} </p>
                                    </div>
                                    <p className='msg-txt-align'>{message.message_text}</p>
                                </div>
                            )
                        })}
                        <form className="chat-input-sticky" onSubmit={handleSendMessage}>
                            <input
                                ref={messageInputRef}
                                id="chat-input"
                                type="text"
                                name="name"
                                value={messageInput}
                                onChange={e => setMessageInput(e.target.value)}
                            />
                            <button className="pointer" type='submit' onClick={handleSendMessage}>Send</button>
                        </form>

                    </div>

                </div>
            </section>
        </div>
    )

}

export default Chat;