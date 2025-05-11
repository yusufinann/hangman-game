import React from 'react';
import { Button } from '@mui/material';

const GameControls = ({ isHost, gamePhase, onOpenHostSetup, onEndGameByHost }) => {
  return (
    <>
      {isHost && (gamePhase === 'waiting' || gamePhase === 'ended') && (
        <Button variant="contained" color="primary" onClick={onOpenHostSetup} fullWidth sx={{ my: 1, py: 1.5, fontSize: '1rem' }}>Yeni Oyun Ayarla</Button>
      )}
      {isHost && gamePhase === 'playing' && (
        <Button variant="contained" color="error" onClick={onEndGameByHost} sx={{py: 1 }} fullWidth>Oyunu Sonlandır (Host)</Button>
      )}
    </>
  );
};

export default GameControls;