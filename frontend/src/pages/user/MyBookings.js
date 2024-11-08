import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import UserMenu from '../../components/Layout/UserMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_URL } from '../../utils/config';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BASE_URL}/api/v1/booking/get-myBookings`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setBookings(res.data.bookings);
      } catch (error) {
        toast.error('Failed to load Bookings');
      }
    };
    fetchBookings();
  }, []);

  const handleCancelRequest = async (bookingId, email) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${BASE_URL}/api/v1/booking/request-cancel`,
        { bookingId, email },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Cancellation request sent successfully');
    } catch (error) {
      toast.error('Failed to send cancellation request');
    }
  };

  return (
    <Layout title={'Your-Bookings'}>
      <div className="container-fluid p-2 m-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">My Bookings</h1>
            {bookings.length === 0 ? (
              <p>No bookings found</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Venue</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Photo</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.venue?.name}</td>
                      <td>{new Date(booking.date).toLocaleDateString()}</td>
                      <td>{booking.time}</td>
                      <td>
  {booking.venue?.photo ? (
    <img
      src={`data:${booking.venue?.photo.contentType};base64,${booking.venue?.photo.base64Photo}`}
      alt="venue"
      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
    />
  ) : (
    <img
      src="defaultImage.jpg"
      alt="default venue"
      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
    />
  )}
</td>
                      <td>
                        <button
                          className="btn btn-warning"
                          onClick={() => handleCancelRequest(booking._id, booking.email)}
                        >
                          Request Cancellation
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyBookings;
