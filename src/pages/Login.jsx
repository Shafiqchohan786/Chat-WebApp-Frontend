import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router";
import { Baseurl } from '../../services api/baseurl';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/fetaures/authSlice';

export default function Login() {
  const usegatReg = useNavigate();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userlogin, setuserlogin] = useState({
    email: "",
    password: ''
  });
  const [loading, setLoading] = useState(false);

  // handle userlogin data 
  const hadleuserlogin = (e) => {
    const { name, value } = e.target;
    setuserlogin({ ...userlogin, [name]: value });
  }

  // handle useloginSubmit 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      email: userlogin.email,
      password: userlogin.password,
    }

    try {
      setLoading(true);
      const resp = await axios.post(`${Baseurl}/api/auth/login`, userData);
      const data = resp.data;
      if (resp.status === 200) {
        toast.success(data.message);
        setuserlogin({ email: '', password: '' });
        dispatch(setCredentials({ user: data.user, token: data.token }));
        navigate('/');
      }
    } catch (error) {
      if (error?.response?.data) toast.error(error.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // register btn click
  const handlReister = () => {
    usegatReg('/register');
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Welcome Back</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                value={userlogin.email}
                onChange={hadleuserlogin}
                type="text"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                name="password"
                value={userlogin.password}
                onChange={hadleuserlogin}
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? <div className="loader"></div> : "Login"}
            </button>

            <p className="register-link">
              Don't have an account? 
              <span onClick={handlReister}> Register here</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
