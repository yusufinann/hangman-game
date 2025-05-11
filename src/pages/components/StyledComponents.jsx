import { styled } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';

// Existing styled components
export const GameContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  margin: '0 auto',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden', 
}));

export const TimerBar = styled(Box)(({ theme, percentage }) => ({
  width: `${percentage}%`,
  height: '4px',
  backgroundColor: percentage > 60 
    ? theme.palette.success.main 
    : percentage > 30 
      ? theme.palette.warning.main 
      : theme.palette.error.main,
  transition: 'width 1s linear, background-color 0.5s ease',
  borderRadius: '2px',
  marginBottom: theme.spacing(1),
}));

// New styled components for better zoom behavior
export const ResponsiveGameArea = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  gap: theme.spacing(1),
  overflow: 'auto',
  minHeight: '400px',
  [theme.breakpoints.down('sm')]: {
    minHeight: '300px',
  },
}));

export const ResponsiveGamePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '100%',
  height: '100%',
  overflow: 'visible',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

// For the alphabet grid
export const AlphabetContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: theme.spacing(0.5),
  margin: theme.spacing(1, 0),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(0.25),
  },
}));

// For the word display
export const WordDisplay = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  margin: theme.spacing(2, 0),
  overflowWrap: 'break-word',
  wordBreak: 'break-all',
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(1, 0),
  },
}));

// For the player list
export const PlayerListContainer = styled(Paper)(({ theme }) => ({
  height: '100%',
  width:'100%',
  padding: theme.spacing(2),
  overflow: 'auto', // Allow scrolling if many players
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('md')]: {
    maxHeight: '200px',
  },
}));