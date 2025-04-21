import React, { useState } from 'react';

function DonationForm() {
  const [formData, setFormData] = useState({
    foodItem: '',
    contactInfo: '',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

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
      setError('Network error, please try again');
      console.error('Donation submission error:', err);
    }
  };

  if (submitted) {
    return (
      <div className="donation-success">
        <h3>Thank you for your contribution!</h3>
        <p>Your donation has been registered. Someone from the community will contact you soon.</p>
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