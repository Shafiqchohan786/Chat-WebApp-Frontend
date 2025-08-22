import { useState } from 'react';
import { useNavigate } from "react-router";
import axios from 'axios';
import toast from 'react-hot-toast';
import { Baseurl } from '../../services api/baseurl';

export default function Register() {
  const usenagi = useNavigate();
  const [user, setuser] = useState({
    name: '',
    email: '',
    password: '',
    profile: null,
  });

  const handlsubmit = async (e) => {
    e.preventDefault();
    try {
      const formadata = new FormData();
      formadata.append('name', user.name);
      formadata.append('email', user.email);
      formadata.append('password', user.password);
      formadata.append('profile', user.profile);

      const res = await axios.post(`${Baseurl}/api/auth/register`, formadata, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const data = res.data;

      if (res.status === 200) {
        toast.success(data.message);
        setuser({ name: '', email: '', password: '', profile: null });
        usenagi('/login');
      }
    } catch (error) {
      if (error?.response?.data) toast.error(error.response.data.message);
      console.log(error);
    }
  }

  const handlinput = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile') {
      setuser({ ...user, [name]: files[0] });
    } else {
      setuser({ ...user, [name]: value });
    }
  }

  const handllogin = () => {
    usenagi('/login');
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-box">
          <h1 className="register-title">ChatHub WebApp</h1>
          <form className="register-form" onSubmit={handlsubmit}>
            
            {/* Profile Image */}
            <div className="profile-upload">
              <label htmlFor="profile">
                <img
                  src={user.profile ? URL.createObjectURL(user.profile) : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_aZ5dsa-PRx_4ozdsfmRi6kNoZdG18gCv8Em9EtWrHCYJD3OT5sKer3_UfZ4c2uc8lrg&usqp=CAU'}
                  alt="Profile"
                  className="profile-img"
                />
                <input type="file" id="profile" name="profile" onChange={handlinput} className="hidden-input" />
              </label>
            </div>

            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handlinput}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handlinput}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handlinput}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="register-btn">Register</button>

            <p className="login-link">
              Already have an account? 
              <span onClick={handllogin}> Login</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
