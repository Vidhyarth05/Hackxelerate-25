import React, { useState } from 'react';
import '../styles/NGORegistration.css';

function NGORegistration({ onClose, userId }) {
  const [ngoForm, setNgoForm] = useState({
    name: '',
    area: '',
    managerName: '',
    contactEmail: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNgoForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!ngoForm.name || !ngoForm.area || !ngoForm.managerName || !ngoForm.contactEmail) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      // Send NGO registration request to backend
      const response = await fetch('http://localhost:3000/ngo-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          ngoDetails: {
            ...ngoForm,
            requestDate: new Date().toISOString()
          }
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('NGO registration request submitted! An admin will review your request.');
        onClose();
      } else {
        setError(data.message || 'Failed to submit NGO request');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
      console.error('Error submitting NGO request:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ngo-registration-container">
      <div className="ngo-registration-form">
        <h2>Register as NGO</h2>
        <p>Please provide details about your organization</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Organization Name</label>
            <input 
              type="text" 
              name="name" 
              value={ngoForm.name} 
              onChange={handleChange} 
              placeholder="NGO Name"
            />
          </div>
          
          <div className="form-group">
            <label>Service Area</label>
            <input 
              type="text" 
              name="area" 
              value={ngoForm.area} 
              onChange={handleChange} 
              placeholder="City or Region"
            />
          </div>
          
          <div className="form-group">
            <label>Manager Name</label>
            <input 
              type="text" 
              name="managerName" 
              value={ngoForm.managerName} 
              onChange={handleChange} 
              placeholder="Full Name"
            />
          </div>
          
          <div className="form-group">
            <label>Contact Email</label>
            <input 
              type="email" 
              name="contactEmail" 
              value={ngoForm.contactEmail} 
              onChange={handleChange} 
              placeholder="Email Address"
            />
          </div>
          
          <div className="form-buttons">
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NGORegistration;
