import React, { useEffect, useState } from "react";
import { CiLogout, CiHome } from "react-icons/ci";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Baseurl } from "../../services api/baseurl";
import { logout } from "../redux/fetaures/authSlice";
import { reomveSelectedUser, setSelectedUser } from "../redux/fetaures/userSlice";

export const SideBar = ({ socket }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [userdata, setUserdata] = useState([]);
  const [search, setSearch] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const resp = await axios.get(`${Baseurl}/api/Auth/get_user`);
      setUserdata(resp.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    if (socket) {
      socket.on("getUsers", (users) => setOnlineUsers(users));
    }
    return () => { if (socket) socket.off("getUsers"); };
  }, [socket]);

  const filteredUsers = userdata
    .filter((curUser) => curUser._id !== user._id)
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  const isUserOnline = (userId) => onlineUsers.some((u) => u.userId === userId);

  const handleLogout = () => {
    dispatch(logout());
    if (socket) socket.disconnect();
    dispatch(reomveSelectedUser());
    window.location.href = "/login"; // simple navigation
  };

  const handleUserSelect = (selectedUser) => { dispatch(setSelectedUser(selectedUser)); };

  return (
    <div className="sidebar">
      {/* Top Profile + Dropdown */}
      <div className="sidebar-profile-container">
        <div className="sidebar-profile">
          <img src={user?.profile} alt="Profile" className="profile-img" />
          <span className="profile-name">{user?.name}</span>
        </div>
        <button className="dropdown-btn" onClick={() => setDropdownOpen(!isDropdownOpen)}>⋮</button>
        {isDropdownOpen && (
          <ul className="dropdown-menu show">
            <li className="dropdown-item"><CiHome /> Home</li>
            <li className="dropdown-item" onClick={handleLogout}><CiLogout /> Logout</li>
          </ul>
        )}
      </div>

      {/* Search + Users Scrollable */}
      <div className="sidebar-scroll">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="search-input"
        />
        <div className="user-list">
          <h6>All Users</h6>
          <ul>
            {filteredUsers.map((curUser) => (
              <li key={curUser._id} className="user-item" onClick={() => handleUserSelect(curUser)}>
                <span className="avatar-wrapper">
                  <img src={curUser.profile} alt="Profile" className="avatar" />
                  {isUserOnline(curUser._id) && <span className="online-dot"></span>}
                </span>
                <span className="user-name">{curUser.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
