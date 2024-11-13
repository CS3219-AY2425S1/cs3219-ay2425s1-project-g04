// ProfileSidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const ProfileSidebar = ({ userID }) => {
  return (
    <div
      className="profile-sidebar"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        top: '30%', // Start 30% down from the top
      }}
    >
      <Link to={`/profile/${userID}`}>
        <button className="btn btn-primary mb-3">Edit Profile</button>
      </Link>
      <Link to={`/history/${userID}`}>
        <button className="btn btn-secondary">Attempt History</button>
      </Link>
    </div>
  );
};

export default ProfileSidebar;
