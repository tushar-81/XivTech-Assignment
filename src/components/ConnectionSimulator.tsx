import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setConnectionStatus } from '../features/cryptoSlice';

const ConnectionSimulator: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Simulate occasional connection status changes
    const simulateConnectionChanges = () => {
      // 5% chance of connection status change on each interval
      if (Math.random() < 0.05) {
        const newStatus = Math.random() < 0.7 ? 'connected' : 'disconnected';
        dispatch(setConnectionStatus(newStatus));
        
        // If disconnected, automatically reconnect after a delay
        if (newStatus === 'disconnected') {
          setTimeout(() => {
            dispatch(setConnectionStatus('connected'));
          }, 3000 + Math.random() * 5000); // Reconnect after 3-8 seconds
        }
      }
    };

    // Set up interval to occasionally change connection status
    const intervalId = setInterval(simulateConnectionChanges, 10000);
    
    return () => clearInterval(intervalId);
  }, [dispatch]);

  // This component doesn't render anything visible
  return null;
};

export default ConnectionSimulator;