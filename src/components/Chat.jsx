import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Baseurl } from '../../services api/baseurl';
import { MdKeyboardVoice } from 'react-icons/md';
import { IoIosSend } from 'react-icons/io';
import { CiSearch } from 'react-icons/ci';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoIosVideocam } from 'react-icons/io';

export const Chat = ({ socket }) => {
  const { slectedUser } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  const [messages, setMessages] = useState([]);
  const [messagesend, setMessagesend] = useState(false);

  const ScrollRef = useRef();
  const inputvalue = useRef();

  const getMessages = async () => {
    if (!user || !slectedUser) return;

    try {
      const senderdata = {
        senderId: user._id,
        receiverId: slectedUser._id,
      };
      const res = await axios.post(`${Baseurl}/api/messages/get_messages`, senderdata);
      setMessages(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user && slectedUser) {
      getMessages();
    }
  }, [slectedUser, user, messagesend]);

  useEffect(() => {
    if (socket) {
      socket.off('receiveMessage');
      socket.on('receiveMessage', (newMessage) => {
        if (newMessage.userId === slectedUser?._id) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      });
    }
  }, [socket, slectedUser]);

  const handlemessaage = async () => {
    if (!slectedUser || !slectedUser._id) return;

    try {
      const messagedata = {
        senderId: user._id,
        receiverId: slectedUser._id,
        message: inputvalue.current.value,
      };

      socket.emit('sendMessage', { messagedata });
      const UpdateMessage = {
        userId: user._id,
        message: inputvalue.current.value,
        time: Date.now(),
      };

      setMessages((prevMessages) => (Array.isArray(prevMessages) ? [...prevMessages, UpdateMessage] : [UpdateMessage]));
      await axios.post(`${Baseurl}/api/messages/send_message`, messagedata);
      inputvalue.current.value = '';
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (ScrollRef.current) {
      ScrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="chat-page">
      {!slectedUser ? (
        <div className="chat-no-user">
          <h1>Get Started by Selecting a User</h1>
        </div>
      ) : (
        <>
          {/* Chat Header */}
          <div className="chat-header">
            <div className="chat-header-left">
              <img src={slectedUser.profile} alt="Profile" className="chat-header-profile" />
              <div>
                <h3 className="chat-header-name">{slectedUser.name}</h3>
              </div>
            </div>
            <div className="chat-header-right">
              <button><IoIosVideocam /></button>
              <button><CiSearch /></button>
              <button><BsThreeDotsVertical /></button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="chat-messages">
            {messages && Array.isArray(messages) && messages.map((message) => (
              <div key={message._id} ref={ScrollRef}>
                <div className={message.userId === user._id ? 'chat-message chat-message-end' : 'chat-message chat-message-start'}>
                  <div className={message.userId === user._id ? 'chat-bubble chat-bubble-sent' : 'chat-bubble chat-bubble-received'}>
                    {message.message}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Field */}
          <div className="chat-input-container">
            <input type="text" placeholder="Type your message..." ref={inputvalue} className="chat-input" />
            <button className="chat-voice-btn" title="Voice Message"><MdKeyboardVoice /></button>
            <button className="chat-send-btn" title="Send Message" onClick={handlemessaage}><IoIosSend /></button>
          </div>
        </>
      )}
    </div>
  );
};
