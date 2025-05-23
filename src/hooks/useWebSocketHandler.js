import { useEffect } from "react";

export const useWebSocketHandler = ({
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
  playSoundCallback,
  t,
  setActiveGameBlockError,
}) => {
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event) => {
      const data = JSON.parse(event.data);
      const messageOriginLobbyCode = data.lobbyCode || data.sharedGameState?.lobbyCode;

      if (data.type === "HANGMAN_ERROR" && data.activeGameInfo) {
        addNotification(`Hata: ${data.message}`, "error");
        setActiveGameBlockError(data.message);
        if (gamePhase === "loading") setGamePhase("waiting");
      } else if (messageOriginLobbyCode && messageOriginLobbyCode !== lobbyCode) {
        console.warn(
          `[WS Handler] Mesaj (${data.type}) lobi ${messageOriginLobbyCode} için geldi, ancak şu an lobi ${lobbyCode} görüntüleniyor. Mesaj yoksayıldı.`
        );
        return;
      }

      const updateGameStates = () => {
        if (data.sharedGameState) {
          setSharedGameState((prev) => ({
            ...prev,
            ...data.sharedGameState,
          }));
          if (data.sharedGameState.gameEnded) setGamePhase("ended");
          else if (data.sharedGameState.gameStarted) setGamePhase("playing");
          else if (
            gamePhase !== "countdown" &&
            gamePhase !== "playing" &&
            gamePhase !== "ended"
          )
            setGamePhase("waiting");
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
          if (!data.activeGameInfo) {
            addNotification(`Hata: ${data.message}`, "error");
            setActiveGameBlockError(null);
          }
          if (gamePhase === "loading" && !(data.activeGameInfo && data.activeGameInfo.lobbyCode !== lobbyCode)) {
            setGamePhase("waiting");
          }
          break;

        case "HANGMAN_INFO":
          addNotification(data.message, "info");
          break;

        case "HANGMAN_COUNTDOWN":
          setGamePhase("countdown");
          setCountdown(data.countdown);
          playSoundCallback && playSoundCallback('countdown');
          break;

        case "HANGMAN_PLAYER_JOINED":
          {
            const playerName = data.player?.userName || t('notifications.a_player', 'Bir oyuncu');
            addNotification(
              t('notifications.playerJoined', { playerName: playerName })
            );
          }
          updateGameStates();
          break;

        case "HANGMAN_GAME_STARTED":
          addNotification(data.message || "Oyun başladı!", "success");
          setGamePhase("playing");
          setCountdown(null);
          clearAllNotifications();
          playSoundCallback && playSoundCallback('gameStart');
          updateGameStates();
          break;

        case "HANGMAN_PLAYER_ELIMINATED":
          addNotification(
            `${data.userName} elendi. Sebep: ${
              data.reason === "no attempts left"
                ? "Hakları bitti"
                : "Yanlış kelime & hak bitti"
            }`,
            "warning"
          );
          playSoundCallback && playSoundCallback('playerEliminated');
          updateGameStates();
          break;

        case "HANGMAN_PLAYER_TIMEOUT":
          addNotification(
            `${data.userName} süresi dolduğu için sırasını kaybetti.`,
            "warning"
          );
          playSoundCallback && playSoundCallback('playerTimeout');
          updateGameStates();
          break;

        case "HANGMAN_TURN_CHANGE":
          if (data.sharedGameState?.currentPlayerId === user?.id) {
            playSoundCallback && playSoundCallback('turnChange');
          }
          updateGameStates();
          break;

        case "HANGMAN_RECONNECTED":
        case "HANGMAN_JOINED_SUCCESS":
          setActiveGameBlockError(null);
          updateGameStates();
          break;

        case "HANGMAN_GUESS_MADE":
        case "HANGMAN_WORD_GUESS_ATTEMPT":
        case "HANGMAN_CURRENT_GAME_STATE":
          updateGameStates();
          break;

        case "HANGMAN_CATEGORIES":
          setHostSetupData((prev) => ({
            ...prev,
            availableCategories: data.categories,
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
            data.correct ? "Doğru harf!" : "Yanlış harf.",
            data.correct ? "success" : "error",
            2500
          );
          playSoundCallback && playSoundCallback(data.correct ? 'guessCorrect' : 'guessIncorrect');
          break;

        case "HANGMAN_WORD_GUESS_INCORRECT":
          if (data.playerSpecificGameState) {
            setMyPlayerSpecificState((prev) => ({
              ...prev,
              ...data.playerSpecificGameState,
            }));
          }
          addNotification(data.message, "error");
          updateGameStates();
          break;

        case "HANGMAN_GAME_OVER_WINNER":
        case "HANGMAN_WORD_REVEALED_GAME_OVER":
        case "HANGMAN_GAME_OVER_NO_WINNERS":
        case "HANGMAN_GAME_OVER_HOST_ENDED":
          playSoundCallback && playSoundCallback(
            data.type === "HANGMAN_GAME_OVER_WINNER" || data.type === "HANGMAN_WORD_REVEALED_GAME_OVER"
              ? 'gameOverWin'
              : 'gameOverLose'
          );
          addNotification(data.message, "info", 10000);
          setGamePhase("ended");
          if (data.sharedGameState) {
            setSharedGameState((prev) => ({
              ...prev,
              ...data.sharedGameState,
              gameEnded: true,
              gameStarted: false,
              word: data.word,
            }));
          } else {
            updateGameStates();
          }
          setMyPlayerSpecificState((prev) => ({ ...prev, isMyTurn: false }));
          break;

        case "HANGMAN_CATEGORY_ADDED":
          addNotification(data.message, "success");
          if (data.newCategories) {
            setHostSetupData((prev) => ({
              ...prev,
              availableCategories: data.newCategories,
            }));
          }
          break;
        
        case "HANGMAN_PLAYER_LEFT_PREGAME":
        case "HANGMAN_PLAYER_LEFT_MIDGAME":
        case "HANGMAN_PLAYER_LEFT_LOBBY":
        case "HANGMAN_PLAYER_DISCONNECTED_UPDATE":
          if (user && data.playerId && data.playerId !== user.id) {
            addNotification(
              data.message ||
                `${data.playerName || data.userName || t('notifications.a_player', 'Bir oyuncu')} ayrıldı/bağlantısı kesildi.`,
              "warning"
            );
          } else if (
            user &&
            (data.playerId === user.id || data.disconnectedUserId === user.id) &&
            (data.type === "HANGMAN_PLAYER_DISCONNECTED_UPDATE" || data.type === "HANGMAN_PLAYER_LEFT_PREGAME" || data.type === "HANGMAN_PLAYER_LEFT_MIDGAME")
          ) {
          
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
    playSoundCallback,
    t,
    setActiveGameBlockError,
  ]);

  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN && user?.id) {
      socket.send(JSON.stringify({ type: "HANGMAN_JOIN", lobbyCode }));
      if (isHost) {
        socket.send(JSON.stringify({ type: "HANGMAN_GET_CATEGORIES" }));
      }
    } else if (socket && socket.readyState === WebSocket.OPEN && !user?.id && gamePhase === "loading") {
      addNotification(
        t('errors.userDataLoadFailed', "Kullanıcı bilgileri yüklenemedi, lütfen sayfayı yenileyin."),
        "error"
      );
      setGamePhase("error");
      setActiveGameBlockError(t('errors.userDataLoadFailed', "Kullanıcı bilgileri yüklenemedi, lütfen sayfayı yenileyin."));
    }
  }, [
    socket,
    lobbyCode,
    user?.id,
    isHost,
    addNotification,
    setGamePhase,
    gamePhase,
    t,
    setActiveGameBlockError,
  ]);
};