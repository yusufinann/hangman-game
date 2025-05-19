import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const CountdownScreen = ({ countdown,t }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: theme.zIndex.modal + 1,
        color: 'white',
        textAlign: 'center'
      }}
    >
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 300 }}>{t("Game on")}!</Typography>
      <Typography variant="h1" component="div" sx={{ fontWeight: 'bold', fontSize: { xs: '8rem', sm: '12rem', md: '15rem' }, lineHeight: 1 }}>
        {countdown}
      </Typography>
    </Box>
  );
};

export default CountdownScreen;