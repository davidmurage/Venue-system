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
                const res = await axios.get('/api/v1/booking/get-myBookings',{
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                })
                setBookings(res.data.bookings);
            }catch(error){
                toast.error('Failed to load Bookings')

            }
        }
        fetchBookings();
            
    }, []);


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
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.venue}</td>
                  <td>{new Date(booking.date).toLocaleDateString()}</td>
                  <td>{booking.time}</td>
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
