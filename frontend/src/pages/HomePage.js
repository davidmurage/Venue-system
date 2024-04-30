import React from 'react'
import Layout from '../components/Layout/Layout'
import { useAuth } from '../context/auth';

const HomePage = () => {
  const [auth,setAuth] = useAuth();
  return (
    <Layout title={'Essex-Group'}>
        <h1>Home Page</h1>
        <prev>{JSON.stringify(auth, null, 4)}</prev>
    </Layout>
  )
}

export default HomePage
