import React from 'react';
import { useApolloClient } from '@apollo/client';
import {useNavigate} from 'react-router-dom'

const Logout = ({ setToken }) => {
  const client = useApolloClient();
  const navigate = useNavigate()

  const handleLogout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    navigate('/authors')
  };

  return (
    <div>
      <h2>Logout</h2>
      <p>Are you sure you want to logout?</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
