import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

const HangmanWaitingScreen = ({
  isHost,
  members,
  lobbyInfo, // lobbyInfo.createdBy için
  user, // user.id için (kendinizi işaretlemek için)
  sharedGameState, // sharedGameState.gameEnded için
  onOpenHostSetup, // Host ise "Oyunu Kur" butonu için
  lobbyCreatorName,
  t,
}) => {
  const memberCount = members ? members.length : 0;

  return (
    <Container
      maxWidth="md"
      sx={{ mt: 4, flexGrow: 1, overflowY: "auto" }}
    >
      {isHost ? (
        <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            {sharedGameState.gameEnded
              ? t("titleGameOver")
              : t("titleWaiting")}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            gutterBottom
          >
            {sharedGameState.gameEnded
              ? t("descriptionCanStartNew")
              : t("descriptionWaitingForPlayers")}
          </Typography>
          {/* GameControls buraya taşınabilir veya ayrı bir GameControlsWrapper içinde kalabilir */}
          {/* <GameControls isHost={isHost} gamePhase={sharedGameState.gameEnded ? "ended" : "waiting"} onOpenHostSetup={onOpenHostSetup} t={t} /> */}


          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            <PeopleIcon sx={{ verticalAlign: "middle", mr: 1 }} />
            {t("Joined Players")} ({memberCount})
          </Typography>
          {members && memberCount > 0 ? (
            <List
              dense
              sx={{
                mb: 3,
                maxHeight: 200,
                overflow: "auto",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              {members.map((member) => (
                <ListItem key={member.id}>
                  <ListItemIcon>
                    <PersonIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      member.name ||
                      member.username ||
                      `${t("defaultNamePrefix")} ${member.id.substring(0, 4)}`
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary" sx={{ my: 2 }}>
              {t("hangmanNoPlayers")}
            </Typography>
          )}
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            {(!members ||
              members.filter((m) => m.id !== user.id).length < 1) &&
              !sharedGameState.gameEnded &&
              t("hangmanStartWarning")}
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          {!sharedGameState.gameEnded && (
            <HourglassEmptyIcon
              sx={{ fontSize: 60, color: "primary.main", mb: 2 }}
            />
          )}
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "medium" }}
          >
            {sharedGameState.gameEnded
              ? t("Game Over - Waiting Screen")
              : t("Welcome to Lobby!")}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            {t("waitingForHost", {
              hostName: lobbyCreatorName,
              action: sharedGameState.gameEnded
                ? t("startNewGame")
                : t("startGame"),
            })}
          </Typography>

          {!sharedGameState.gameEnded && (
            <CircularProgress sx={{ mb: 3 }} />
          )}

          <Typography variant="h6" gutterBottom>
            <PeopleIcon sx={{ verticalAlign: "middle", mr: 1 }} />
            {t("Joined Players")} ({memberCount})
          </Typography>
          {members && memberCount > 0 ? (
            <List
              dense
              sx={{
                mb: 2,
                maxHeight: 150,
                overflow: "auto",
                width: "80%",
                margin: "0 auto",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              {members.map((member) => (
                <ListItem key={member.id}>
                  <ListItemText
                    primary={`${member.name || member.username || t("player.defaultNamePrefixShort")}${
                      member.id === user.id ? t("player.indicatorYouSuffix") : ""
                    }${
                      member.id === lobbyInfo.createdBy ? t("player.indicatorHostSuffix") : ""
                    }`}
                    sx={{ textAlign: "center" }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary" sx={{ my: 2 }}>
              {t("NoJoinedPlayer")}
            </Typography>
          )}
          <Alert
            severity="info"
            variant="outlined"
            sx={{
              mt: 4,
              p: 2,
              justifyContent: "center",
              fontSize: "1rem",
            }}
          >
            {sharedGameState.gameEnded
              ? t("hostCanStart")
              : t("willStart")}
          </Alert>
        </Paper>
      )}
    </Container>
  );
};
export default HangmanWaitingScreen;