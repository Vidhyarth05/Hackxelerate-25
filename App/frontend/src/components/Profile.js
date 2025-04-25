import React, { useState, useEffect } from 'react';
import '../styles/Profile.css';
import NGORegistration from './NGORegistration';

function Profile({ onClose }) {
  const [userData, setUserData] = useState({
    id: localStorage.getItem('userId') || '',
    username: localStorage.getItem('userName') || 'User',
    userType: localStorage.getItem('userType') || 'normal',
    points: parseInt(localStorage.getItem('userPoints') || '0'),
    donationHistory: JSON.parse(localStorage.getItem('donationHistory') || '[]')
  });
  const [showNGOForm, setShowNGOForm] = useState(false);
  const [ngoRequestStatus, setNgoRequestStatus] = useState(null);

  useEffect(() => {
    // Add class to body to prevent scrolling
    document.body.classList.add('modal-open');
    
    // Fetch user data from backend
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const response = await fetch(`http://localhost:3000/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUserData({
            id: data.id,
            username: data.username,
            userType: data.userType,
            points: data.points || 0,
            donationHistory: data.donationHistory || []
          });
          localStorage.setItem('userName', data.username);
          localStorage.setItem('userType', data.userType);
          localStorage.setItem('userPoints', data.points || 0);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Check NGO request status
    const checkNgoRequestStatus = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const response = await fetch(`http://localhost:3000/ngo-request/status/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setNgoRequestStatus(data.status);
        }
      } catch (error) {
        console.error('Error checking NGO request status:', error);
      }
    };

    fetchUserData();
    checkNgoRequestStatus();
    
    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  const getRewardLevel = (points) => {
    if (points >= 100) return 'Gold';
    if (points >= 50) return 'Silver';
    if (points >= 20) return 'Bronze';
    return 'Beginner';
  };

  const rewardLevel = getRewardLevel(userData.points);
  
  const handleClose = () => {
    document.body.classList.remove('modal-open');
    onClose();
  };

  return (
    <div className="profile-overlay" onClick={handleClose}>
      <div className="profile-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>×</button>
        
        <div className="profile-content">
          <div className="profile-header">
            <h2>User Profile</h2>
            <p>Welcome, {userData.username}!</p>
            <p>Account Type: {userData.userType.charAt(0).toUpperCase() + userData.userType.slice(1)}</p>
          </div>
          
          <div className="profile-section">
            <h3>Reward Status</h3>
            <div className="reward-info">
              <div className={`reward-badge ${rewardLevel.toLowerCase()}`}>
                {rewardLevel} Level
              </div>
              <div className="points-display">
                <span className="points-value">{userData.points}</span>
                <span className="points-label">Points</span>
              </div>
            </div>
          </div>
          
          <div className="profile-section">
            <h3>Donation History</h3>
            {userData.donationHistory && userData.donationHistory.length > 0 ? (
              <ul className="donation-list">
                {userData.donationHistory.map((donation, index) => (
                  <li key={index} className="donation-item">
                    <div>
                      <div className="donation-title">{donation.foodItem}</div>
                      <div className="donation-detail">{new Date(donation.date).toLocaleDateString()}</div>
                    </div>
                    <div className="donation-points">+{donation.points} pts</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-donations">You haven't made any donations yet.</p>
            )}
          </div>
          
          {userData.userType === 'normal' && (
            <div className="profile-section">
              <h3>NGO Registration</h3>
              {ngoRequestStatus === 'pending' ? (
                <p className="no-donations">Your NGO registration request is pending approval.</p>
              ) : ngoRequestStatus === 'rejected' ? (
                <div>
                  <p className="no-donations">Your previous NGO request was rejected.</p>
                  <button 
                    className="ngo-button" 
                    onClick={() => setShowNGOForm(true)}
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div>
                  <p className="no-donations">Register as an NGO to accept food donations.</p>
                  <button 
                    className="ngo-button" 
                    onClick={() => setShowNGOForm(true)}
                  >
                    Register as NGO
                  </button>
                </div>
              )}
              
              {showNGOForm && (
                <NGORegistration 
                  userId={userData.id} 
                  onClose={() => setShowNGOForm(false)}
                  onSubmitSuccess={() => {
                    setShowNGOForm(false);
                    setNgoRequestStatus('pending');
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
