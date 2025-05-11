import React from 'react';
import { Typography, Chip } from '@mui/material';

const LobbyInfoBar = ({ lobbyInfo, lobbyCode, lobbyCreatorName }) => {
  return (
    <Typography variant="h6" align="center" gutterBottom>
      Lobi: <Chip label={lobbyInfo?.name || lobbyCode} size="medium" color="secondary" variant="filled" />
      <Typography variant="caption" sx={{ ml: 1 }}>(Lobi Sahibi: {lobbyCreatorName})</Typography>
    </Typography>
  );
};

export default LobbyInfoBar;