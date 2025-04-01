import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Test the proxy connection
    axios.get('/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Therapy Booking App</h1>
        <h2>Users</h2>
        <ul>
          {users.map(user => (
            <li key={user.user_id}>{user.name} - {user.email}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;