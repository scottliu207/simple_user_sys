import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    axios.post(`${process.env.SERVER_DOMAIN}/api/user/v1/login`, { username, password })
      .then(response => {
        console.log('User logged in:', response.data);
        alert('Login successful');
      })
      .catch(error => {
        console.error('Error logging in:', error);
        alert('Login failed');
      });
  };

  return (
    <div className="mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      <div className="mt-3" id="googleSignInButton"></div>
    </div>
  );
};



export default Login;
