import { useState, useEffect } from 'react';

const DEFAULT_TURN_DURATION = 12;

export const useTurnTimer = (turnEndsAt, gameStarted, gameEnded) => {
  const [turnTimeLeft, setTurnTimeLeft] = useState(DEFAULT_TURN_DURATION); 
  const [turnTimerIntervalId, setTurnTimerIntervalId] = useState(null);

  useEffect(() => {
    if (turnTimerIntervalId) {
      clearInterval(turnTimerIntervalId);
      setTurnTimerIntervalId(null);
    }

    if (gameStarted && !gameEnded && turnEndsAt) {
      let newIntervalId;
      const updateTimer = () => {
        const now = Date.now();
        const endTime = turnEndsAt; 
        const timeLeftSeconds = Math.max(0, Math.ceil((endTime - now) / 1000));
        setTurnTimeLeft(timeLeftSeconds);

        if (timeLeftSeconds <= 0) {
          clearInterval(newIntervalId);
          setTurnTimerIntervalId(null);
        }
      };
      updateTimer();
      newIntervalId = setInterval(updateTimer, 1000);
      setTurnTimerIntervalId(newIntervalId);

      return () => {
        clearInterval(newIntervalId);
        setTurnTimerIntervalId(null);
      };
    } else {
      setTurnTimeLeft(DEFAULT_TURN_DURATION); 
    }
  }, [turnEndsAt, gameStarted, gameEnded,turnTimerIntervalId]);

  return turnTimeLeft;
};