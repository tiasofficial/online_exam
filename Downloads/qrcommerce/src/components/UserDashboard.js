import React, { useState, useEffect } from 'react';
import { Button, IconButton } from '@material-ui/core';
import { mdiLogout } from '@mdi/js';
import Icon from '@mdi/react';
import QRCodeGenerator from './QRCodeGenerator';
import Web3 from 'web3';
import PaymentContractABI from './PaymentContractABI.json'; // Import the ABI of the deployed smart contract
import PaymentForm from './PaymentForm';

const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545'); // Use local provider if available, otherwise use Ganache or another local provider

const handleLogout = () => {
  alert('Logout successful');
  window.location.href = '/';
};

const BusinessUserDashboard = ({ user }) => {
  const [qrCodeData, setQrCodeData] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePayNow = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePayment = (amount) => {
    // Implement your payment logic here using Web3 or other payment methods
    // For demonstration purposes, we'll just set a static QR code data for business users
    setQrCodeData(`QR code data for business - Amount: ${amount}`);
    setIsModalOpen(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: '0px',
        position: 'relative',
        background: '#b3e0ff', // Light blue background for business user dashboard
        minHeight: '110vh',
        color: 'black', // Set text color to black for better visibility
      }}
    >
      <IconButton
        edge="start"
        color="inherit"
        onClick={handleLogout}
        style={{ position: 'absolute', top: 0, right: 0 }}
      >
        <Icon path={mdiLogout} size={1} color="Red" /> {/* Set logout icon color to black */}
      </IconButton>
      <h2>Business User Dashboard</h2>
      <p>
        Welcome, {user.name} <span role="img" aria-label="Waving Hand">👋</span>
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginTop: '20px' }}>
        <p>This is the dashboard for business users.</p>
        <Button variant="contained" size="large" color="primary" onClick={handlePayNow}>
          Pay Now
        </Button>
        {qrCodeData && <QRCodeGenerator data={qrCodeData} size={200} />}
        {/* Render the PaymentForm */}
        <PaymentForm open={isModalOpen} onClose={handleCloseModal} onConfirm={handlePayment} />
      </div>
    </div>
  );
};


const CustomerUserDashboard = ({ user, qrCodeData, onUpdateQRCode }) => {
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [generatedQRCodeData, setGeneratedQRCodeData] = useState('');

  const handlePayUsingEth = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const contractAddress = '0xE7fF5D7227f4Eb5b7E261c961892bE00dB0A2D99';
      const paymentContract = new web3.eth.Contract(PaymentContractABI, contractAddress);

      // Send the payment to the smart contract
      await paymentContract.methods.pay().send({
        from: accounts[0],
        value: web3.utils.toWei('100', 'ether'), // Replace '100' with the actual payment amount
      });

      // Update the QR code data with the new payment information
      const qrCodeData = `QR code data for customer - Amount: 100`; // Replace '100' with the actual payment amount
      setGeneratedQRCodeData(qrCodeData);
      onUpdateQRCode(qrCodeData);

      // Show the payment success message
      setPaymentSuccessful(true);

      // You may want to update other states or perform additional actions after successful payment
      // For example, update user data, etc.
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  useEffect(() => {
    // Set a timer to hide the payment success message after 3 seconds
    if (paymentSuccessful) {
      const timer = setTimeout(() => {
        setPaymentSuccessful(false);
      }, 3000);

      // Clean up the timer on component unmount to avoid memory leaks
      return () => clearTimeout(timer);
    }
  }, [paymentSuccessful]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: '0px',
        position: 'relative',
        background: '#ffe6cc', // Light orange background for customer user dashboard
        minHeight: '110vh',
        color: 'black', // Set text color to black for better visibility
      }}
    >
      <IconButton
        edge="start"
        color="inherit"
        onClick={handleLogout}
        style={{ position: 'absolute', top: 0, right: 0 }}
      >
        <Icon path={mdiLogout} size={1} color="black" /> {/* Set logout icon color to black */}
      </IconButton>
      <h2>Customer User Dashboard</h2>
      <p>
        Welcome, {user.name} <span role="img" aria-label="Waving Hand">👋</span>
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginTop: '20px' }}>
        <p>This is the dashboard for customer users.</p>
        <Button variant="contained" size="large" color="primary" onClick={handlePayUsingEth}>
          Pay using ETH
        </Button>
        {qrCodeData && <QRCodeGenerator data={generatedQRCodeData || qrCodeData} size={200} />}
        {paymentSuccessful && <p>Payment successful!</p>}
      </div>
    </div>
  );
};



const UserDashboard = ({ user }) => {
  const [qrCodeData, setQrCodeData] = useState('');

  const onUpdateQRCode = (data) => {
    setQrCodeData(data);
  };

  return (
    <div>
      {user.userType === 'business' ? (
        <BusinessUserDashboard user={user} qrCodeData={qrCodeData} onUpdateQRCode={onUpdateQRCode} />
      ) : (
        <CustomerUserDashboard user={user} qrCodeData={qrCodeData} onUpdateQRCode={onUpdateQRCode} />
      )}
    </div>
  );
};

export default UserDashboard;
export { BusinessUserDashboard, CustomerUserDashboard };