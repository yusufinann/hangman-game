import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Avatar,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import MoodIcon from '@mui/icons-material/Mood';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const avatarColors = ['#FFC107', '#FF5722', '#9C27B0', '#3F51B5', '#2196F3', '#009688'];

const GameEndScreen = ({ sharedGameState, onClose, t }) => {
  const theme = useTheme();

  const getStatusIcon = (player) => {
    if (player.won) return <CheckCircleIcon color="success" fontSize="small" />;
    if (player.eliminated) return <CancelIcon color="error" fontSize="small" />;
    return <AccessTimeIcon color="info" fontSize="small" />;
  };

  const getStatusText = (player) => {
    if (player.won) return t('Won');
    if (player.eliminated) return t('Eliminated');
    return t('Finished');
  };

  const getAccuracyRate = (player) => {
    const total = (player.correctGuessesCount || 0) + (player.incorrectGuessesCount || 0);
    return total > 0 ? Math.round(((player.correctGuessesCount || 0) * 100) / total) : 0;
  };

  const rankings = sharedGameState?.rankings || [];
  const word = sharedGameState?.word || t('UNKNOWN_WORD');
  const maxAttempts = sharedGameState?.maxAttempts || 6;

  return (
    <Box>
      <Paper
        elevation={3}
        sx={{
          width: '50vw',   
          height: '90%',  
          p: 0, 
          textAlign: 'center',
          borderRadius: 2.5,
          backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(0,0,0,0.03))',
          overflow: 'hidden', 
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 2, sm: 3 } }}>
         
          <Box
            sx={{
              position: 'relative',
              mb: { xs: 1, sm: 2 },
              py: { xs: 1.5, sm: 2 }, 
              background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
              borderRadius: 2,
              color: 'white',
              boxShadow: theme.shadows[4],
              overflow: 'hidden',
            }}
          >
        
            <Box
              sx={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none'
              }}
            >
              {[...Array(15)].map((_, i) => ( 
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    width: `${Math.random() * 3 + 4}px`,
                    height: `${Math.random() * 12 + 20}px`,
                    opacity: Math.random() * 0.2 + 0.1,
                    background: 'white',
                    borderRadius: '2px',
                    left: `${Math.random() * 100}%`,
                    top: '-30px',
                    animation: `fall ${Math.random() * 4 + 3}s ${Math.random() * 3}s linear infinite`,
                    transformOrigin: 'center center',
                    '@keyframes fall': {
                      '0%': { transform: `translateY(0px) rotate(${Math.random() * 180 - 90}deg)` },
                      '100%': { transform: `translateY(calc(100% + 50px)) rotate(${Math.random() * 360}deg)` },
                    }
                  }}
                />
              ))}
            </Box>

            <Typography
              variant="h4"
              sx={{
                textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
              
                position: 'relative',
                fontSize: { xs: '1.8rem', sm: '2.125rem' }
              }}
            >
              {t('Game Over!')}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5, position: 'relative' }}>
              <Chip
                label={word.toUpperCase()}
                color="secondary"
                variant="filled"
                sx={{
                  fontSize: {xs: '1.1rem', sm: '1.3rem'}, 
                  fontWeight: 'bold',
                  py: {xs: 2, sm: 2.5 },
                  px: {xs: 1.5, sm: 2},
                  border: '2px solid rgba(255,255,255,0.5)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                }}
                icon={<StarIcon sx={{ fontSize: {xs: '1.3rem !important', sm: '1.6rem !important'}}} />}
              />
            </Box>

            <Typography variant="body1" sx={{ opacity: 0.95, fontWeight: 500, position: 'relative', fontSize: {xs: '0.875rem', sm: '1rem'} }}>
              {t('Correct Word')}
            </Typography>
          </Box>

      
          <Typography
            variant="h5" 
            sx={{
              mb: {xs: 2, sm: 3},
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.2,
              color: theme.palette.text.primary,
              fontWeight: 'medium',
              fontSize: { xs: '1.2rem', sm: '1.5rem' } 
            }}
          >
            <EmojiEventsIcon sx={{ fontSize: {xs: 22, sm: 28}, color: theme.palette.warning.main }} />
            {t('Rank')}
          </Typography>

         
          <Stack spacing={1.5}> 
            {rankings.map((player, index) => {
              const accuracyRate = getAccuracyRate(player);
              const avatarBgColor = avatarColors[index % avatarColors.length];
              const playerName = player.name || player.userName || t('Unknown Player');

              return (
                <Card
                  key={player.playerId || index}
                  elevation={index < 3 ? 4 : 2} 
                  sx={{
                    position: 'relative',
                    borderRadius: 1.5,
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-3px)', 
                      boxShadow: theme.shadows[index < 3 ? 6 : 4],
                    },
                    border: index === 0 ? `2px solid ${theme.palette.warning.main}` :
                            index === 1 ? `2px solid ${theme.palette.grey[500]}` :
                            index === 2 ? `2px solid #CD7F32` : `1px solid ${theme.palette.divider}`,
                    background: index === 0 ? 'linear-gradient(to right, rgba(255,215,0,0.1), transparent)' :
                                index === 1 ? 'linear-gradient(to right, rgba(192,192,192,0.1), transparent)' :
                                index === 2 ? 'linear-gradient(to right, rgba(205,127,50,0.1), transparent)' :
                                theme.palette.background.paper,
                  }}
                >
                  {index < 3 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -10, 
                        left: -10,
                        zIndex: 5,
                        background: index === 0 ? 'linear-gradient(45deg, #FFD700, #FFC400)' :
                                  index === 1 ? 'linear-gradient(45deg, #C0C0C0, #BDBDBD)' :
                                  'linear-gradient(45deg, #CD7F32, #B87333)',
                        borderRadius: '50%',
                        width: 28, 
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.25)',
                        border: '2px solid white',
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.8rem' }}>
                        {index + 1}
                      </Typography>
                    </Box>
                  )}

                  <CardContent sx={{ p: { xs: 1.25, sm: 1.5 } }}> 
                    <Box display="flex" alignItems="center" justifyContent="space-between" gap={{ xs: 1, sm: 1.5 }}>
                     
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          flexGrow: 1,
                          minWidth: 0,
                        }}
                      >
                        {index >= 3 && (
                          <Typography sx={{ fontWeight: 'bold', width: '25px', textAlign: 'left', fontSize: '0.75rem', mr: 0.5, color: theme.palette.text.secondary }}>
                            {index + 1}.
                          </Typography>
                        )}
                        <Avatar
                          src={player.avatar}
                          alt={playerName.substring(0,1)}
                          sx={{
                            bgcolor: !player.avatar ? avatarBgColor : 'transparent',
                            width: {xs: 30, sm: 34},
                            height: {xs: 30, sm: 34},
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            ml: (index < 3 && player.avatar) ? 0.5 : 0,
                            mr: 1,
                            border: player.avatar ? `1.5px solid ${theme.palette.divider}` : 'none',
                          }}
                        >
                          {!player.avatar && playerName.substring(0, 1).toUpperCase()}
                        </Avatar>

                        <Box sx={{ textAlign: 'left', overflow: 'hidden', flexGrow: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontWeight: 'bold',
                              fontSize: {xs: '0.8rem', sm: '0.9rem'},
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              maxWidth: '100%',
                              color: theme.palette.text.primary,
                            }}
                            title={playerName}
                          >
                            {playerName}
                          </Typography>

                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.2 }}>
                            {getStatusIcon(player)}
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5, fontSize: '0.7rem' }}>
                              {getStatusText(player)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          flexShrink: 0,
                         
                          width: { xs: '95px', sm: '105px' }, 
                        }}
                      >
                        <Stack spacing={1}>
                          <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.2 }}>
                              <Typography variant="caption" color="text.secondary" sx={{fontSize: '0.65rem'}}>{t('Accuracy')}</Typography>
                              <Typography variant="caption" fontWeight="bold" sx={{fontSize: '0.7rem'}}>{accuracyRate}%</Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={accuracyRate}
                              color={accuracyRate >= 75 ? 'success' : accuracyRate >= 40 ? 'warning' : 'error'}
                              sx={{ height: 5, borderRadius: 2.5 }}
                            />
                          </Box>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
                            <Chip
                              icon={<CheckCircleIcon sx={{ fontSize: '0.8rem !important', ml: '2px' }} />}
                              label={`${player.correctGuessesCount || 0}`}
                              size="small"
                              color="success"
                              variant="outlined"
                              sx={{ height: 22, flexGrow: 1, '& .MuiChip-label': { px: '3px', fontSize: '0.65rem', mr: '1px' } }}
                            />
                            <Chip
                              icon={<CancelIcon sx={{ fontSize: '0.8rem !important', ml: '2px' }} />}
                              label={`${player.incorrectGuessesCount || 0}`}
                              size="small"
                              color="error"
                              variant="outlined"
                              sx={{ height: 22, flexGrow: 1, '& .MuiChip-label': { px: '3px', fontSize: '0.65rem', mr: '1px' } }}
                            />
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.3, flexWrap: 'wrap', gap: '1px' }}>
                            {[...Array(player.remainingAttempts || 0)].map((_, i) => (
                              <MoodIcon key={`mood-${i}`} color="success" sx={{ fontSize: '1rem' }} />
                            ))}
                            {[...Array(Math.max(0, maxAttempts - (player.remainingAttempts || 0)))].map((_, i) => (
                              <SentimentVeryDissatisfiedIcon key={`sad-${i}`} sx={{ fontSize: '1rem', color: theme.palette.action.disabled }} />
                            ))}
                          </Box>
                        </Stack>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </Box>

        <Box sx={{ p: { xs: 1.5, sm: 2 }, borderTop: `1px solid ${theme.palette.divider}`, backgroundColor: theme.palette.background.default, mt: 'auto' }}>
          <Button variant="contained" onClick={onClose} fullWidth size="large" color="primary">
            {t('Back to Lobby')}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default GameEndScreen;