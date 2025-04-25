import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setConnectionStatus } from '../features/cryptoSlice';

const ConnectionSimulator: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
  
    const simulateConnectionChanges = () => {
     
      if (Math.random() < 0.05) {
        const newStatus = Math.random() < 0.7 ? 'connected' : 'disconnected';
        dispatch(setConnectionStatus(newStatus));
        
       
        if (newStatus === 'disconnected') {
          setTimeout(() => {
            dispatch(setConnectionStatus('connected'));
          }, 3000 + Math.random() * 5000); 
        }
      }
    };

   
    const intervalId = setInterval(simulateConnectionChanges, 10000);
    
    return () => clearInterval(intervalId);
  }, [dispatch]);

 
  return null;
};

export default ConnectionSimulator;