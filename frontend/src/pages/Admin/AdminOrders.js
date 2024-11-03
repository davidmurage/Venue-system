import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout/Layout';
import toast from 'react-hot-toast';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get('/api/v1/booking/get-bookings');
        setBookings(data.bookings);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load bookings');
      }
    };
    fetchBookings();
  }, []);

  const handleSendEmail = async (bookingId, email) => {
    try {
      await axios.post(`/api/v1/booking/sendEmail`, { bookingId, email });
      toast.success('Email sent successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to send email');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.delete(`/api/v1/booking/delete-booking/${bookingId}`);
      toast.success('Booking cancelled successfully');
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
    } catch (error) {
      console.error(error);
      toast.error('Failed to cancel booking');
    }
  };

  return (
    <Layout title="Admin Bookings">
      <div className="container mt-3">
        <h1>All Bookings</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Venue</th>
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.name}</td>
                <td>{booking.email}</td>
                <td>{booking.venue ? booking.venue.name : 'N/A'}</td>
                <td>{booking.date}</td>
                <td>{booking.time}</td>
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => handleSendEmail(booking._id, booking.email)}
                  >
                    Send Email
                  </button>
                  <button
                    className="btn btn-danger ms-2"
                    onClick={() => handleCancelBooking(booking._id)}
                  >
                    Cancel Booking
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default AdminBookings;
