import React, { useState, useEffect } from 'react';
import '../styles/Profile.css';

function Profile({ onClose }) {
  const [userData, setUserData] = useState({
    username: localStorage.getItem('userName') || 'User',
    points: parseInt(localStorage.getItem('userPoints') || '0'),
    donationHistory: JSON.parse(localStorage.getItem('donationHistory') || '[]')
  });

  useEffect(() => {
    // Update user data when component mounts
    setUserData({
      username: localStorage.getItem('userName') || 'User',
      points: parseInt(localStorage.getItem('userPoints') || '0'),
      donationHistory: JSON.parse(localStorage.getItem('donationHistory') || '[]')
    });
  }, []);

  const getRewardLevel = (points) => {
    if (points >= 100) return 'Gold';
    if (points >= 50) return 'Silver';
    if (points >= 20) return 'Bronze';
    return 'Beginner';
  };

  const rewardLevel = getRewardLevel(userData.points);

  return (
    <div className="profile-overlay">
      <div className="profile-container">
        <div className="profile-header">
          <h2>My Profile</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="profile-content">
          <div className="profile-section user-info">
            <div className="avatar">
              {userData.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <h3>{userData.username}</h3>
              <div className="reward-info">
                <div className={`reward-badge ${rewardLevel.toLowerCase()}`}>
                  {rewardLevel}
                </div>
                <div className="points-display">
                  <span className="points-value">{userData.points}</span>
                  <span className="points-label">points</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="profile-section donation-history">
            <h3>Donation History</h3>
            {userData.donationHistory.length === 0 ? (
              <p className="no-donations">You haven't made any donations yet.</p>
            ) : (
              <ul className="donation-list">
                {userData.donationHistory.map((donation, index) => (
                  <li key={index} className="donation-item">
                    <div className="donation-content">
                      <div className="donation-title">{donation.foodItem}</div>
                      <div className="donation-detail">{donation.date}</div>
                    </div>
                    <div className="donation-points">+{donation.points} pts</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="profile-section rewards-info">
            <h3>Rewards Program</h3>
            <div className="rewards-levels">
              <div className="reward-level">
                <div className="level-name">Beginner</div>
                <div className="level-requirement">0-19 points</div>
              </div>
              <div className="reward-level">
                <div className="level-name">Bronze</div>
                <div className="level-requirement">20-49 points</div>
              </div>
              <div className="reward-level">
                <div className="level-name">Silver</div>
                <div className="level-requirement">50-99 points</div>
              </div>
              <div className="reward-level">
                <div className="level-name">Gold</div>
                <div className="level-requirement">100+ points</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;