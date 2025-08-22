import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { SideBar } from '../components/Sidebar';
import { Chat } from '../components/Chat';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { Baseurl } from '../../services api/baseurl';

export default function Home() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null); // Socket connection state
  const navigate = useNavigate();

  useEffect(() => {
    const newSocket = io(Baseurl); // Connect to backend
    setSocket(newSocket);

    if (user && user._id) {
      newSocket.emit('AddUserSocket', user._id);
    }

    return () => newSocket.close();
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="home-page">
      <div className="home-container">
        {/* Sidebar */}
        <div className="sidebar-container">
          <SideBar socket={socket} />
        </div>

        {/* Chat Section */}
        <div className="chat-container">
          <Chat socket={socket} />
        </div>
      </div>
    </div>
  );
}
