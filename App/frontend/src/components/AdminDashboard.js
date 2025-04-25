// AdminDashboard.js
import React, { useState, useEffect } from 'react';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const [ngoRequests, setNgoRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ngoRequests');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is admin
    const userType = localStorage.getItem('userType');
    if (userType !== 'admin') {
      window.location.href = '/'; // Redirect non-admin users
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch NGO requests
      const requestsResponse = await fetch('http://localhost:3000/ngo-requests');
      
      // Fetch users
      const usersResponse = await fetch('http://localhost:3000/users');
      
      if (requestsResponse.ok && usersResponse.ok) {
        const requestsData = await requestsResponse.json();
        const usersData = await usersResponse.json();
        
        setNgoRequests(requestsData);
        setUsers(usersData);
      } else {
        setError('Failed to fetch data. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveNGO = async (requestId) => {
    try {
      const adminId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:3000/ngo-request/approve/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adminId })
      });
      
      if (response.ok) {
        // Update the local state to reflect the change
        setNgoRequests(prevRequests => 
          prevRequests.filter(request => request.id !== requestId)
        );
        
        // Refresh user list to show updated user types
        fetchData();
        
        alert('NGO request approved successfully!');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to approve NGO request');
      }
    } catch (err) {
      console.error('Error approving NGO request:', err);
      alert('Network error. Please try again later.');
    }
  };

  const handleRejectNGO = async (requestId) => {
    try {
      const adminId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:3000/ngo-request/reject/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adminId })
      });
      
      if (response.ok) {
        // Update the local state to reflect the change
        setNgoRequests(prevRequests => 
          prevRequests.filter(request => request.id !== requestId)
        );
        
        alert('NGO request rejected.');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to reject NGO request');
      }
    } catch (err) {
      console.error('Error rejecting NGO request:', err);
      alert('Network error. Please try again later.');
    }
  };

  const handleChangeUserType = async (userId, newType) => {
    try {
      const adminId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:3000/users/${userId}/type`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          userType: newType,
          adminId 
        })
      });
      
      if (response.ok) {
        // Update the local state to reflect the change
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId ? { ...user, userType: newType } : user
          )
        );
        
        alert(`User type changed to ${newType} successfully!`);
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to change user type');
      }
    } catch (err) {
      console.error('Error changing user type:', err);
      alert('Network error. Please try again later.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    
    // Redirect to home page
    window.location.href = '/';
  };

  if (loading) {
    return <div className="admin-loading">Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      
      {error && <div className="admin-error">{error}</div>}
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'ngoRequests' ? 'active' : ''} 
          onClick={() => setActiveTab('ngoRequests')}
        >
          NGO Requests
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          Manage Users
        </button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'ngoRequests' && (
          <div className="ngo-requests-section">
            <h2>NGO Registration Requests</h2>
            {ngoRequests.length === 0 ? (
              <p>No pending NGO requests.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Organization</th>
                    <th>Manager</th>
                    <th>Area</th>
                    <th>Contact</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ngoRequests.map(request => (
                    <tr key={request.id}>
                      <td>{request.ngoDetails.name}</td>
                      <td>{request.ngoDetails.managerName}</td>
                      <td>{request.ngoDetails.area}</td>
                      <td>{request.ngoDetails.contactEmail}</td>
                      <td>{new Date(request.ngoDetails.requestDate).toLocaleDateString()}</td>
                      <td className="action-buttons">
                        <button 
                          className="approve-button" 
                          onClick={() => handleApproveNGO(request.id)}
                        >
                          Approve
                        </button>
                        <button 
                          className="reject-button" 
                          onClick={() => handleRejectNGO(request.id)}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        
        {activeTab === 'users' && (
          <div className="users-section">
            <h2>Manage Users</h2>
            {users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>User Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.username}</td>
                      <td>{user.name || '-'}</td>
                      <td>{user.email || '-'}</td>
                      <td>{user.userType}</td>
                      <td className="action-buttons">
                        <select 
                          value={user.userType}
                          onChange={(e) => handleChangeUserType(user.id, e.target.value)}
                          disabled={user.userType === 'admin'}
                        >
                          <option value="normal">Normal</option>
                          <option value="ngo">NGO</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
