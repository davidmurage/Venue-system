import React, {useState, useEffect} from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import axios from 'axios'
import toast  from 'react-hot-toast'

const MyBookings = () => {
    const[bookings, setBookings] = useState([]);

    useEffect(()=>{
        const fetchBookings = async()=>{
            try{
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/v1/booking/get-myBookings', {
                    headers:{
                        authorization: `Bearer ${token}`
                    }
                })
                setBookings(res.data.bookings);
            }catch(error){
                toast.error('Failed to load Bookings')

            }
        }
        fetchBookings();
            
    }, []);

    const handleCancel = async(bookingId) =>{
        try{
            const token = localStorage.getItem('token');
            await axios.delete(`/api/v1/booking/delete-booking/${bookingId}`, {
                headers:{
                    authorization: `Bearer ${token}`
                }
            })
            toast.success('Booking deleted successfully');
            setBookings(bookings.filter((booking)=>booking._id !== bookingId))
        }catch(error){
            toast.error('Failed to delete booking');
        }
    }


  return (
    <Layout title={'Your-Bookings'}>
        <div className='container-fluid p-2 m-3 dashboard'>
            <div className='row'>
                <div className='col-md-3'>
                <UserMenu />
                </div>
                <div className='col-md-9'>
                <h1 className='text-center'>My Bookings</h1>
        {bookings.length === 0 ? (
          <p>No bookings found</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Venue</th>
                <th>Date</th>
                <th>Time</th>
                <th>photo</th>
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
                        <img
                        src={booking.venue?.photo?.data || 'defaultImage.jpg'}
                        alt='venue'
                        style={{ width: '50px', height: '50px', objectFit:'cover' }}
                        />
                    </td>
                    <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleCancel(booking._id)} // Call the handleCancel function with booking ID
                        >
                          Cancel
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
  )
}

export default MyBookings
