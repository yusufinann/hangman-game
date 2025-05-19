import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Avatar,
  Chip,
  Grid,
  Container,
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

const GameEndScreen = ({ sharedGameState, onClose,t }) => { 
  const theme = useTheme();

  const getStatusIcon = (player) => {
    if (player.won) return <CheckCircleIcon color="success" fontSize="small" />;
    if (player.eliminated) return <CancelIcon color="error" fontSize="small" />;
    return <AccessTimeIcon color="info" fontSize="small" />;
  };

  const getStatusText = (player) => {
    if (player.won) return 'Kazandı';
    if (player.eliminated) return 'Elendi';
    return 'Bitirdi';
  };

  const getAccuracyRate = (player) => {
    const total = (player.correctGuessesCount || 0) + (player.incorrectGuessesCount || 0);
    return total > 0 ? Math.round((player.correctGuessesCount || 0) * 100 / total) : 0;
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          p: { xs: 1, sm: 2 },
          textAlign: 'center',
          borderRadius: 2,
          backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(0,0,0,0.05))',
          maxHeight: '80vh', 
          overflowY: 'auto', 
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ flexGrow: 1, overflowY: 'auto', paddingRight: '4px' }}> 
          <Box sx={{
            position: 'relative',
            mb: 2,
            py: 1,
            background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
            borderRadius: 1,
            color: 'white',
            boxShadow: theme.shadows[2],
            overflow: 'hidden'
          }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%' }}>
              {[...Array(5)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    width: '5px',
                    height: '40px',
                    opacity: 0.2,
                    background: 'white',
                    transform: `rotate(${Math.random() * 60 - 30}deg)`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                letterSpacing: 1,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                mb: 1
              }}
            >
              {t("Game Over!")}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
              <Chip
                label={sharedGameState.word?.toUpperCase() || "BİLİNMİYOR"}
                color="secondary"
                variant="filled"
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  letterSpacing: 1,
                  py: 2,
                  px: 1,
                  border: '1px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
                icon={<StarIcon sx={{ fontSize: '1.25rem !important' }} />}
              />
            </Box>

            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {t("Correct Word")}
            </Typography>
          </Box>

          <Typography
            variant="h6"
            sx={{
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              color: theme.palette.text.secondary
            }}
          >
            <EmojiEventsIcon sx={{ fontSize: 18 }} />
            {t("Rank")}
          </Typography>

          <Box sx={{ maxHeight: 'calc(80vh - 250px)', overflowY: 'auto', pr: 1, mr: -1 }}> {/* Adjusted maxHeight */}
            <Grid container spacing={1}>
              {sharedGameState.rankings.map((player, index) => {
                const accuracyRate = getAccuracyRate(player);
                const avatarColor = avatarColors[index % avatarColors.length];

                return (
                  <Grid item xs={12} key={player.playerId || index}>
                    <Card
                      elevation={index < 3 ? 3 : 1}
                      sx={{
                        position: 'relative',
                        borderRadius: 1,
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)'
                        },
                        border: index === 0 ? '1px solid gold' :
                              index === 1 ? '1px solid silver' :
                              index === 2 ? '1px solid #cd7f32' : 'none',
                        background: index === 0 ? 'linear-gradient(to right, rgba(255,215,0,0.05), transparent)' :
                                  index === 1 ? 'linear-gradient(to right, rgba(192,192,192,0.05), transparent)' :
                                  index === 2 ? 'linear-gradient(to right, rgba(205,127,50,0.05), transparent)' : 'inherit'
                      }}
                    >
                      {index < 3 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -8,
                            left: -8,
                            zIndex: 5,
                            background: index === 0 ? 'linear-gradient(45deg, #FFD700, #FFC400)' :
                                      index === 1 ? 'linear-gradient(45deg, #C0C0C0, #E0E0E0)' :
                                      'linear-gradient(45deg, #CD7F32, #B87333)',
                            borderRadius: '50%',
                            width: 24,
                            height: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            border: '1px solid white'
                          }}
                        >
                          <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'white' }}>
                            {index + 1}
                          </Typography>
                        </Box>
                      )}

                      <CardContent sx={{ p: 1 }}>
                        <Grid container spacing={1} alignItems="center">
                          <Grid item xs={7} sm={7}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {index >= 3 && (
                                <Typography sx={{ fontWeight: 'bold', width: 16, fontSize: '0.75rem' }}>
                                  {index + 1}.
                                </Typography>
                              )}

                              <Avatar
                                sx={{
                                  bgcolor: avatarColor,
                                  width: 28,
                                  height: 28,
                                  fontSize: '0.9rem',
                                  fontWeight: 'bold',
                                  ml: index >= 3 ? 0.5 : 0
                                }}
                              >
                                {(player.name || player.userName || '?').substring(0, 1).toUpperCase()}
                              </Avatar>

                              <Box sx={{ textAlign: 'left', ml: 1, overflow: 'hidden' }}>
                                <Typography
                                  sx={{
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    maxWidth: '100%'
                                  }}
                                >
                                  {player.name || player.userName}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {getStatusIcon(player)}
                                  <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                                    {getStatusText(player)}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Grid>

                          <Grid item xs={5} sm={5}>
                            <Stack spacing={0.5}>
                              <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="caption" color="text.secondary">İsabet</Typography>
                                  <Typography variant="caption" fontWeight="bold">{accuracyRate}%</Typography>
                                </Box>
                                <LinearProgress
                                  variant="determinate"
                                  value={accuracyRate}
                                  color={accuracyRate > 70 ? "success" : accuracyRate > 40 ? "warning" : "error"}
                                  sx={{ height: 4, borderRadius: 1 }}
                                />
                              </Box>

                              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 0.5 }}>
                                <Chip
                                  icon={<CheckCircleIcon sx={{ fontSize: '0.7rem !important' }} />}
                                  label={`${player.correctGuessesCount || 0}`}
                                  size="small"
                                  color="success"
                                  variant="outlined"
                                  sx={{ height: 20, '& .MuiChip-label': { px: 0.5, fontSize: '0.65rem' } }}
                                />
                                <Chip
                                  icon={<CancelIcon sx={{ fontSize: '0.7rem !important' }} />}
                                  label={`${player.incorrectGuessesCount || 0}`}
                                  size="small"
                                  color="error"
                                  variant="outlined"
                                  sx={{ height: 20, '& .MuiChip-label': { px: 0.5, fontSize: '0.65rem' } }}
                                />
                              </Box>

                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {[...Array(player.remainingAttempts)].map((_, i) => (
                                  <MoodIcon key={i} color="success" sx={{ fontSize: '0.75rem' }} />
                                ))}
                                {[...Array(Math.max(0, 6 - player.remainingAttempts))].map((_, i) => ( // Ensure non-negative
                                  <SentimentVeryDissatisfiedIcon key={i} color="disabled" sx={{ fontSize: '0.75rem' }} />
                                ))}
                              </Box>
                            </Stack>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Box>
        <Box sx={{ mt: 2, p: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button variant="contained" onClick={onClose} fullWidth>
            {t( "backLobby")}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default GameEndScreen;