import { useState, useEffect, useMemo, useRef } from "react";
import {
  Alert,
  Box,
} from "@mui/material";
import { useGameNotifications } from "../hooks/useGameNotifications";
import { useTurnTimer } from "../hooks/useTurnTimer";
import { useWebSocketHandler } from "../hooks/useWebSocketHandler";
import { GameContainer } from "./components/StyledComponents";
import GameControls from "./components/GameControls";
import HostSetupModal from "./components/HostSetupModal";
import GamePlayArea from "./components/GamePlayArea";
import PlayerList from "./components/PlayerList";
import CountdownScreen from "./components/CountdownScreen";
import NotificationArea from "./components/NotificationArea";
import useHangmanSound from "../hooks/useHangmanSound";
import HangmanLoading from "./components/HangmanLoading";
import HangmanError from "./components/HangmanError";
import HangmanWaitingScreen from "./components/HangmanWaitingScreen";
import GameEndModalManager from "./components/GameEndModalManager";

const Hangman = ({ lobbyCode, lobbyInfo, members, socket, user, hangmanSoundEnabled, toggleSound, t }) => {
  const [isHost, setIsHost] = useState(false);
  const [gamePhase, setGamePhase] = useState("loading");
  const [hostSetupData, setHostSetupData] = useState({
    category: "",
    availableCategories: [],
  });
  const { playSound } = useHangmanSound(hangmanSoundEnabled);
  const [showHostSetupModal, setShowHostSetupModal] = useState(false);
  const [countdown, setCountdown] = useState(null);

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

  const [isGameEndModalVisible, setIsGameEndModalVisible] = useState(false);
  const prevGameEndedState = useRef(undefined); 

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
    t
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

  const shouldShowWaitingOrEndedScreen = useMemo(() => {
    if (gamePhase === "waiting" && !sharedGameState.gameStarted) {
      return true;
    }
    if (gamePhase === "ended" && sharedGameState.gameEnded && !isGameEndModalVisible) {
      return true;
    }
    return false;
  }, [
    gamePhase,
    sharedGameState.gameStarted,
    sharedGameState.gameEnded,
    isGameEndModalVisible,
  ]);

  useEffect(() => {
    if (user?.id && lobbyInfo?.createdBy) {
      setIsHost(user.id === lobbyInfo.createdBy);
    }
  }, [user?.id, lobbyInfo?.createdBy]);

  useEffect(() => {
  
    if (sharedGameState.hostId !== null && prevGameEndedState.current === undefined) {
      prevGameEndedState.current = sharedGameState.gameEnded;
    }

   
    if (
      gamePhase === "ended" &&
      sharedGameState.gameEnded && 
      prevGameEndedState.current === false && 
      sharedGameState.rankings &&
      sharedGameState.rankings.length > 0 &&
      currentUserIsInRankings
    ) {
      setIsGameEndModalVisible(true);
    }
    if (sharedGameState.hostId !== null) { 
        prevGameEndedState.current = sharedGameState.gameEnded;
    }


  }, [
    gamePhase,
    sharedGameState.gameEnded,
    sharedGameState.rankings,
    sharedGameState.hostId, 
    currentUserIsInRankings,
  ]);


  if (gamePhase === "loading" || !user?.id || (gamePhase !== "error" && sharedGameState.hostId === null && (sharedGameState.gameStarted || sharedGameState.gameEnded))) {
    return <HangmanLoading t={t} />;
  }
  if (gamePhase === "error") {
    return <HangmanError t={t} />;
  }

  const lobbyCreatorName =
    lobbyCreatorDetails?.name || lobbyCreatorDetails?.username || t("Unknown");

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
      addNotification(t("selectCategoryError"), "error");
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
      addNotification(t("alreadyGuessedLetterWarn"), "warning", 2000);
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
    setIsGameEndModalVisible(false);
  };

  const handleCloseNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <>
      <GameContainer
        sx={{
          display: "flex",
          flexDirection: "column",
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
          t={t}
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
                toggleSound={toggleSound}
                soundEnabled={hangmanSoundEnabled}
                t={t}
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
                t={t}
              />
            </Box>
          </Box>
        ) : (
          (gamePhase === "waiting" || (gamePhase === "ended" && !isGameEndModalVisible)) && (
            <GameControls
              isHost={isHost}
              gamePhase={gamePhase}
              onOpenHostSetup={handleOpenHostSetup}
              onEndGameByHost={handleEndGameByHost}
              t={t}
            />
          )
        )}

        {shouldShowWaitingOrEndedScreen && (
          <HangmanWaitingScreen
            isHost={isHost}
            members={members}
            lobbyInfo={lobbyInfo}
            user={user}
            sharedGameState={sharedGameState}
            onOpenHostSetup={handleOpenHostSetup}
            lobbyCreatorName={lobbyCreatorName}
            t={t}
          />
        )}

        {gamePhase === "ended" &&
          sharedGameState.gameEnded &&
          !isGameEndModalVisible &&
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
              {t("GameOverWaitHost")}
            </Alert>
          )}
      </GameContainer>

      <GameEndModalManager
        show={isGameEndModalVisible}
        sharedGameState={sharedGameState}
        onClose={handleCloseGameEndModal}
        t={t}
      />

      {gamePhase === "countdown" && countdown !== null && (
        <CountdownScreen countdown={countdown} t={t} />
      )}

      <NotificationArea
        notifications={notifications}
        onCloseNotification={handleCloseNotification}
      />
    </>
  );
};

export default Hangman;