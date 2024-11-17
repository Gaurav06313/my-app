import React from 'react';

function Profile() {
  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img 
            src="https://via.placeholder.com/150" 
            alt="Profile avatar" 
            className="avatar-image"
          />
        </div>
        <h1 className="profile-name">John Doe</h1>
      </div>

      <div className="profile-info">
        <div className="info-section">
          <h2>About Me</h2>
          <p>Hello! I'm a software developer passionate about creating amazing web applications.</p>
        </div>

        <div className="info-section">
          <h2>Contact Information</h2>
          <ul>
            <li>Email: john.doe@example.com</li>
            <li>Location: New York, NY</li>
            <li>Website: www.johndoe.com</li>
          </ul>
        </div>

        <div className="info-section">
          <h2>Skills</h2>
          <div className="skills-list">
            <span className="skill-tag">React</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
