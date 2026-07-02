import React, { useState } from 'react';
import QRCodeGenerator from './QRCodeGenerator';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@material-ui/core';

const PaymentForm = ({ open, onClose, onConfirm}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);

  const handleConfirm = () => {
    if (validateForm()) {
      const paymentData = {
        customerName,
        customerEmail,
        paymentAmount: parseFloat(paymentAmount),
      };
      onConfirm(paymentData); // Pass the payment data back to the parent component
      setCustomerName('');
      setCustomerEmail('');
      setPaymentAmount(0);
    } else {
      alert('Please enter valid information!');
    }
  };

  const validateForm = () => {
    return (
      customerName.trim() !== '' &&
      customerEmail.trim() !== '' &&
      parseFloat(paymentAmount) > 0
    );
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Payment Options</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* The "Pay using ETH" button is removed */}
          <QRCodeGenerator data={`QR code data for business - Amount: ${paymentAmount}`} size={200} />
        </div>
        <TextField
          label="Customer Name"
          variant="outlined"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Customer Email"
          variant="outlined"
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Payment Amount ($)"
          variant="outlined"
          type="number"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentForm;







