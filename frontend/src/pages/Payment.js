// src/components/PaymentForm.js

import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Call the backend to initiate the MPesa payment
      const response = await axios.post('http://localhost:5000/mpesa/stkpush', {
        phoneNumber,
        amount,
      });

      setMessage('Payment request sent! Check your phone to enter your MPesa PIN.');
    } catch (error) {
      setMessage('Error initiating payment. Please try again.');
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', backgroundColor: '#e0f7da' }}>
      <h2>Pay with MPesa</h2>
      <form onSubmit={handlePayment}>
        <div style={{ marginBottom: '10px' }}>
          <label>Phone Number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number (2547XXXXXXXX)"
            required
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #2e7d32' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Amount (KES):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
            style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #2e7d32' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#2e7d32',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Processing...' : 'Pay with MPesa'}
        </button>
      </form>
      {message && <p style={{ marginTop: '10px', color: '#2e7d32' }}>{message}</p>}
    </div>
  );
};

export default PaymentForm;
