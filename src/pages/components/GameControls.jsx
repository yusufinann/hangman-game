import React from 'react';
import { Button } from '@mui/material';

const GameControls = ({ isHost, gamePhase, onOpenHostSetup, onEndGameByHost ,t}) => {
  return (
    <>
      {isHost && (gamePhase === 'waiting' || gamePhase === 'ended') && (
        <Button variant="contained" color="primary" onClick={onOpenHostSetup} fullWidth sx={{ my: 1, py: 1.5, fontSize: '1rem' }}>{t("Set New Game")}</Button>
      )}
      {isHost && gamePhase === 'playing' && (
        <Button variant="contained" color="error" onClick={onEndGameByHost} sx={{py: 1 }} fullWidth>{t("End Game (Host)")}</Button>
      )}
    </>
  );
};

export default GameControls;