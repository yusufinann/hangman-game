import { useState, useEffect, useMemo, useRef } from "react";
import {
  Alert,
  Box,
} from "@mui/material";
import { useGameNotifications } from "../hooks/useGameNotifications";
import { useTurnTimer } from "../hooks/useTurnTimer";
import { useWebSocketHandler } from "../hooks/useWebSocketHandler"; // Ensure this path is correct
import { GameContainer } from "./components/StyledComponents";
import GameControls from "./components/GameControls";
import HostSetupModal from "./components/HostSetupModal";
import GamePlayArea from "./components/GamePlayArea/GamePlayArea";
import PlayerList from "./components/PlayerList";
import CountdownScreen from "./components/CountdownScreen";
import NotificationArea from "./components/NotificationArea";
import useHangmanSound from "../hooks/useHangmanSound";
import HangmanLoading from "./components/HangmanLoading";
import HangmanError from "./components/HangmanError";
import HangmanWaitingScreen from "./components/HangmanWaitingScreen";
import GameEndModalManager from "./components/GameEndModalManager/GameEndModalManager";

const Hangman = ({ lobbyCode, lobbyInfo, members, socket, user, hangmanSoundEnabled, toggleSound, t}) => {
  const [isHost, setIsHost] = useState(false);
  const [gamePhase, setGamePhase] = useState("loading"); // loading, waiting, countdown, playing, ended, error
  const [hostSetupData, setHostSetupData] = useState({
    languageMode: "en", // Default or load from previous settings if desired
    availableLanguages: [],
    wordSourceMode: "server", // 'server' or 'host'
    category: "",
    availableCategories: [],
    customWord: "",
    customCategory: "",
  });
  const { playSound } = useHangmanSound(hangmanSoundEnabled);
  const [showHostSetupModal, setShowHostSetupModal] = useState(false);
  const [isStartingGame, setIsStartingGame] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const [sharedGameState, setSharedGameState] = useState({
    lobbyCode: lobbyCode,
    lobbyName: lobbyInfo?.name || "",
    maskedWord: "",
    category: "",
    languageMode: 'en',
    wordSourceMode: 'server',
    isHostParticipant: true,
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
    isHost: false,
    isParticipating: true,
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
    addNotification,
    setGamePhase,
    setCountdown,
    setSharedGameState,
    setMyPlayerSpecificState,
    hostSetupData, 
    setHostSetupData,
    gamePhase,
    clearAllNotifications,
    playSoundCallback: playSound,
    t,
  });

  const turnTimeLeft = useTurnTimer(
    sharedGameState.turnEndsAt,
    sharedGameState.gameStarted,
    sharedGameState.gameEnded,
    sharedGameState.currentPlayerId,
    user?.id
  );

  const currentUserIsParticipating = useMemo(() => {
    if (!user?.id || !sharedGameState.playerStates[user.id]) return false;
    return sharedGameState.playerStates[user.id].isParticipating;
  }, [sharedGameState.playerStates, user?.id]);


  const currentUserIsInRankings = useMemo(() => {
    if (!user?.id || !sharedGameState.rankings || !currentUserIsParticipating) {
      return false;
    }
    return sharedGameState.rankings.some(
      (player) => player.playerId === user.id
    );
  }, [sharedGameState.rankings, user?.id, currentUserIsParticipating]);


  const myActualRemainingAttempts = useMemo(() => {
    return myPlayerSpecificState.remainingAttempts;
  }, [myPlayerSpecificState.remainingAttempts]);

  const amIReallyPlaying = useMemo(() => {
    return myPlayerSpecificState.isParticipating &&
           !myPlayerSpecificState.won &&
           !myPlayerSpecificState.eliminated &&
           sharedGameState.gameStarted &&
           !sharedGameState.gameEnded;
  }, [myPlayerSpecificState, sharedGameState.gameStarted, sharedGameState.gameEnded]);


  const lobbyCreatorDetails = useMemo(
    () => members.find((m) => m.id === lobbyInfo?.createdBy),
    [members, lobbyInfo?.createdBy]
  );

  const currentPlayerTurnName = useMemo(() => {
    if (!sharedGameState.currentPlayerId) return t('hangman.unknownPlayer', "Unknown");
    const playerInState = sharedGameState.playerStates[sharedGameState.currentPlayerId];
    return playerInState?.name || playerInState?.userName || t('hangman.unknownPlayer', "Unknown");
  }, [sharedGameState.currentPlayerId, sharedGameState.playerStates, t]);

  const lobbyCreatorName =
    lobbyCreatorDetails?.name || lobbyCreatorDetails?.username || t("hangman.unknownHost", "Unknown Host");

  useEffect(() => {
    if (user?.id && lobbyInfo?.createdBy) {
      const isUserHost = user.id === lobbyInfo.createdBy;
      setIsHost(isUserHost);
      setMyPlayerSpecificState(prev => ({ ...prev, isHost: isUserHost }));
    }
  }, [user?.id, lobbyInfo?.createdBy]);

  useEffect(() => {
    // Fetch initial languages if host and modal is about to be shown or game not started
    if (socket && socket.readyState === WebSocket.OPEN && isHost && hostSetupData.availableLanguages.length === 0 && (showHostSetupModal || (gamePhase !== "playing" && gamePhase !== "countdown"))) {
        socket.send(JSON.stringify({ type: "HANGMAN_GET_CATEGORIES" }));
    }
  }, [socket, isHost, showHostSetupModal, gamePhase, hostSetupData.availableLanguages.length]);


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

  const handleCloseNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  if (gamePhase === "loading" || !user?.id || (gamePhase !== "error" && !sharedGameState.hostId && (sharedGameState.gameStarted || sharedGameState.gameEnded))) {
    return (
      <>
        <HangmanLoading t={t} />
        <NotificationArea
          notifications={notifications}
          onCloseNotification={handleCloseNotification}
        />
      </>
    );
  }

  if (gamePhase === "error") {
    const lastError = notifications.slice().reverse().find(n => n.type === 'error');
    return (
      <>
        <HangmanError t={t} message={lastError?.message || t('errors.genericGameError', "An error occurred. Please refresh the page.")} />
        <NotificationArea
          notifications={notifications}
          onCloseNotification={handleCloseNotification}
        />
      </>
    );
  }

  const handleOpenHostSetup = () => {
    if (isHost && socket && socket.readyState === WebSocket.OPEN) {
      if (hostSetupData.availableLanguages.length === 0) {
        socket.send(JSON.stringify({ type: "HANGMAN_GET_CATEGORIES" }));
      } else if (hostSetupData.languageMode && hostSetupData.availableCategories.length === 0) {
        socket.send(JSON.stringify({ type: "HANGMAN_GET_LANGUAGE_CATEGORIES", language: hostSetupData.languageMode }));
      }
    }
    setShowHostSetupModal(true);
  };

  const handleHostSetupChange = (e, isLanguageChange = false) => {
    const { name, value } = e.target;
    setHostSetupData((prev) => {
        const newState = { ...prev, [name]: value };
        if (isLanguageChange) {
            newState.category = ""; // Reset category if language changes
            newState.availableCategories = []; // Reset categories, will be fetched
        }
        return newState;
    });
  };

  const handleStartGame = () => {
    if (!socket || !isHost || isStartingGame) return;

    const { languageMode, wordSourceMode, category, customWord,customCategory  } = hostSetupData;

    if (!languageMode) {
      addNotification(t("hangman.selectLanguageError", "Please select a language."), "error");
      return;
    }
    if (!wordSourceMode) {
      addNotification(t("hangman.selectWordSourceError", "Please select a word source."), "error");
      return;
    }

    let payload = {
        type: "HANGMAN_START",
        lobbyCode,
        languageMode,
        wordSourceMode,
    };

    if (wordSourceMode === 'server') {
        if (!category) {
            addNotification(t("hangman.selectCategoryError", "Please select a category."), "error");
            setIsStartingGame(false); 
            return;
        }
        payload.category = category;
    } else if (wordSourceMode === 'host') {
        const trimmedCustomWord = customWord.trim();
        if (trimmedCustomWord.length < 2 || trimmedCustomWord.length > 25) {
             addNotification(t("hangman.customWordLengthError", "Custom word must be between 2 and 25 characters."), "error");
             setIsStartingGame(false);
            return;
        }
        payload.customWord = trimmedCustomWord;
        // customCategory backend'e gönderiliyor
        if (customCategory && customCategory.trim()) {
            payload.customCategory = customCategory.trim();
        }
    }
    setIsStartingGame(true);
    socket.send(JSON.stringify(payload));
    setShowHostSetupModal(false);
    // Server will send countdown, no need to set gamePhase here immediately
    // Reset isStartingGame after a short delay or on game_started/error message
    setTimeout(() => setIsStartingGame(false), 3000); // Basic timeout
  };

  const handleLetterGuess = (letter) => {
    if (!socket || !myPlayerSpecificState.isMyTurn || !amIReallyPlaying) return;

    const l = letter.toLowerCase(); // Backend expects lowercase
    if (
      myPlayerSpecificState.correctGuesses.includes(l) ||
      myPlayerSpecificState.incorrectGuesses.includes(l)
    ) {
      addNotification(t("hangman.alreadyGuessedLetterWarn", "You've already tried this letter."), "warning", 2000);
      return;
    }
    socket.send(
      JSON.stringify({ type: "HANGMAN_GUESS_LETTER", lobbyCode, letter: l })
    );
  };

  const handleWordSubmit = (e) => {
    e.preventDefault();
    if (!socket || !myPlayerSpecificState.isMyTurn || !currentWordGuessInput.trim() || !amIReallyPlaying) return;

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
          isStarting={isStartingGame}
          socket={socket} // Pass socket to modal
          t={t}
        />

        {gamePhase === "playing" ? (
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              gap: 1,
              alignItems: "stretch",
              overflow: "auto",
              flexDirection: { xs: "column", md: "row" },
              p: { xs: 1, sm: 2 }
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
                minHeight: {xs: '250px', md: 'auto'},
                maxHeight: { xs: '300px', md: '100%' }, 
                overflowY: 'auto', 
              }}
            >
              <PlayerList
                sharedGameState={sharedGameState}
                userId={user?.id}
                t={t}
                members={members}
              />
            </Box>
          </Box>
        ) : (
          (gamePhase === "waiting" || gamePhase === "ended") && (
             <>
                <GameControls
                  isHost={isHost}
                  gamePhase={gamePhase}
                  onOpenHostSetup={handleOpenHostSetup}
                  onEndGameByHost={handleEndGameByHost}
                  t={t}
                  gameStarted={sharedGameState.gameStarted}
                  gameEnded={sharedGameState.gameEnded}
                />
                <HangmanWaitingScreen
                    isHost={isHost}
                    lobbyInfo={lobbyInfo}
                    user={user}
                    sharedGameState={sharedGameState}
                    lobbyCreatorName={lobbyCreatorName}
                    t={t}
                />
             </>
          )
        )}

        {gamePhase === "ended" &&
          sharedGameState.gameEnded &&
          !isGameEndModalVisible &&
          (!sharedGameState.rankings || sharedGameState.rankings.length === 0 || !currentUserIsInRankings) &&
           (sharedGameState.wordSourceMode === 'server' || (sharedGameState.wordSourceMode === 'host' && !isHost)) && // Show only if participant or server mode
            (
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
                textAlign: "center"
              }}
            >
              {t("hangman.gameOverWaitHost", "Game Over. Wait for the host to start a new game.")}
            </Alert>
          )}
      </GameContainer>

      <GameEndModalManager
        show={isGameEndModalVisible}
        sharedGameState={sharedGameState}
        onClose={handleCloseGameEndModal}
        t={t}
        user={user}
        members={members}
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