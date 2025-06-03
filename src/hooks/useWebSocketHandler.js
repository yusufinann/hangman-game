import { useEffect, useRef } from "react";

export const useWebSocketHandler = ({
  socket, 
  isConnected,
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
  playSoundCallback,
  t,
}) => {
  const initialRequestsSentForLobbyRef = useRef(false);
  const prevLobbyCodeRef = useRef(lobbyCode);

  useEffect(() => {
    if (lobbyCode !== prevLobbyCodeRef.current) {
      initialRequestsSentForLobbyRef.current = false;
      prevLobbyCodeRef.current = lobbyCode;
    }

    if (
      socket &&
      isConnected &&
      user?.id &&
      lobbyCode &&
      !initialRequestsSentForLobbyRef.current
    ) {
      console.log(
        `[WS_HANDLER ${lobbyCode}] Bağlantı aktif. Başlangıç istekleri gönderiliyor.`
      );
      socket.send(JSON.stringify({ type: "HANGMAN_JOIN", lobbyCode }));
      socket.send(JSON.stringify({ type: "HANGMAN_GET_CATEGORIES" }));
      initialRequestsSentForLobbyRef.current = true;
    } else if (!isConnected && initialRequestsSentForLobbyRef.current) {
      initialRequestsSentForLobbyRef.current = false;
    } else if (socket && isConnected && !user?.id && gamePhase === "loading") {
      addNotification(
        t(
          "errors.userDataLoadFailed",
          "User data could not be loaded, please refresh the page."
        ),
        "error"
      );
      setGamePhase("error");
    }
  }, [
    socket,
    isConnected,
    lobbyCode,
    user?.id,
    gamePhase,
    addNotification,
    setGamePhase,
    t,
  ]);

  useEffect(() => {
    if (!socket || !isConnected) {
      return;
    }

    const handleMessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", event.data, error);
        return;
      }

      const messageOriginLobbyCode =
        data.lobbyCode || data.sharedGameState?.lobbyCode;

      if (
        !(data.type === "HANGMAN_ERROR" && data.activeGameInfo) &&
        messageOriginLobbyCode &&
        messageOriginLobbyCode !== lobbyCode
      ) {
        return;
      }

      if (
        data.type === "HANGMAN_ERROR" &&
        data.activeGameInfo &&
        data.activeGameInfo.lobbyCode !== lobbyCode
      ) {
        addNotification(
          t(
            "errors.activeGameInOtherLobby",
            `You have an active game in another lobby (${data.activeGameInfo.lobbyCode}). Please leave or finish that game first.`,
            { lobbyCode: data.activeGameInfo.lobbyCode }
          ),
          "error",
          10000
        );
        if (gamePhase === "loading") setGamePhase("error");
        return;
      }

      const updateGameStates = (isGameOver = false) => {
        if (data.sharedGameState) {
          setSharedGameState((prev) => ({ ...prev, ...data.sharedGameState }));
          if (isGameOver || data.sharedGameState.gameEnded) {
            setGamePhase("ended");
          } else if (data.sharedGameState.gameStarted) {
            setGamePhase("playing");
          } else if (
            gamePhase !== "countdown" &&
            gamePhase !== "playing" &&
            gamePhase !== "ended"
          ) {
            setGamePhase("waiting");
          }
        }
        if (data.playerSpecificGameState) {
          setMyPlayerSpecificState((prev) => ({
            ...prev,
            ...data.playerSpecificGameState,
          }));
        }
      };

      switch (data.type) {
        case "HANGMAN_ERROR":
          addNotification(
            t("errors.generalError", `Error: ${data.message}`, {
              message: data.message,
            }),
            "error"
          );
          if (gamePhase === "loading") {
            setGamePhase(
              data.sharedGameState || data.activeGameInfo ? "waiting" : "error"
            );
          }
          break;
        case "HANGMAN_INFO":
          addNotification(data.message, "info");
          break;
        case "HANGMAN_COUNTDOWN":
          setGamePhase("countdown");
          setCountdown(data.countdown);
          if (playSoundCallback) playSoundCallback("countdown");
          break;
        case "HANGMAN_PLAYER_JOINED":
          {
            const playerName =
              data.player?.userName || t("notifications.a_player", "A player");
            addNotification(
              t(
                "notifications.playerJoined",
                `${playerName} joined the game.`,
                { playerName }
              )
            );
          }
          updateGameStates();
          break;
        case "HANGMAN_GAME_STARTED":
          addNotification(
            data.message || t("notifications.gameStarted", "Game started!"),
            "success"
          );
          setGamePhase("playing");
          setCountdown(null);
          if (clearAllNotifications) clearAllNotifications();
          if (playSoundCallback) playSoundCallback("gameStart");
          updateGameStates();
          break;
        case "HANGMAN_PLAYER_ELIMINATED":
          addNotification(
            t(
              "notifications.playerEliminated",
              `${data.userName} was eliminated. Reason: ${
                data.reason === "no attempts left"
                  ? t("notifications.reasonNoAttempts", "No attempts left")
                  : t(
                      "notifications.reasonWrongWordAttempts",
                      "Incorrect word & no attempts left"
                    )
              }`,
              {
                userName: data.userName,
                reason:
                  data.reason === "no attempts left"
                    ? t("notifications.reasonNoAttempts", "No attempts left")
                    : t(
                        "notifications.reasonWrongWordAttempts",
                        "Incorrect word & no attempts left"
                      ),
              }
            ),
            "warning"
          );
          if (playSoundCallback) playSoundCallback("playerEliminated");
          updateGameStates();
          break;
        case "HANGMAN_PLAYER_TIMEOUT":
          addNotification(
            t(
              "notifications.playerTimeout",
              `${data.userName}'s turn timed out.`,
              { userName: data.userName }
            ),
            "warning"
          );
          if (playSoundCallback) playSoundCallback("playerTimeout");
          updateGameStates();
          break;
        case "HANGMAN_TURN_CHANGE":
          if (data.sharedGameState?.currentPlayerId === user?.id) {
            if (playSoundCallback) playSoundCallback("turnChange");
          }
          updateGameStates();
          break;
        case "HANGMAN_RECONNECTED":
        case "HANGMAN_JOINED_SUCCESS":
        case "HANGMAN_CURRENT_GAME_STATE": // Bu mesaj türünü de ekledim, sunucu bunu gönderebilir
          addNotification(
            data.message ||
              t("notifications.connectedToGame", "Connected to game."),
            "success"
          );
          updateGameStates();
          break;
        case "HANGMAN_GUESS_MADE":
        case "HANGMAN_WORD_GUESS_ATTEMPT":
          updateGameStates();
          break;
        case "HANGMAN_CATEGORIES":
          setHostSetupData((prev) => ({
            ...prev,
            availableLanguages: data.categories,
          }));
          break;
        case "HANGMAN_LANGUAGE_CATEGORIES":
          setHostSetupData((prev) => ({
            ...prev,
            availableCategories: data.categories,
            category: prev.languageMode === data.language ? prev.category : "",
          }));
          break;
        case "HANGMAN_MY_GUESS_RESULT":
          if (data.playerSpecificGameState) {
            setMyPlayerSpecificState((prev) => ({
              ...prev,
              ...data.playerSpecificGameState,
            }));
          }
          if (data.sharedMaskedWord) {
            setSharedGameState((prev) => ({
              ...prev,
              maskedWord: data.sharedMaskedWord,
            }));
          }
          addNotification(
            data.correct
              ? t("notifications.correctLetter", "Correct letter!")
              : t("notifications.incorrectLetter", "Incorrect letter!"),
            data.correct ? "success" : "error",
            2500
          );
          if (playSoundCallback)
            playSoundCallback(data.correct ? "guessCorrect" : "guessIncorrect");
          break;
        case "HANGMAN_WORD_GUESS_INCORRECT":
          if (data.playerSpecificGameState) {
            setMyPlayerSpecificState((prev) => ({
              ...prev,
              ...data.playerSpecificGameState,
            }));
          }
          addNotification(
            data.message ||
              t("notifications.incorrectWord", "Incorrect word guess."),
            "error"
          );
          if (data.sharedGameState) updateGameStates();
          break;
        case "HANGMAN_GAME_OVER_WINNER":
        case "HANGMAN_WORD_REVEALED_GAME_OVER":
        case "HANGMAN_GAME_OVER_NO_WINNERS":
        case "HANGMAN_GAME_OVER_HOST_ENDED":
          if (playSoundCallback)
            playSoundCallback(
              data.type === "HANGMAN_GAME_OVER_WINNER" ||
                data.type === "HANGMAN_WORD_REVEALED_GAME_OVER"
                ? "gameOverWin"
                : "gameOverLose"
            );
          addNotification(data.message, "info", 10000);
          updateGameStates(true);
          if (data.word) {
            setSharedGameState((prev) => ({ ...prev, word: data.word }));
          }
          setMyPlayerSpecificState((prev) => ({ ...prev, isMyTurn: false }));
          break;
        case "HANGMAN_CATEGORY_ADDED":
          addNotification(data.message, "success");
          if (
            data.newCategories &&
            hostSetupData &&
            data.language === hostSetupData.languageMode
          ) {
            setHostSetupData((prev) => ({
              ...prev,
              availableCategories: data.newCategories,
            }));
          }
          break;
        case "HANGMAN_PLAYER_LEFT_PREGAME":
        case "HANGMAN_PLAYER_LEFT_MIDGAME":
          if (user && data.playerId && data.playerId !== user.id) {
            addNotification(
              t(
                "notifications.playerLeftOrDisconnected",
                `${
                  data.playerName ||
                  data.userName ||
                  t("notifications.a_player", "A player")
                } left or disconnected.`,
                {
                  playerName:
                    data.playerName ||
                    data.userName ||
                    t("notifications.a_player", "A player"),
                }
              ),
              "warning"
            );
          }
          updateGameStates();
          break;
        default:
          break;
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [
    socket,
    isConnected,
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
    playSoundCallback,
    t,
  ]);
};
