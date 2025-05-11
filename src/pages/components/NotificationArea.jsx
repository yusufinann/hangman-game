import React from 'react';
import { Box, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const NotificationArea = ({ notifications, onCloseNotification }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 10, sm: 20 },
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: theme.zIndex.snackbar,
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: 1,
        width: { xs: '90%', sm: 'auto' },
        minWidth: { sm: 320, md: 400 },
        maxWidth: { sm: '80%', md: 500 }
      }}
    >
      {notifications.map(n => (
        <Alert
          key={n.id}
          severity={n.severity}
          variant="filled"
          sx={{ width: '100%', boxShadow: theme.shadows[6], alignItems: 'center' }}
          onClose={() => onCloseNotification(n.id)}
        >
          {n.text}
        </Alert>
      ))}
    </Box>
  );
};

export default NotificationArea;