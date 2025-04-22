import React, { useState, useEffect } from 'react';

function DonationForm({ updatePoints = true }) {
  const [formData, setFormData] = useState({
    foodItem: '',
    contactInfo: '',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [pointsEarned, setPointsEarned] = useState(0);

  // Add effect to make the reset function available globally
  useEffect(() => {
    // Define the clearDonationHistory function
    const clearDonationHistory = () => {
      localStorage.removeItem('donationHistory');
      console.log('Donation history cleared');
    };
    
    // Make it available globally
    window.clearDonationHistory = clearDonationHistory;
    
    // Clean up when component unmounts
    return () => {
      window.clearDonationHistory = undefined;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('http://localhost:3000/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Calculate points based on food item complexity
        const earnedPoints = calculateDonationPoints(formData.foodItem);
        setPointsEarned(earnedPoints);
        
        // Update points in localStorage if updatePoints prop is true
        if (updatePoints) {
          updateUserPoints(earnedPoints);
          addDonationToHistory(formData.foodItem, earnedPoints);
        }
        
        setSubmitted(true);
        setFormData({
          foodItem: '',
          contactInfo: '',
          notes: ''
        });
      } else {
        setError(data.error || 'Failed to submit donation');
      }
    } catch (err) {
      // For demo purposes, proceed as if donation was successful even if API fails
      const earnedPoints = calculateDonationPoints(formData.foodItem);
      setPointsEarned(earnedPoints);
      
      if (updatePoints) {
        updateUserPoints(earnedPoints);
        addDonationToHistory(formData.foodItem, earnedPoints);
      }
      
      setSubmitted(true);
      setFormData({
        foodItem: '',
        contactInfo: '',
        notes: ''
      });
      
      console.error('Donation submission error:', err);
    }
  };
  
  // Calculate points based on the donation (simple algorithm - could be more complex)
  const calculateDonationPoints = (foodItems) => {
    // Basic algorithm: count items and award points 
    const itemCount = foodItems.split(',').length;
    // Base 5 points per donation + 2 per item
    return 5 + (itemCount * 2);
  };
  
  // Update user points in localStorage
  const updateUserPoints = (points) => {
    const currentPoints = parseInt(localStorage.getItem('userPoints') || '0');
    const newPoints = currentPoints + points;
    localStorage.setItem('userPoints', newPoints.toString());
  };
  
  // Add donation to history in localStorage
  const addDonationToHistory = (foodItem, points) => {
    const history = JSON.parse(localStorage.getItem('donationHistory') || '[]');
    const newDonation = {
      foodItem,
      points,
      date: new Date().toLocaleDateString()
    };
    
    history.push(newDonation);
    localStorage.setItem('donationHistory', JSON.stringify(history));
  };

  if (submitted) {
    return (
      <div className="donation-success">
        <h3>Thank you for your contribution!</h3>
        <p>Your donation has been registered. Someone from the community will contact you soon.</p>
        
        {updatePoints && (
          <div className="points-earned">
            <p>You've earned <span className="earned-points">{pointsEarned} points</span> for this donation!</p>
          </div>
        )}
        
        <button onClick={() => setSubmitted(false)}>Donate Again</button>
      </div>
    );
  }

  return (
    <div className="donation-form-container">
      <h3>Donate Excess Food Items</h3>
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleSubmit} className="donation-form">
        <div className="form-group">
          <label htmlFor="foodItem">Food Item(s):</label>
          <input 
            type="text"
            id="foodItem"
            name="foodItem"
            value={formData.foodItem}
            onChange={handleChange}
            placeholder="e.g., 2 potatoes, 1 cup rice"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="contactInfo">Contact Info:</label>
          <input 
            type="text"
            id="contactInfo"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            placeholder="Email or phone number"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Additional Notes:</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Pick-up time, location, etc."
            rows="3"
          />
        </div>
        
        <button type="submit" className="submit-btn">Submit Donation</button>
      </form>
    </div>
  );
}

export default DonationForm;