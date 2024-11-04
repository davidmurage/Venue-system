import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout/Layout';
import toast from 'react-hot-toast';
import AdminMenu from '../../components/Layout/AdminMenu';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/v1/auth/get-users', {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data.users);
      } catch (error) {
        toast.error('Failed to load users');
      }
    };
    fetchUsers();
  }, []);

  const handleApprove = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/v1/auth/approve-user/${userId}`, {}, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      toast.success('User approved successfully');
      setUsers(users.map(user => user._id === userId ? { ...user, isApproved: true } : user));
    } catch (error) {
      toast.error('Failed to approve user');
    }
  };

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/v1/auth/delete-user/${userId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      toast.success('User deleted successfully');
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleRestrict = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/v1/auth/restrict-user/${userId}`, {}, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      toast.success('User restricted successfully');
      setUsers(users.map(user => user._id === userId ? { ...user, isRestricted: true } : user));
    } catch (error) {
      toast.error('Failed to restrict user');
    }
  };

  return (
    <Layout title="Admin User Management">
      <div className="container mt-3">
        <AdminMenu/>
        <h1>Manage Users</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Approved</th>
              <th>Restricted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role === 1 ? 'Admin' : 'User'}</td>
                <td>{user.isApproved ? 'Yes' : 'No'}</td>
                <td>{user.isRestricted ? 'Yes' : 'No'}</td>
                <td>
                  {!user.isApproved && (
                    <button className="btn btn-success" onClick={() => handleApprove(user._id)}>
                      Approve
                    </button>
                  )}
                  <button className="btn btn-danger ms-2" onClick={() => handleDelete(user._id)}>
                    Delete
                  </button>
                  {!user.isRestricted && (
                    <button className="btn btn-warning ms-2" onClick={() => handleRestrict(user._id)}>
                      Restrict
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default AdminUsers;
