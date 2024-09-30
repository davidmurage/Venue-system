import React from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'

const MyBookings = () => {
  return (
    <Layout title={'Your-Bookings'}>
        <div className='container-fluid p-2 m-3 dashboard'>
            <div className='row'>
                <div className='col-md-3'>
                <UserMenu />
                </div>
                <div className='col-md-9'>
                <h1 className='text-center'>My Bookings</h1>
               
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default MyBookings
