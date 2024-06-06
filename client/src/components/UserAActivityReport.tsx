import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserActivityReport = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get('/api/user-activity')
      .then(response => {
        setActivities(response.data);
      })
      .catch(error => {
        console.error('Error fetching user activity:', error);
      });
  }, []);

  return (
    <div>
      <h3>User Activity Report</h3>
      <ul className="list-group">
        {activities.map(activity => (
          <li key={activity.id} className="list-group-item">
            {activity.description} - {new Date(activity.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserActivityReport;
