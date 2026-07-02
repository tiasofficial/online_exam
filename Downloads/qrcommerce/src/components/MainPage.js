import React from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Welcome to the Qcommerce!</h2>
      <p>Generate Your QR</p>
      <p>Please select an option:</p>
      <div style={styles.linksContainer}>
        <Link to="/customer-registration" style={styles.link}>
          Customer User Registration
        </Link>
        <Link to="/login" style={styles.link}>
          Login
        </Link>
      </div>
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
  linksContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  link: {
    margin: '0 10px',
    padding: '10px 20px',
    borderRadius: '5px',
    background: '#007bff',
    color: '#fff',
    textDecoration: 'none',
  },
};

export default MainPage;
