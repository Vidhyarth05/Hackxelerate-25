import React from 'react';
import '../styles/Footer.css';

function Footer() {
  // EDIT THESE VALUES TO CUSTOMIZE YOUR FOOTER
  const websiteName = "UyirUnavu";
  const currentYear = "2025";
  const tagline = "Sustainability in Every Recipe ❤️"; // Added tagline
  
  // EDIT THESE VALUES FOR TEAM LINKEDIN PROFILES
  const teamMembers = [
    {
      name: "Vidhyarth S E",
      linkedinUrl: "https://www.linkedin.com/in/vidhyarth/"
    },
    {
      name: "Syed Faazil S",
      linkedinUrl: "https://www.linkedin.com/in/syedfaazil/"
    },
    {
      name: "Kavin Siddharth A",
      linkedinUrl: "https://www.linkedin.com/in/kavin-siddharth-b643a7282/"
    },
    {
      name: "Kiruthik Pranav T A",
      linkedinUrl: "https://www.linkedin.com/in/kiruthik-pranav-t-a-77a7042a0/"
    }
  ];

  return (
    <footer className="site-footer">
      <div className="footer-divider"></div>
      
      <div className="footer-content">
        <div className="footer-team">
          <h4>Our Team</h4>
          <div className="team-links">
            {teamMembers.map((member, index) => (
              <a 
                key={index} 
                href={member.linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="linkedin-link"
              >
                <div className="linkedin-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" fill="currentColor"/>
                  </svg>
                </div>
                <span>{member.name}</span>
              </a>
            ))}
          </div>
        </div>
        
        <div className="footer-copyright">
          <p className="tagline">{tagline}</p>
          <p>{websiteName} &copy; {currentYear} All Rights Reserved</p>
        </div>
        
        
      </div>
    </footer>
  );
}

export default Footer;