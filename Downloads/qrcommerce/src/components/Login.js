import React, { useState } from 'react';
import businessUsersData from './data/businessUsers.json';
import customerUsersData from './data/customerUsers.json';
import { BusinessUserDashboard, CustomerUserDashboard } from './UserDashboard';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = () => {
    // Find the user in the businessUsers data based on the provided email
    const businessUser = businessUsersData.businessUsers.find(
      (user) => user.email === email.toLowerCase()
    );

    // Find the user in the customerUsers data based on the provided email
    const customerUser = customerUsersData.customerUsers.find(
      (user) => user.email === email.toLowerCase()
    );

    if (businessUser && businessUser.password === password) {
      // Business user found and password matches, set logged in user data
      setLoggedInUser(businessUser);
    } else if (customerUser && customerUser.password === password) {
      // Customer user found and password matches, set logged in user data
      setLoggedInUser(customerUser);
    } else {
      // User not found or incorrect password, handle login failure
      alert('Invalid email or password. Please try again.');
    }
  };

  return (
    <div>
      {!loggedInUser ? (
        <div style={styles.container}>
          <h2 style={styles.heading}>Login</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={styles.input}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={styles.input}
          />
          <button onClick={handleLogin} style={styles.button}>
            Login
          </button>
          </div>
      ) : (
        <>
          {loggedInUser.userType === 'business' ? (
            <BusinessUserDashboard user={loggedInUser} />
          ) : (
            <CustomerUserDashboard user={loggedInUser} />
          )}
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '50px',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  input: {
    width: '300px',
    height: '30px',
    marginBottom: '10px',
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    width: '150px',
    height: '40px',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Login;



