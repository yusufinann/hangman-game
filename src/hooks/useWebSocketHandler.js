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
}) => {
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "HANGMAN_ERROR":
          addNotification(`Hata: ${data.message}`, "error");
          if (gamePhase === "loading") setGamePhase("waiting");
          break;
        case "HANGMAN_INFO":
          addNotification(data.message, "info");
          break;

        case "HANGMAN_COUNTDOWN":
          setGamePhase("countdown");
          setCountdown(data.countdown);
          playSoundCallback && playSoundCallback('countdown');
          break;

        case "HANGMAN_RECONNECTED":
        case "HANGMAN_JOINED_SUCCESS":
        case "HANGMAN_PLAYER_JOINED":
        case "HANGMAN_GAME_STARTED":
        case "HANGMAN_TURN_CHANGE":
        case "HANGMAN_GUESS_MADE":
        case "HANGMAN_WORD_GUESS_ATTEMPT":
        case "HANGMAN_PLAYER_ELIMINATED":
        case "HANGMAN_PLAYER_TIMEOUT":
        case "HANGMAN_CURRENT_GAME_STATE":
          if (data.type === "HANGMAN_PLAYER_JOINED") {
            addNotification(
              `${data.player?.userName || "Bir oyuncu"} katıldı.`
            );
          }
          if (data.type === "HANGMAN_GAME_STARTED") {
            addNotification(data.message || "Oyun başladı!", "success");
            setGamePhase("playing");
            setCountdown(null);
            clearAllNotifications();
            playSoundCallback && playSoundCallback('gameStart');
          }
          if (data.type === "HANGMAN_PLAYER_ELIMINATED") {
            addNotification(
              `${data.userName} elendi. Sebep: ${
                data.reason === "no attempts left"
                  ? "Hakları bitti"
                  : "Yanlış kelime & hak bitti"
              }`,
              "warning"
            );
            playSoundCallback && playSoundCallback('playerEliminated');
          }
          if (data.type === "HANGMAN_PLAYER_TIMEOUT") {
            addNotification(
              `${data.userName} süresi dolduğu için sırasını kaybetti.`,
              "warning"
            );
            playSoundCallback && playSoundCallback('playerTimeout');
          }
          if (data.type === "HANGMAN_TURN_CHANGE") {
            if (data.sharedGameState?.currentPlayerId === user?.id) {
              playSoundCallback && playSoundCallback('turnChange');
            }
          }

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
          break;

        case "HANGMAN_GAME_OVER_WINNER":
          playSoundCallback && playSoundCallback('gameOverWin');
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
          }
          setMyPlayerSpecificState((prev) => ({ ...prev, isMyTurn: false }));
          break;

        case "HANGMAN_WORD_REVEALED_GAME_OVER":
        case "HANGMAN_GAME_OVER_NO_WINNERS":
        case "HANGMAN_GAME_OVER_HOST_ENDED":
          playSoundCallback && playSoundCallback('gameOverLose');
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

        case "HANGMAN_PLAYER_LEFT_LOBBY":
        case "HANGMAN_PLAYER_DISCONNECTED_UPDATE":
          if (data.sharedGameState) {
            setSharedGameState((prev) => ({
              ...prev,
              ...data.sharedGameState,
            }));
          }
          if (user && data.disconnectedUserId !== user.id) {
            addNotification(
              data.message ||
                `${data.userName || "Bir oyuncu"} ayrıldı/bağlantısı kesildi.`,
              "warning"
            );
          } else if (
            user &&
            data.disconnectedUserId === user.id &&
            data.type === "HANGMAN_PLAYER_DISCONNECTED_UPDATE"
          ) {
            addNotification(
              "Bağlantınız kesildi, yeniden bağlanmaya çalışılıyor...",
              "error"
            );
          }
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
  ]);

  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN && user?.id) {
      socket.send(JSON.stringify({ type: "HANGMAN_JOIN", lobbyCode }));
      if (isHost) {
        socket.send(JSON.stringify({ type: "HANGMAN_GET_CATEGORIES" }));
      }
      if (gamePhase === "loading") {
        setGamePhase("waiting");
      }
    } else if (!user?.id && gamePhase === "loading") {
      addNotification(
        "Kullanıcı bilgileri yüklenemedi, lütfen sayfayı yenileyin.",
        "error"
      );
      setGamePhase("error");
    }
  }, [
    socket,
    lobbyCode,
    user?.id,
    isHost,
    addNotification,
    setGamePhase,
    gamePhase,
  ]);
};