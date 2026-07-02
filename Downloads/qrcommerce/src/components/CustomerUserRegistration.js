import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import customerUsersData from '../components/data/customerUsers.json';

const CustomerUserRegistration = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationSuccessful, setRegistrationSuccessful] = useState(false);

  const handleRegistration = () => {
    try {
      // Save the registration data to the database
      const userData = {
        name,
        email,
        password,
      };

      // Push the new user data to the customerUsersData array in the JSON file
      customerUsersData.customerUsers.push(userData);

      // Clear the input fields after successful registration
      setName('');
      setEmail('');
      setPassword('');

      // Set the registrationSuccessful state to true
      setRegistrationSuccessful(true);
    } catch (error) {
      console.error('Error registering customer user:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Customer User Registration</h2>
      {registrationSuccessful ? (
        <>
          <p>Registration successful!</p>
          <Link to="/login">Click here to login</Link>
        </>
      ) : (
        <>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            style={styles.input}
          />
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
          <button onClick={handleRegistration} style={styles.button}>
            Register
          </button>
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
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

export default CustomerUserRegistration;

