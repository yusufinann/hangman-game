import { useEffect } from 'react';

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
}) => {
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "HANGMAN_ERROR":
          addNotification(`Hata: ${data.message}`, 'error');
          if (gamePhase === 'loading') setGamePhase('waiting');
          break;
        case "HANGMAN_INFO":
          addNotification(data.message, 'info');
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
            addNotification(`${data.player?.userName || 'Bir oyuncu'} katıldı.`);
          }
          if (data.type === "HANGMAN_GAME_STARTED") {
            addNotification(data.message || "Oyun başladı!", 'success');
            setGamePhase('playing');
            setCountdown(null);
            clearAllNotifications();
          }
          if (data.type === "HANGMAN_PLAYER_ELIMINATED") {
            addNotification(`${data.userName} elendi. Sebep: ${data.reason === 'no attempts left' ? 'Hakları bitti' : 'Yanlış kelime & hak bitti'}`, 'warning');
          }
          if (data.type === "HANGMAN_PLAYER_TIMEOUT") {
            addNotification(`${data.userName} süresi dolduğu için sırasını kaybetti.`, 'warning');
          }

          if (data.sharedGameState) {
            setSharedGameState(prev => ({ ...prev, ...data.sharedGameState }));
            if (data.sharedGameState.gameEnded) setGamePhase('ended');
            else if (data.sharedGameState.gameStarted) setGamePhase('playing');
            else if (gamePhase !== 'countdown' && gamePhase !== 'playing') setGamePhase('waiting');
          }
          if (data.playerSpecificGameState) {
            setMyPlayerSpecificState(prev => ({ ...prev, ...data.playerSpecificGameState }));
          }
          break;

        case "HANGMAN_CATEGORIES":
          setHostSetupData(prev => ({ ...prev, availableCategories: data.categories }));
          break;

        case "HANGMAN_COUNTDOWN":
          setGamePhase('countdown');
          setCountdown(data.countdown);
          break;

        case "HANGMAN_MY_GUESS_RESULT":
          if (data.playerSpecificGameState) {
            setMyPlayerSpecificState(prev => ({ ...prev, ...data.playerSpecificGameState }));
          }
          if (data.sharedMaskedWord) {
            setSharedGameState(prev => ({ ...prev, maskedWord: data.sharedMaskedWord }));
          }
          addNotification(data.correct ? "Doğru harf!" : "Yanlış harf.", data.correct ? 'success' : 'error', 2500);
          break;

        case "HANGMAN_WORD_GUESS_INCORRECT":
          if (data.playerSpecificGameState) {
            setMyPlayerSpecificState(prev => ({ ...prev, ...data.playerSpecificGameState }));
          }
          addNotification(data.message, 'error');
          break;

        case "HANGMAN_GAME_OVER_WINNER":
        case "HANGMAN_WORD_REVEALED_GAME_OVER":
        case "HANGMAN_GAME_OVER_NO_WINNERS":
        case "HANGMAN_GAME_OVER_HOST_ENDED":
          addNotification(data.message, 'info', 10000);
          setGamePhase('ended');
          if (data.sharedGameState) {
            setSharedGameState(prev => ({ ...prev, ...data.sharedGameState, gameEnded: true, gameStarted: false, word: data.word }));
          }
          setMyPlayerSpecificState(prev => ({ ...prev, isMyTurn: false }));
          break;

        case "HANGMAN_CATEGORY_ADDED":
          addNotification(data.message, 'success');
          if (data.newCategories) {
            setHostSetupData(prev => ({ ...prev, availableCategories: data.newCategories }));
          }
          break;
        
        case "HANGMAN_PLAYER_DISCONNECTED_UPDATE":
            if (data.sharedGameState) {
                setSharedGameState(prev => ({...prev, ...data.sharedGameState}));
            }
            const disconnectedMember = members.find(m => m.id === data.disconnectedUserId);
            addNotification(`${disconnectedMember?.username || 'Bir oyuncu'} bağlantısı kesildi.`, 'warning');
            break;
        default:
          break;
      }
    };

    socket.addEventListener('message', handleMessage);
    return () => socket.removeEventListener('message', handleMessage);
  }, [
    socket, 
    addNotification, 
    gamePhase, 
    setGamePhase, 
    setSharedGameState, 
    setMyPlayerSpecificState, 
    setHostSetupData, 
    setCountdown, 
    members,
    clearAllNotifications
  ]);

  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN && user?.id) {
      socket.send(JSON.stringify({ type: "HANGMAN_JOIN", lobbyCode }));
      if (isHost) {
        socket.send(JSON.stringify({ type: "HANGMAN_GET_CATEGORIES" }));
      }
      if (gamePhase === 'loading') { // Only set to waiting if it was loading
        setGamePhase('waiting');
      }
    } else if (!user?.id && gamePhase === 'loading') {
      addNotification("Kullanıcı bilgileri yüklenemedi, lütfen sayfayı yenileyin.", "error");
      setGamePhase('error');
    }
  }, [socket, lobbyCode, user?.id, isHost, addNotification, setGamePhase, gamePhase]);
};