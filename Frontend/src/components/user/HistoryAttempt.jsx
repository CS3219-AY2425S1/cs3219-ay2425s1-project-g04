// HistoryAttempt.js
import React from 'react';

const HistoryAttempt = ({ attempt }) => {
  const { matchedUsername, questionTitle, startTime, duration, code } = attempt;

  // Function to format duration based on requirements
  const formatDuration = (seconds) => {
    if (seconds < 0) {
      throw new Error('Negative duration is not supported');
    }
  
    if (seconds >= 3600) {
      // Format as HH:MM:SS
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    } else if (seconds >= 60) {
      // Format as MM:SS
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    } else {
      // Format as 00:SS
      return `00:${String(seconds).padStart(2, '0')}`;
    }
  };
  

  return (
    <tr>
      <td>{matchedUsername}</td>
      <td>{questionTitle}</td>
      <td>{new Date(startTime).toLocaleString()}</td>
      <td>{formatDuration(duration)}</td>
    </tr>
  );
};


export default HistoryAttempt;
