import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    venue: '',
    date: '',
    time: '',
  });
  const navigate = useNavigate();
  const { slug } = useParams(); // Assuming slug identifies the venue

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/v1/booking/create', formData); // Modify API endpoint accordingly
      toast.success('Booking successful');
      navigate('/'); // Redirect to homepage or another page after booking
    } catch (error) {
      toast.error('Booking failed');
    }
  };

  return (
    <Layout title={"Venue Booking"}>
      <div className="container mt-3">
        <h1>Book Venue</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Venue</label>
            <input
              type="text"
              className="form-control"
              name="venue"
              value={slug} // Pre-fill with venue from URL
              onChange={handleChange}
              required
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Time</label>
            <input
              type="time"
              className="form-control"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Submit Booking</button>
        </form>
      </div>
    </Layout>
  );
};

export default BookingForm;
