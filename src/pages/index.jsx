import { useState, useEffect, useMemo} from "react";
import {
  Box,
  CircularProgress,
  Alert,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Container,
  Divider,
  Modal,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useGameNotifications } from "../hooks/useGameNotifications";
import { useTurnTimer } from "../hooks/useTurnTimer";
import { useWebSocketHandler } from "../hooks/useWebSocketHandler";
import PeopleIcon from "@mui/icons-material/People";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { GameContainer } from "./components/StyledComponents";
import GameControls from "./components/GameControls";
import HostSetupModal from "./components/HostSetupModal";
import GamePlayArea from "./components/GamePlayArea";
import PlayerList from "./components/PlayerList";
import GameEndScreen from "./components/GameEndScreen";
import CountdownScreen from "./components/CountdownScreen";
import NotificationArea from "./components/NotificationArea";
import useHangmanSound from "../hooks/useHangmanSound";
import VolumeButton from "./components/VolumeButton";

const Hangman = ({ lobbyCode, lobbyInfo, members, socket, user,hangmanSoundEnabled,toggleSound }) => {
  const [isHost, setIsHost] = useState(false);
  const [gamePhase, setGamePhase] = useState("loading");
  const [hostSetupData, setHostSetupData] = useState({
    category: "",
    availableCategories: [],
  });
  const { playSound } = useHangmanSound(hangmanSoundEnabled); 
  const [showHostSetupModal, setShowHostSetupModal] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [showGameEndModal, setShowGameEndModal] = useState(false);
  const [hasAcknowledgedGameEnd, setHasAcknowledgedGameEnd] = useState(false);
  const [sharedGameState, setSharedGameState] = useState({
    maskedWord: "",
    category: "",
    gameStarted: false,
    gameEnded: false,
    currentPlayerId: null,
    hostId: null,
    turnEndsAt: null,
    playerStates: {},
    rankings: [],
    wordLength: 0,
  });

  const [myPlayerSpecificState, setMyPlayerSpecificState] = useState({
    correctGuesses: [],
    incorrectGuesses: [],
    remainingAttempts: 6,
    isMyTurn: false,
    won: false,
    eliminated: false,
  });

  const [currentWordGuessInput, setCurrentWordGuessInput] = useState("");

  const {
    notifications,
    addNotification,
    setNotifications,
    clearAllNotifications,
  } = useGameNotifications();

  useWebSocketHandler({
    socket,
    lobbyCode,
    user,
    isHost,
    addNotification,
    setGamePhase,
    setCountdown,
    setSharedGameState,
    setMyPlayerSpecificState,
    setHostSetupData,
    gamePhase,
    members,
    clearAllNotifications,
     playSoundCallback: playSound,
  });

  const turnTimeLeft = useTurnTimer(
    sharedGameState.turnEndsAt,
    sharedGameState.gameStarted,
    sharedGameState.gameEnded,
    sharedGameState.currentPlayerId,
    user?.id
  );

  const currentUserIsInRankings = useMemo(() => {
    if (!user?.id || !sharedGameState.rankings) {
      return false;
    }
    return sharedGameState.rankings.some(
      (player) => player.playerId === user.id
    );
  }, [sharedGameState.rankings, user?.id]);

  const myActualRemainingAttempts = useMemo(() => {
    const myPlayerData = sharedGameState.playerStates[user?.id];
    return myPlayerData
      ? myPlayerData.remainingAttempts
      : myPlayerSpecificState.eliminated
      ? 0
      : 6;
  }, [
    sharedGameState.playerStates,
    user?.id,
    myPlayerSpecificState.eliminated,
  ]);

  const amIReallyPlaying = useMemo(() => {
    if (!user?.id) return false;
    const myPlayerData = sharedGameState.playerStates[user.id];
    if (!sharedGameState.gameStarted || sharedGameState.gameEnded) return false;
    if (myPlayerSpecificState.won || myPlayerSpecificState.eliminated)
      return false;
    if (myPlayerData && (myPlayerData.won || myPlayerData.eliminated))
      return false;
    return true;
  }, [sharedGameState, myPlayerSpecificState, user?.id]);

  const lobbyCreatorDetails = useMemo(
    () => members.find((m) => m.id === lobbyInfo?.createdBy),
    [members, lobbyInfo?.createdBy]
  );

  const currentPlayerTurnName = useMemo(() => {
    if (!sharedGameState.currentPlayerId) return "Bilinmeyen";
    const player = members.find(
      (m) => m.id === sharedGameState.currentPlayerId
    );
    if (player) return player.name || player.username;
    const playerState =
      sharedGameState.playerStates[sharedGameState.currentPlayerId];
    return playerState?.userName || "Bilinmeyen";
  }, [members, sharedGameState.currentPlayerId, sharedGameState.playerStates]);

  const shouldShowWaitingScreen = useMemo(() => {
    if (gamePhase === "waiting" && !sharedGameState.gameStarted) {
      return true;
    }
    if (gamePhase === "ended" && sharedGameState.gameEnded) {
      if (
        currentUserIsInRankings &&
        !showGameEndModal &&
        hasAcknowledgedGameEnd
      ) {
        return true;
      }
      if (!sharedGameState.rankings || sharedGameState.rankings.length === 0) {
        return true;
      }
      if (
        sharedGameState.rankings &&
        sharedGameState.rankings.length > 0 &&
        !currentUserIsInRankings
      ) {
        return true;
      }
    }
    return false;
  }, [
    gamePhase,
    sharedGameState.gameStarted,
    sharedGameState.gameEnded,
    sharedGameState.rankings,
    currentUserIsInRankings,
    showGameEndModal,
    hasAcknowledgedGameEnd,
  ]);

  useEffect(() => {
    if (user?.id && lobbyInfo?.createdBy) {
      setIsHost(user.id === lobbyInfo.createdBy);
    }
  }, [user?.id, lobbyInfo?.createdBy]);

  useEffect(() => {
    if (sharedGameState.gameStarted && !sharedGameState.gameEnded) {
      setHasAcknowledgedGameEnd(false);
      setShowGameEndModal(false);
    }
  }, [sharedGameState.gameStarted, sharedGameState.gameEnded]);

  useEffect(() => {
    if (
      gamePhase === "ended" &&
      sharedGameState.gameEnded &&
      sharedGameState.rankings &&
      sharedGameState.rankings.length > 0 &&
      !hasAcknowledgedGameEnd &&
      currentUserIsInRankings
    ) {
      setShowGameEndModal(true);
    } else if (showGameEndModal) {
      const shouldModalBeOpen =
        gamePhase === "ended" &&
        sharedGameState.gameEnded &&
        sharedGameState.rankings &&
        sharedGameState.rankings.length > 0 &&
        !hasAcknowledgedGameEnd &&
        currentUserIsInRankings;

      if (!shouldModalBeOpen) {
        setShowGameEndModal(false);
      }
    }
  }, [
    gamePhase,
    sharedGameState.gameEnded,
    sharedGameState.rankings,
    hasAcknowledgedGameEnd,
    showGameEndModal,
    currentUserIsInRankings,
  ]);

  if (gamePhase === "loading" || !user?.id) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress size={50} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Oyun yükleniyor...
        </Typography>
      </Box>
    );
  }
  if (gamePhase === "error") {
    return (
      <Alert severity="error" sx={{ m: 3, p: 2 }}>
        Oyun yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyin veya daha
        sonra tekrar deneyin.
      </Alert>
    );
  }

  const lobbyCreatorName =
    lobbyCreatorDetails?.name || lobbyCreatorDetails?.username || "Bilinmiyor";

  const handleOpenHostSetup = () => {
    if (isHost && socket) {
      socket.send(JSON.stringify({ type: "HANGMAN_GET_CATEGORIES" }));
    }
    setShowHostSetupModal(true);
  };

  const handleHostSetupChange = (e) => {
    const { name, value } = e.target;
    setHostSetupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStartGame = () => {
    if (!socket || !isHost) return;
    const { category } = hostSetupData;
    if (!category) {
      addNotification("Lütfen bir kategori seçin.", "error");
      return;
    }
    if (!members || members.filter((m) => m.id !== user.id).length < 1) {
      addNotification(
        "Oyunu başlatmak için sizden başka en az 1 oyuncu daha gereklidir.",
        "warning"
      );
      return;
    }
    socket.send(
      JSON.stringify({
        type: "HANGMAN_START",
        lobbyCode,
        category,
      })
    );
    setShowHostSetupModal(false);
  };

  const handleLetterGuess = (letter) => {
    if (!socket || !myPlayerSpecificState.isMyTurn || sharedGameState.gameEnded)
      return;
    const l = letter.toLowerCase();
    if (
      myPlayerSpecificState.correctGuesses.includes(l) ||
      myPlayerSpecificState.incorrectGuesses.includes(l)
    ) {
      addNotification("Bu harfi zaten denediniz.", "warning", 2000);
      return;
    }
    socket.send(
      JSON.stringify({ type: "HANGMAN_GUESS_LETTER", lobbyCode, letter: l })
    );
  };

  const handleWordSubmit = (e) => {
    e.preventDefault();
    if (
      !socket ||
      !myPlayerSpecificState.isMyTurn ||
      sharedGameState.gameEnded ||
      !currentWordGuessInput.trim()
    )
      return;
    socket.send(
      JSON.stringify({
        type: "HANGMAN_GUESS_WORD",
        lobbyCode,
        word: currentWordGuessInput.trim(),
      })
    );
    setCurrentWordGuessInput("");
  };

  const handleEndGameByHost = () => {
    if (!socket || !isHost || gamePhase !== "playing") return;
    socket.send(JSON.stringify({ type: "HANGMAN_END_GAME", lobbyCode }));
  };

  const handleCloseGameEndModal = () => {
    setShowGameEndModal(false);
    setHasAcknowledgedGameEnd(true);
  };

  const handleCloseNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <>
    <VolumeButton toggleSound={toggleSound} soundEnabled={hangmanSoundEnabled}/>
      <GameContainer
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "500px",
          height: "100%",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <HostSetupModal
          open={showHostSetupModal && isHost}
          onClose={() => setShowHostSetupModal(false)}
          hostSetupData={hostSetupData}
          onHostSetupChange={handleHostSetupChange}
          onStartGame={handleStartGame}
        />

        {gamePhase === "playing" ? (
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              gap: 2,
              alignItems: "stretch",
              overflow: "auto",
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                minWidth: 0,
                width: { xs: "100%", md: "70%" },
              }}
            >
              <GamePlayArea
                sharedGameState={sharedGameState}
                myPlayerSpecificState={myPlayerSpecificState}
                myActualRemainingAttempts={myActualRemainingAttempts}
                amIReallyPlaying={amIReallyPlaying}
                turnTimeLeft={turnTimeLeft}
                currentPlayerTurnName={currentPlayerTurnName}
                onLetterGuess={handleLetterGuess}
                onWordSubmit={handleWordSubmit}
                currentWordGuessInput={currentWordGuessInput}
                setCurrentWordGuessInput={setCurrentWordGuessInput}
                isHost={isHost}
                gamePhase={gamePhase}
                onOpenHostSetup={handleOpenHostSetup}
                onEndGameByHost={handleEndGameByHost}
              />
            </Box>

            <Box
              sx={{
                width: { xs: "100%", md: "30%" },
                height: "100%",
              }}
            >
              <PlayerList
                members={members}
                sharedGameState={sharedGameState}
                userId={user.id}
              />
            </Box>
          </Box>
        ) : (
          (gamePhase === "waiting" ||
            (gamePhase === "ended" && !showGameEndModal)) && (
            <GameControls
              isHost={isHost}
              gamePhase={gamePhase}
              onOpenHostSetup={handleOpenHostSetup}
              onEndGameByHost={handleEndGameByHost}
            />
          )
        )}

        {shouldShowWaitingScreen && (
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
                    ? "Oyun Bitti - Lobi (Host)"
                    : "Oyun Lobisi (Host)"}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  {sharedGameState.gameEnded
                    ? "Yeni bir oyun başlatabilirsin."
                    : "Oyuncuların katılmasını bekliyorsun. Hazır olduğunda oyunu başlatabilirsin!"}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  <PeopleIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  Katılan Oyuncular ({members ? members.length : 0})
                </Typography>
                {members && members.length > 0 ? (
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
                            `Oyuncu ${member.id.substring(0, 4)}`
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary" sx={{ my: 2 }}>
                    Henüz katılan oyuncu yok.
                  </Typography>
                )}
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {(!members ||
                    members.filter((m) => m.id !== user.id).length < 1) &&
                    !sharedGameState.gameEnded &&
                    "Oyunu başlatmak için sizden başka en az 1 oyuncu daha gereklidir."}
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
                    ? "Oyun Bitti - Bekleme Ekranı"
                    : "Lobiye Hoş Geldin!"}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Host'un ({lobbyCreatorName}){" "}
                  {sharedGameState.gameEnded
                    ? "yeni bir oyun başlatması"
                    : "oyunu başlatması"}{" "}
                  bekleniyor... Lütfen sabırla bekle.
                </Typography>

                {!sharedGameState.gameEnded && (
                  <CircularProgress sx={{ mb: 3 }} />
                )}

                <Typography variant="h6" gutterBottom>
                  <PeopleIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  Katılan Oyuncular ({members ? members.length : 0})
                </Typography>
                {members && members.length > 0 ? (
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
                          primary={`${member.name || member.username}${
                            member.id === user.id ? " (Siz)" : ""
                          }${
                            member.id === lobbyInfo.createdBy ? " (Host)" : ""
                          }`}
                          sx={{ textAlign: "center" }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary" sx={{ my: 2 }}>
                    Henüz katılan başka oyuncu yok.
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
                    ? "Host yeni bir oyun başlatabilir."
                    : "Oyun yakında başlayacak!"}
                </Alert>
              </Paper>
            )}
          </Container>
        )}

        {gamePhase === "ended" &&
          sharedGameState.gameEnded &&
          !showGameEndModal &&
          !(sharedGameState.rankings && sharedGameState.rankings.length > 0) &&
          !isHost && (
            <Alert
              severity="info"
              variant="standard"
              sx={{
                mt: 4,
                p: 3,
                justifyContent: "center",
                fontSize: "1.2rem",
                mx: "auto",
                maxWidth: "md",
              }}
            >
              Oyun sona erdi. Yeni oyun için hostu bekleyin.
            </Alert>
          )}
      </GameContainer>

      <Modal
        open={showGameEndModal}
        onClose={handleCloseGameEndModal}
        aria-labelledby="game-end-screen-title"
        aria-describedby="game-end-screen-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 1,
        }}
      >
        <Box sx={{ outline: "none" }}>
          <GameEndScreen
            sharedGameState={sharedGameState}
            onClose={handleCloseGameEndModal}
          />
        </Box>
      </Modal>

      {gamePhase === "countdown" && countdown !== null && (
        <CountdownScreen countdown={countdown} />
      )}

      <NotificationArea
        notifications={notifications}
        onCloseNotification={handleCloseNotification}
      />
    </>
  );
};

export default Hangman;
