// NGODashboard.js
import React, { useState, useEffect } from 'react';
import '../styles/NGODashboard.css';

function NGODashboard() {
  const [donations, setDonations] = useState([]);
  const [acceptedDonations, setAcceptedDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    // Check if user is NGO
    const userType = localStorage.getItem('userType');
    if (userType !== 'ngo') {
      window.location.href = '/'; // Redirect non-NGO users
      return;
    }
    
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      // Fetch pending donations
      const pendingResponse = await fetch('http://localhost:3000/donations/pending');
      
      // Fetch accepted donations by this NGO
      const ngoId = localStorage.getItem('userId');
      const acceptedResponse = await fetch(`http://localhost:3000/donations/accepted/${ngoId}`);
      
      if (pendingResponse.ok && acceptedResponse.ok) {
        const pendingData = await pendingResponse.json();
        const acceptedData = await acceptedResponse.json();
        
        setDonations(pendingData);
        setAcceptedDonations(acceptedData);
      } else {
        setError('Failed to fetch donations. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Error fetching donations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptDonation = async (donationId) => {
    try {
      const ngoId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:3000/donations/accept/${donationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ngoId }),
      });
      
      if (response.ok) {
        // Refresh donations list
        fetchDonations();
        alert('Donation accepted successfully!');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to accept donation');
      }
    } catch (err) {
      console.error('Error accepting donation:', err);
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
    return <div className="ngo-loading">Loading donations...</div>;
  }

  return (
    <div className="ngo-dashboard">
      <div className="ngo-header">
        <h1>NGO Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      
      {error && <div className="ngo-error">{error}</div>}
      
      <div className="ngo-tabs">
        <button 
          className={activeTab === 'pending' ? 'active' : ''} 
          onClick={() => setActiveTab('pending')}
        >
          Pending Donations
        </button>
        <button 
          className={activeTab === 'accepted' ? 'active' : ''} 
          onClick={() => setActiveTab('accepted')}
        >
          Accepted Donations
        </button>
      </div>
      
      <div className="ngo-content">
        {activeTab === 'pending' && (
          <div className="pending-donations">
            <h2>Available Donations</h2>
            {donations.length === 0 ? (
              <p>No pending donations available.</p>
            ) : (
              <div className="donations-grid">
                {donations.map(donation => (
                  <div key={donation.id} className="donation-card">
                    <h3>{donation.foodItem}</h3>
                    <p><strong>Contact:</strong> {donation.contactInfo}</p>
                    <p><strong>Notes:</strong> {donation.notes || 'No additional notes'}</p>
                    <p><strong>Date:</strong> {new Date(donation.createdAt).toLocaleDateString()}</p>
                    <button 
                      className="accept-button" 
                      onClick={() => handleAcceptDonation(donation.id)}
                    >
                      Accept Donation
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'accepted' && (
          <div className="accepted-donations">
            <h2>Your Accepted Donations</h2>
            {acceptedDonations.length === 0 ? (
              <p>You haven't accepted any donations yet.</p>
            ) : (
              <div className="donations-grid">
                {acceptedDonations.map(donation => (
                  <div key={donation.id} className="donation-card accepted">
                    <h3>{donation.foodItem}</h3>
                    <p><strong>Contact:</strong> {donation.contactInfo}</p>
                    <p><strong>Notes:</strong> {donation.notes || 'No additional notes'}</p>
                    <p><strong>Accepted on:</strong> {new Date(donation.acceptedAt).toLocaleDateString()}</p>
                    <div className="status-badge">Accepted</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default NGODashboard;
