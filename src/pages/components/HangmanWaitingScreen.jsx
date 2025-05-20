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
  CardContent,
  Avatar,
  Fade,
  Chip,
  useTheme,
  useMediaQuery,
  Stack
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CelebrationIcon from "@mui/icons-material/Celebration";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const HangmanWaitingScreen = ({
  isHost,
  members,
  lobbyInfo,
  user,
  sharedGameState,
  onOpenHostSetup,
  lobbyCreatorName,
  t,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const memberCount = members ? members.length : 0;
  const isGameEnded = sharedGameState?.gameEnded;
  
  // Random pastel colors for avatars
  const getRandomColor = (userId) => {
    const colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7', 
      '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', 
      '#009688', '#4caf50', '#8bc34a', '#cddc39'
    ];
    
    // Use the userId to consistently assign the same color to each user
    const charSum = userId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charSum % colors.length];
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };
  
  const HostView = () => (
    <Paper 
      elevation={6} 
      sx={{ 
        p: 4, 
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
            <CelebrationIcon color="primary" sx={{ fontSize: 40, mr: 1 }} /> : 
            <SportsEsportsIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
          }
          <Typography
            variant="h4"
            component="h1"
            sx={{ 
              fontWeight: "bold", 
              color: "primary",
              textAlign: "center"
            }}
          >
            {isGameEnded ? t("titleGameOver") : t("titleWaiting")}
          </Typography>
        </Box>
        
        <Typography
          variant="subtitle1"
          color="text.secondary"
          gutterBottom
          sx={{ mb: 3, textAlign: 'center' }}
        >
          {isGameEnded
            ? t("descriptionCanStartNew")
            : t("descriptionWaitingForPlayers")}
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
            label={`${t("Joined Players")} (${memberCount})`}
            color="primary"
            sx={{ 
              fontWeight: 'bold', 
              fontSize: '1rem',
              py: 2.5,
              px: 1,
              "& .MuiChip-icon": {
                fontSize: 24
              }
            }} 
          />
        </Box>

        {members && memberCount > 0 ? (
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
              {members.map((member, index) => (
                <Box key={member.id}>
                  <ListItem
                    sx={{
                      py: 1.5,
                      px: 2,
                      bgcolor: member.id === user.id ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        sx={{ 
                          bgcolor: getRandomColor(member.id),
                          fontWeight: 'bold'
                        }}
                      >
                        {getInitials(member.name || member.username)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={500}>
                          {member.name ||
                            member.username ||
                            `${t("defaultNamePrefix")} ${member.id.substring(0, 4)}`}
                          {member.id === user.id && 
                            <Chip 
                              label={t("You")} 
                              size="small" 
                              sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                            />
                          }
                          {member.id === lobbyInfo?.createdBy && 
                            <Chip 
                              label={t("Host")} 
                              color="secondary" 
                              size="small" 
                              sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                            />
                          }
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < members.length - 1 && <Divider variant="inset" component="li" />}
                </Box>
              ))}
            </List>
          </Card>
        ) : (
          <Alert 
            severity="info" 
            variant="filled"
            icon={<PeopleIcon />}
            sx={{ 
              width: '100%',
              mb: 3,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {t("hangmanNoPlayers")}
          </Alert>
        )}
        
        {(!members || members.filter((m) => m.id !== user.id).length < 1) && !isGameEnded && (
          <Alert 
            severity="warning" 
            variant="outlined"
            sx={{ 
              width: '100%',
              textAlign: 'center'
            }}
          >
            {t("hangmanStartWarning")}
          </Alert>
        )}
      </Box>
    </Paper>
  );
  
  const GuestView = () => (
    <Paper 
      elevation={6} 
      sx={{ 
        p: 4, 
        textAlign: "center",
        borderRadius: 2,
        background: `linear-gradient(to bottom, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
      }}
    >
      <Stack spacing={3} alignItems="center">
        {!isGameEnded && (
          <Fade in={true} timeout={800}>
            <Box sx={{ position: 'relative', height: 80, width: 80 }}>  
              <HourglassEmptyIcon
                sx={{ 
                  fontSize: 40, 
                  color: "primary",
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
            sx={{ fontSize: 60, mb: 1 }} 
          />
        )}
        
        <Typography
          variant="h4"
          component="h2"
          sx={{ fontWeight: "bold", color: "primary" }}
        >
          {isGameEnded ? t("Game Over - Waiting Screen") : t("Welcome to Lobby!")}
        </Typography>
        
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 500, mx: 'auto' }}
        >
          {t("waitingForHost", {
            hostName: lobbyCreatorName,
            action: isGameEnded ? t("startNewGame") : t("startGame"),
          })}
        </Typography>

        <Box sx={{ width: '100%', pt: 2 }}>
          <Divider>
            <Chip 
              icon={<PeopleIcon />} 
              label={`${t("Joined Players")} (${memberCount})`}
              color="primary"
              sx={{ fontWeight: 'medium' }}
            />
          </Divider>
        </Box>

        {members && memberCount > 0 ? (
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
            }}
          >
            <List>
              {members.map((member, index) => (
                <Box key={member.id}>
                  <ListItem 
                    sx={{
                      py: 1,
                      bgcolor: member.id === user.id ? 'rgba(25, 118, 210, 0.08)' : 'transparent'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        sx={{ 
                          bgcolor: getRandomColor(member.id),
                          fontWeight: 'bold'
                        }}
                      >
                        {getInitials(member.name || member.username)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1">
                          {member.name || member.username || t("player")}
                          {member.id === user.id && 
                            <Chip 
                              label={t("You")} 
                              size="small" 
                              sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                            />
                          }
                          {member.id === lobbyInfo?.createdBy && 
                            <Chip 
                              label={t("Host")} 
                              color="secondary" 
                              size="small" 
                              sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                            />
                          }
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < members.length - 1 && <Divider variant="inset" component="li" />}
                </Box>
              ))}
            </List>
          </Card>
        ) : (
          <Typography color="text.secondary" sx={{ my: 2 }}>
            {t("NoJoinedPlayer")}
          </Typography>
        )}
        
        <Alert
          severity="info"
          variant="filled"
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            maxWidth: isMobile ? '100%' : '80%',
            margin: '0 auto'
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {isGameEnded ? t("hostCanStart") : t("willStart")}
          </Typography>
        </Alert>
      </Stack>
    </Paper>
  );

  return (
    <Container
      maxWidth="md"
      sx={{ 
        mt: 4, 
        mb: 4,
        px: isMobile ? 2 : 3,
        flexGrow: 1, 
        overflowY: "auto",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}
    >
      <Box sx={{ width: '100%' }}>
        {isHost ? <HostView /> : <GuestView />}
      </Box>
    </Container>
  );
};

export default HangmanWaitingScreen;