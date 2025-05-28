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
import HangmanDrawing from './GamePlayArea/HangmanDrawing';

function alpha(color, alphaValue) {
  if (!color) return undefined;
  const hexColor = String(color);
  return hexColor + String(Math.round(alphaValue * 255)).toString(16).padStart(2, '0');
}

function getAvatarColor(userId, theme) {
  let hash = 0;
  const userIdString = String(userId);
  for (let i = 0; i < userIdString.length; i++) {
    hash = userIdString.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main,
    theme.palette.text.secondary,
    theme.palette.grey[500],
    theme.palette.grey[700],
    '#9c27b0',
    '#00796b',
    '#e65100',
    '#3e2723',
    '#1a237e',
    theme.palette.info.dark,
    theme.palette.success.dark,
    theme.palette.warning.dark,
    theme.palette.error.dark,
  ];
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
}

const PlayerList = ({ sharedGameState, userId, t }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const gamePlayers = React.useMemo(() =>
    Object.values(sharedGameState.playerStates || {}),
    [sharedGameState.playerStates]
  );

  const sortedPlayers = React.useMemo(() => {
    return [...gamePlayers].sort((psA, psB) => {
      const isCurrentUserA = psA.userId === userId;
      const isCurrentUserB = psB.userId === userId;
      const isHostA = psA.userId === sharedGameState.hostId;
      const isHostB = psB.userId === sharedGameState.hostId;
      const isCurrentPlayerA = psA.userId === sharedGameState.currentPlayerId && sharedGameState.gameStarted && !sharedGameState.gameEnded;
      const isCurrentPlayerB = psB.userId === sharedGameState.currentPlayerId && sharedGameState.gameStarted && !sharedGameState.gameEnded;

      if (isCurrentUserA !== isCurrentUserB) return isCurrentUserA ? -1 : 1;
      if (isHostA !== isHostB) return isHostA ? -1 : 1;
      if (isCurrentPlayerA !== isCurrentPlayerB) return isCurrentPlayerA ? -1 : 1;

      const nameA = psA.name || psA.userName || '';
      const nameB = psB.name || psB.userName || '';
      return nameA.localeCompare(nameB);
    });
  }, [gamePlayers, userId, sharedGameState.hostId, sharedGameState.currentPlayerId, sharedGameState.gameStarted, sharedGameState.gameEnded]);

  return (
    <Paper
      elevation={3}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 2,
        bgcolor: theme.palette.background.paper,
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
            {t("playerList.title")}
          </Typography>
        </Box>
        <Chip
          size="small"
          label={gamePlayers.length}
          color="primary"
          sx={{
            fontWeight: 'bold',
            minWidth: 28
          }}
        />
      </Box>

      <Box sx={{
        overflowY: 'auto',
        flexGrow: 1,
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        pr: { xs: 1, sm: 2 }
      }}>
        {sortedPlayers.map(playerStatus => {
          const isCurrent = playerStatus.userId === userId;
          const isGameHost = playerStatus.userId === sharedGameState.hostId;
          const isCurrentTurnPlayer = playerStatus.userId === sharedGameState.currentPlayerId &&
                                    sharedGameState.gameStarted &&
                                    !sharedGameState.gameEnded;

          let statusChip = null;
          if (playerStatus.won) {
            statusChip = (
              <Chip
                size="small"
                icon={<EmojiEventsIcon fontSize="small" />}
                label={t("playerList.status.won")}
                color="success"
                sx={{ height: 24, fontSize: '0.7rem' }}
              />
            );
          } else if (playerStatus.eliminated) {
            statusChip = (
              <Chip
                size="small"
                label={t("playerList.status.eliminated")}
                color="error"
                sx={{ height: 24, fontSize: '0.7rem' }}
              />
            );
          }

          const displayName = playerStatus.userName || playerStatus.name || t("playerList.undefinedPlayer");
          const initial = displayName.charAt(0).toUpperCase();
          const avatarSrc = playerStatus.avatar || undefined;

          const avatarElement = isGameHost ? (
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              badgeContent={
                <Tooltip title={t("playerList.role.host")}>
                  <StarIcon
                    sx={{
                      fontSize: 14,
                      color: theme.palette.warning.main,
                      bgcolor: theme.palette.background.paper,
                      borderRadius: '50%',
                      border: `1px solid ${theme.palette.background.paper}`
                    }}
                  />
                </Tooltip>
              }
            >
              <Avatar
                src={avatarSrc}
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  border: isCurrent ? `2px solid ${theme.palette.primary.main}` : 'none',
                  bgcolor: getAvatarColor(playerStatus.userId, theme),
                }}
              >
                {!avatarSrc && initial}
              </Avatar>
            </Badge>
          ) : (
            <Avatar
              src={avatarSrc}
              sx={{
                width: 32,
                height: 32,
                fontSize: '1rem',
                fontWeight: 'bold',
                border: isCurrent ? `2px solid ${theme.palette.primary.main}` : 'none',
                bgcolor: getAvatarColor(playerStatus.userId, theme),
              }}
            >
              {!avatarSrc && initial}
            </Avatar>
          );

          return (
            <Box
              key={playerStatus.userId}
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
                      label={t("playerList.currentUserIndicator.full")}
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
                        color: theme.palette.primary.contrastText,
                        fontSize: '0.6rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {t("playerList.currentUserIndicator.short")}
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
                    sharedGameState.gameStarted && !playerStatus.won && !playerStatus.eliminated && (
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
                             {t("playerList.attemptsLeft", { count: playerStatus.remainingAttempts })}
                          </Box>
                       </Box>
                    )
                  )}

                  {isCurrentTurnPlayer && (
                    <Chip
                      size="small"
                      label={t("playerList.currentTurnIndicator")}
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
                  xs: playerStatus.remainingAttempts < 6 && !playerStatus.won && !playerStatus.eliminated ? 'block' : 'none',
                  sm: !playerStatus.won && !playerStatus.eliminated ? 'block' : 'none'
                },
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

export default PlayerList;