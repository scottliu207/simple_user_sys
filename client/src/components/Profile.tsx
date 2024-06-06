import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios.get('/api/profile')
      .then(response => {
        setProfile(response.data);
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
      });
  }, []);

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <h3>Profile</h3>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      {/* Add more profile details as needed */}
    </div>
  );
};

export default Profile;
