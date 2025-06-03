import { useState, useEffect } from 'react';

const DEFAULT_TURN_DURATION = 12;

export const useTurnTimer = (turnEndsAt, gameStarted, gameEnded) => {
  const [turnTimeLeft, setTurnTimeLeft] = useState(DEFAULT_TURN_DURATION);

  useEffect(() => {
    let intervalId = null; 

    if (gameStarted && !gameEnded && turnEndsAt) {
      const updateTimer = () => {
        const now = Date.now();
        const endTime = turnEndsAt;
        const timeLeftSeconds = Math.max(0, Math.ceil((endTime - now) / 1000));
        setTurnTimeLeft(timeLeftSeconds);

        if (timeLeftSeconds <= 0) {
          if (intervalId) { 
            clearInterval(intervalId);
            intervalId = null; 
          }
        }
      };

      updateTimer(); 
      intervalId = setInterval(updateTimer, 1000);

      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    } else {
      setTurnTimeLeft(DEFAULT_TURN_DURATION);
    }
  }, [turnEndsAt, gameStarted, gameEnded]);

  return turnTimeLeft;
};