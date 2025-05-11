import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Tooltip, 
  Chip, 
  Avatar,
  Badge,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; 
import StarIcon from '@mui/icons-material/Star';
import HangmanDrawing from './HangmanDrawing';

const PlayerList = ({ members, sharedGameState, userId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Sort members: current user first, then host, then current player, then others
  const sortedMembers = [...members].sort((a, b) => {
    const isCurrentUserA = a.id === userId;
    const isCurrentUserB = b.id === userId;
    const isHostA = a.id === sharedGameState.hostId;
    const isHostB = b.id === sharedGameState.hostId;
    const isCurrentPlayerA = a.id === sharedGameState.currentPlayerId;
    const isCurrentPlayerB = b.id === sharedGameState.currentPlayerId;
    
    if (isCurrentUserA !== isCurrentUserB) return isCurrentUserA ? -1 : 1;
    if (isHostA !== isHostB) return isHostA ? -1 : 1;
    if (isCurrentPlayerA !== isCurrentPlayerB) return isCurrentPlayerA ? -1 : 1;
    return 0;
  });

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        height: '100%',
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 2
      }}
    >
      <Box sx={{ 
        p: 1.5, 
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <PersonIcon fontSize="small" color="primary" />
          <Typography variant="subtitle1" fontWeight="medium">
            Players
          </Typography>
        </Box>
        <Chip 
          size="small" 
          label={members.length} 
          color="primary" 
          sx={{
            fontWeight: 'bold',
            minWidth: 28
          }}
        />
      </Box>
      
      <Box sx={{ 
        overflow: 'auto', 
        flexGrow: 1,
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        {sortedMembers.map(member => {
          const playerStatus = sharedGameState.playerStates[member.id] || {
            remainingAttempts: 6, 
            won: false, 
            eliminated: false,
            userName: member.username, 
            name: member.name
          };
          
          const isCurrent = member.id === userId;
          const isGameHost = member.id === sharedGameState.hostId;
          const isCurrentTurnPlayer = member.id === sharedGameState.currentPlayerId && 
                                    sharedGameState.gameStarted && 
                                    !sharedGameState.gameEnded;
          
          let statusChip = null;
          if (playerStatus.won) {
            statusChip = (
              <Chip 
                size="small" 
                icon={<EmojiEventsIcon fontSize="small" />}
                label="Won!" 
                color="success" 
                sx={{ height: 24, fontSize: '0.7rem' }} 
              />
            );
          } else if (playerStatus.eliminated) {
            statusChip = (
              <Chip 
                size="small" 
                label="Eliminated" 
                color="error" 
                sx={{ height: 24, fontSize: '0.7rem' }} 
              />
            );
          }
          
          const displayName = playerStatus.userName || member.username;
          const initial = displayName.charAt(0).toUpperCase();
          
          // Avatar with badge for host
          const avatarElement = isGameHost ? (
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              badgeContent={
                <Tooltip title="Host">
                  <StarIcon 
                    sx={{ 
                      fontSize: 14, 
                      color: theme.palette.warning.main,
                      bgcolor: theme.palette.background.paper,
                      borderRadius: '50%'
                    }} 
                  />
                </Tooltip>
              }
            >
              <Avatar
               src={member.avatar || undefined}
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  border: isCurrent ? `2px solid ${theme.palette.primary.main}` : 'none',
                  bgcolor: getAvatarColor(member.id, theme)
                }}
              >
                {!member.avatar && {initial}}
              </Avatar>
            </Badge>
          ) : (
            <Avatar
            src={member.avatar || undefined}
              sx={{
                width: 32,
                height: 32,
                fontSize: '1rem',
                fontWeight: 'bold',
                border: isCurrent ? `2px solid ${theme.palette.primary.main}` : 'none',
                bgcolor: getAvatarColor(member.id, theme)
              }}
            >
             {!member.avatar && {initial}}
            </Avatar>
          );
          
          return (
            <Box
              key={member.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: isCurrentTurnPlayer ? alpha(theme.palette.info.main, 0.1) : 
                                isCurrent ? alpha(theme.palette.primary.main, 0.05) : 
                                'transparent',
                borderRadius: 2,
                p: 1.5,
                gap: 1.5,
                border: isCurrentTurnPlayer ? `1px solid ${theme.palette.info.main}` : 
                       isCurrent ? `1px solid ${theme.palette.primary.light}` : 
                       `1px solid ${theme.palette.divider}`,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }
              }}
            >
              {/* Left indicator for current turn */}
              {isCurrentTurnPlayer && (
                <Box sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  backgroundColor: theme.palette.info.main,
                  borderTopLeftRadius: 8,
                  borderBottomLeftRadius: 8
                }} />
              )}
              
              {avatarElement}
              
              <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  flexWrap: 'wrap',
                  overflow: 'hidden'
                }}>
                  <Typography
                    variant="body1"
                    fontWeight={isCurrent || isCurrentTurnPlayer ? 'bold' : 'medium'}
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: isCurrent ? theme.palette.primary.main : 
                            isCurrentTurnPlayer ? theme.palette.info.main : 
                            'text.primary',
                      fontSize: '0.9rem',
                    }}
                  >
                    {displayName}
                  </Typography>
                  
                  {isCurrent && (
                    <Chip
                      size="small"
                      label="Siz"
                      color="primary"
                      variant="outlined"
                      sx={{ 
                        height: 22, 
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        px: 0.5,
                        display: { xs: 'none', sm: 'flex' }
                      }}
                    />
                  )}
                  
                  {isCurrent && isMobile && (
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        bgcolor: theme.palette.primary.main,
                        color: '#fff',
                        fontSize: '0.6rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      S
                    </Box>
                  )}
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mt: 0.5,
                  gap: 1,
                  flexWrap: 'wrap'
                }}>
                  {statusChip || (
                    <Box sx={{ 
                      color: theme.palette.text.secondary,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      bgcolor: theme.palette.action.hover,
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                    }}>
                      <Box component="span" sx={{ fontWeight: 'medium' }}>
                        Hak: {playerStatus.remainingAttempts}
                      </Box>
                    </Box>
                  )}
                  
                  {isCurrentTurnPlayer && (
                    <Chip
                      size="small"
                      label="Sıra"
                      color="info"
                      sx={{ 
                        height: 24, 
                        fontSize: '0.7rem',
                        fontWeight: 'bold'
                      }}
                    />
                  )}
                </Box>
              </Box>
              
              <Box sx={{ 
                display: {
                  xs: playerStatus.remainingAttempts < 6 ? 'block' : 'none',
                  sm: 'block'
                }
              }}>
                <HangmanDrawing 
                  incorrectGuesses={6 - playerStatus.remainingAttempts} 
                  size={isMobile ? 0.30 : 0.40} 
                />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

// Helper function for color transparency
function alpha(color, alpha) {
  if (!color) return undefined;
  return color + String(Math.round(alpha * 255)).toString(16).padStart(2, '0');
}

// Generate consistent avatar colors based on user id
function getAvatarColor(userId, theme) {
  // Create a simple hash from the userId string
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // List of MUI colors to use for avatars
  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main,
    theme.palette.grey[700],
    '#9c27b0', // purple
    '#00796b', // teal
    '#e65100', // orange deep
    '#3e2723', // brown
    '#1a237e', // indigo
  ];
  
  // Use the hash to pick a color
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
}

export default PlayerList;