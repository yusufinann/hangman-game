import React from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Alert,
  Card,
  Avatar,
  Fade,
  Chip,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CelebrationIcon from "@mui/icons-material/Celebration";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FallingDotsBackground from './FallingDotsBackground'; 

const HangmanWaitingScreen = ({
  isHost,
  lobbyInfo,
  user,
  sharedGameState,
  lobbyCreatorName,
  t,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const gamePlayers = React.useMemo(() => {
    return Object.values(sharedGameState?.playerStates || {});
  }, [sharedGameState?.playerStates]);

  const playerCount = gamePlayers.length;
  const isGameEnded = sharedGameState?.gameEnded;

  const getRandomColor = (userId) => {
    const colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7',
      '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
      '#009688', '#4caf50', '#8bc34a', '#cddc39'
    ];
    if (!userId) return colors[0];
    const charSum = String(userId).split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charSum % colors.length];
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const HostView = () => {
    return (
      <Paper
        elevation={6}
        sx={{
          p: isMobile ? 3 : 4,
          borderRadius: 2,
          background: `linear-gradient(to bottom, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2
            }}
          >
            {isGameEnded ?
              <CelebrationIcon color="primary" sx={{ fontSize: isMobile ? 30 : 40, mr: 1 }} /> :
              <SportsEsportsIcon color="primary" sx={{ fontSize: isMobile ? 30 : 40, mr: 1 }} />
            }
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component="h1"
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                textAlign: "center"
              }}
            >
              {isGameEnded ? t("hangman.titleGameOver", "Oyun Bitti") : t("hangman.titleWaiting", "Oyuncular Bekleniyor")}
            </Typography>
          </Box>

          <Typography
            variant="subtitle1"
            color="text.secondary"
            gutterBottom
            sx={{ mb: 3, textAlign: 'center' }}
          >
            {isGameEnded
              ? t("hangman.descriptionCanStartNew", "Host yeni bir oyun başlatabilir.")
              : t("hangman.descriptionWaitingForPlayers", "Oyuncuların katılması bekleniyor. Host oyunu başlatabilir.")}
          </Typography>

          <Divider sx={{ width: '100%', my: 3 }} />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}
          >
            <Chip
              icon={<PeopleIcon />}
              label={`${t("hangman.joinedPlayers", "Katılan Oyuncular")} (${playerCount})`}
              color="primary"
              sx={{
                fontWeight: 'bold',
                fontSize: isMobile ? '0.9rem' : '1rem',
                py: isMobile ? 2 : 2.5,
                px: 1,
                "& .MuiChip-icon": {
                  fontSize: isMobile ? 20 : 24
                }
              }}
            />
          </Box>

          {playerCount > 0 ? (
            <Card
              variant="outlined"
              sx={{
                width: '100%',
                maxHeight: 300,
                overflow: 'auto',
                mb: 3,
                borderRadius: 2,
                transition: 'all 0.3s ease'
              }}
            >
              <List disablePadding>
                {gamePlayers.map((player, index) => (
                  <Box key={player.userId || index}>
                    <ListItem
                      sx={{
                        py: 1.5,
                        px: 2,
                        bgcolor: player.userId === user?.id ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                        transition: 'all 0.2s'
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={player.avatar || undefined}
                          sx={{
                            bgcolor: !player.avatar ? getRandomColor(player.userId) : undefined,
                            fontWeight: 'bold'
                          }}
                        >
                          {!player.avatar && getInitials(player.name || player.userName)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight={500}>
                            {player.name ||
                              player.userName ||
                              `${t("hangman.defaultNamePrefix", "Oyuncu")} ${String(player.userId || '???').substring(0, 4)}`}
                            {player.userId === user?.id &&
                              <Chip
                                label={t("hangman.youTag", "Siz")}
                                size="small"
                                sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                              />
                            }
                            {lobbyInfo?.createdBy && player.userId === lobbyInfo.createdBy &&
                              <Chip
                                label={t("hangman.hostTag", "Host")}
                                color="secondary"
                                size="small"
                                sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                              />
                            }
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < gamePlayers.length - 1 && <Divider variant="inset" component="li" />}
                  </Box>
                ))}
              </List>
            </Card>
          ) : (
            <Alert
              severity="info"
              variant="outlined"
              icon={<PeopleIcon />}
              sx={{
                width: '100%',
                mb: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {t("hangman.noPlayers", "Henüz katılan oyuncu yok.")}
            </Alert>
          )}
        </Box>
      </Paper>
    );
  };

  const GuestView = () => {
    return (
      <Paper
        elevation={6}
        sx={{
          p: isMobile ? 3 : 4,
          textAlign: "center",
          borderRadius: 2,
          background: `linear-gradient(to bottom, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }}
      >
        <Stack spacing={isMobile ? 2 : 3} alignItems="center">
          {!isGameEnded && (
            <Fade in={true} timeout={800}>
              <Box sx={{ position: 'relative', height: isMobile ? 60 : 80, width: isMobile ? 60 : 80, mb: 1 }}>
                <HourglassEmptyIcon
                  sx={{
                    fontSize: isMobile ? 30 : 40,
                    color: "primary.main",
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              </Box>
            </Fade>
          )}

          {isGameEnded && (
            <EmojiEventsIcon
              color="primary"
              sx={{ fontSize: isMobile ? 50 : 60, mb: 1 }}
            />
          )}

          <Typography
            variant={isMobile ? "h5" : "h4"}
            component="h2"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            {isGameEnded ? t("hangman.titleGameOver", "Oyun Bitti") : t("hangman.welcomeToLobby", "Lobiye Hoş Geldiniz!")}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 500, mx: 'auto' }}
          >
            {t("waitingForHost", {
              hostName: lobbyCreatorName || t('hangman.theHost', 'Host'),
              action: isGameEnded ? t("hangman.toStartNewGame", "yeni bir oyun başlatmasını") : t("hangman.toStartGame", "oyunu başlatmasını"),
            })}
          </Typography>

          <Box sx={{ width: '100%', pt: 2 }}>
            <Divider>
              <Chip
                icon={<PeopleIcon />}
                label={`${t("hangman.joinedPlayers", "Katılan Oyuncular")} (${playerCount})`}
                color="primary"
                sx={{ fontWeight: 'medium' }}
              />
            </Divider>
          </Box>

          {playerCount > 0 ? (
            <Card
              variant="outlined"
              sx={{
                width: '100%',
                maxWidth: isMobile ? '100%' : '80%',
                maxHeight: 250,
                overflow: 'auto',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                mt: 2
              }}
            >
              <List disablePadding>
                {gamePlayers.map((player, index) => (
                  <Box key={player.userId || index}>
                    <ListItem
                      sx={{
                        py: 1,
                        bgcolor: player.userId === user?.id ? 'rgba(25, 118, 210, 0.08)' : 'transparent'
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={player.avatar || undefined}
                          sx={{
                            bgcolor: !player.avatar ? getRandomColor(player.userId) : undefined,
                            fontWeight: 'bold'
                          }}
                        >
                          {!player.avatar && getInitials(player.name || player.userName)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1">
                            {player.name || player.userName || t("hangman.player", "Oyuncu")}
                            {player.userId === user?.id &&
                              <Chip
                                label={t("hangman.youTag", "Siz")}
                                size="small"
                                sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                              />
                            }
                             {lobbyInfo?.createdBy && player.userId === lobbyInfo.createdBy &&
                              <Chip
                                label={t("hangman.hostTag", "Host")}
                                color="secondary"
                                size="small"
                                sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                              />
                            }
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < gamePlayers.length - 1 && <Divider variant="inset" component="li" />}
                  </Box>
                ))}
              </List>
            </Card>
          ) : (
            <Typography color="text.secondary" sx={{ my: 2 }}>
              {t("hangman.noJoinedPlayer", "Henüz katılan oyuncu yok.")}
            </Typography>
          )}

          <Alert
            severity="info"
            variant="outlined"
            sx={{
              mt: 2,
              p: isMobile ? 1.5 : 2,
              borderRadius: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              maxWidth: isMobile ? '100%' : '80%',
              margin: '0 auto' 
            }}
          >
            <Typography variant={isMobile ? "body2" : "body1"} sx={{ fontWeight: 'medium' }}>
              {isGameEnded ? t("hangman.hostCanStartNewGame", "Host yeni bir oyun başlatabilir.") : t("hangman.gameWillStartSoon", "Oyun yakında başlayacak!")}
            </Typography>
          </Alert>
        </Stack>
      </Paper>
    );
  };
  
  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          position: 'relative', 
          zIndex: 1,          
          pt: isMobile ? 2 : 4,
          pb: isMobile ? 2 : 4,
          px: isMobile ? 1 : 3,
          flexGrow: 1,
          overflowY: "auto", 
          display: 'flex',
          flexDirection: 'column', 
          alignItems: 'center',    
          minHeight: 'calc(100vh - 120px)', 
        }}
      > <FallingDotsBackground />
        <Box sx={{ width: '100%', maxWidth: theme.breakpoints.values.md }}>
          {isHost ? <HostView /> : <GuestView />}
        </Box>
      </Container>
    </>
  );
};

export default HangmanWaitingScreen;