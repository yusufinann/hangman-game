import { useState, useEffect, useMemo } from 'react';
import {
  Box, CircularProgress, Alert,
  Typography
} from '@mui/material';

import { useGameNotifications } from '../hooks/useGameNotifications';
import { useTurnTimer } from '../hooks/useTurnTimer';
import { useWebSocketHandler } from '../hooks/useWebSocketHandler';

import { GameContainer } from './components/StyledComponents';
import GameControls from './components/GameControls';
import HostSetupModal from './components/HostSetupModal';
import GamePlayArea from './components/GamePlayArea';
import PlayerList from './components/PlayerList';
import GameEndScreen from './components/GameEndScreen';
import CountdownScreen from './components/CountdownScreen';
import NotificationArea from './components/NotificationArea';


const Hangman = ({ lobbyCode, lobbyInfo, members, socket, user }) => {
  const [isHost, setIsHost] = useState(false);
  const [gamePhase, setGamePhase] = useState('loading');
  const [hostSetupData, setHostSetupData] = useState({
    category: '',
    availableCategories: [],
  });
  const [showHostSetupModal, setShowHostSetupModal] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const [sharedGameState, setSharedGameState] = useState({
    maskedWord: '',
    category: '',
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

  const [currentWordGuessInput, setCurrentWordGuessInput] = useState('');

  const { notifications, addNotification, setNotifications, clearAllNotifications } = useGameNotifications();

  useEffect(() => {
    if (user?.id && lobbyInfo?.createdBy) {
        setIsHost(user.id === lobbyInfo.createdBy);
    }
  }, [user?.id, lobbyInfo?.createdBy]);

  useWebSocketHandler({
    socket, lobbyCode, user, isHost, addNotification,
    setGamePhase, setCountdown, setSharedGameState, setMyPlayerSpecificState,
    setHostSetupData, gamePhase, members, clearAllNotifications
  });

  const turnTimeLeft = useTurnTimer(
    sharedGameState.turnEndsAt,
    sharedGameState.gameStarted,
    sharedGameState.gameEnded,
    sharedGameState.currentPlayerId,
    user?.id
  );

  const handleOpenHostSetup = () => {
    if (isHost && socket) {
      socket.send(JSON.stringify({ type: "HANGMAN_GET_CATEGORIES" }));
    }
    setShowHostSetupModal(true);
  };

  const handleHostSetupChange = (e) => {
    const { name, value } = e.target;
    setHostSetupData(prev => ({ ...prev, [name]: value }));
  };

  const handleStartGame = () => {
    if (!socket || !isHost) return;
    const { category } = hostSetupData;
    if (!category) {
      addNotification("Lütfen bir kategori seçin.", "error");
      return;
    }
    socket.send(JSON.stringify({
      type: "HANGMAN_START", lobbyCode, category
    }));
    setShowHostSetupModal(false);
  };

  const handleLetterGuess = (letter) => {
    if (!socket || !myPlayerSpecificState.isMyTurn || sharedGameState.gameEnded) return;
    const l = letter.toLowerCase();
    if (myPlayerSpecificState.correctGuesses.includes(l) || myPlayerSpecificState.incorrectGuesses.includes(l)) {
      addNotification("Bu harfi zaten denediniz.", "warning", 2000);
      return;
    }
    socket.send(JSON.stringify({ type: "HANGMAN_GUESS_LETTER", lobbyCode, letter: l }));
  };

  const handleWordSubmit = (e) => {
    e.preventDefault();
    if (!socket || !myPlayerSpecificState.isMyTurn || sharedGameState.gameEnded || !currentWordGuessInput.trim()) return;
    socket.send(JSON.stringify({ type: "HANGMAN_GUESS_WORD", lobbyCode, word: currentWordGuessInput.trim() }));
    setCurrentWordGuessInput('');
  };

  const handleEndGameByHost = () => {
    if (!socket || !isHost || gamePhase !== 'playing') return;
    socket.send(JSON.stringify({ type: "HANGMAN_END_GAME", lobbyCode }));
  };

  const myActualRemainingAttempts = useMemo(() => {
    const myPlayerData = sharedGameState.playerStates[user?.id];
    return myPlayerData ? myPlayerData.remainingAttempts : (myPlayerSpecificState.eliminated ? 0 : 6);
  }, [sharedGameState.playerStates, user?.id, myPlayerSpecificState.eliminated]);

  const amIReallyPlaying = useMemo(() => {
    if (!user?.id) return false;
    const myPlayerData = sharedGameState.playerStates[user.id];
    if (!sharedGameState.gameStarted || sharedGameState.gameEnded) return false;
    if (myPlayerSpecificState.won || myPlayerSpecificState.eliminated) return false;
    if (myPlayerData && (myPlayerData.won || myPlayerData.eliminated)) return false;
    return true;
  }, [sharedGameState, myPlayerSpecificState, user?.id]);

  const lobbyCreatorDetails = useMemo(() => members.find(m => m.id === lobbyInfo?.createdBy), [members, lobbyInfo?.createdBy]);
  const lobbyCreatorName = lobbyCreatorDetails?.name || lobbyCreatorDetails?.username || 'Bilinmiyor';

  const currentPlayerTurnName = useMemo(() => {
    if (!sharedGameState.currentPlayerId) return 'Bilinmeyen';
    const player = members.find(m => m.id === sharedGameState.currentPlayerId);
    if (player) return player.name || player.username;
    const playerState = sharedGameState.playerStates[sharedGameState.currentPlayerId];
    return playerState?.userName || 'Bilinmeyen';
  }, [members, sharedGameState.currentPlayerId, sharedGameState.playerStates]);


  if (gamePhase === 'loading' || !user?.id) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}><CircularProgress size={50} /><Typography variant="h6" sx={{ ml: 2 }}>Oyun yükleniyor...</Typography></Box>;
  }
  if (gamePhase === 'error') {
    return <Alert severity="error" sx={{ m: 3, p: 2 }}>Oyun yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</Alert>;
  }

  const handleCloseNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  return (
    <>
      <GameContainer sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '500px', 
        height: '100%', 
        width: '100%', 
        overflow: 'hidden'
      }}>
        {/* <LobbyInfoBar lobbyInfo={lobbyInfo} lobbyCode={lobbyCode} lobbyCreatorName={lobbyCreatorName} /> */}
              
        <HostSetupModal
          open={showHostSetupModal && isHost}
          onClose={() => setShowHostSetupModal(false)}
          hostSetupData={hostSetupData}
          onHostSetupChange={handleHostSetupChange}
          onStartGame={handleStartGame}
        />

        {gamePhase === 'playing' ? (
          <Box 
            sx={{ 
              display: 'flex',  
              flexGrow: 1,
              gap: 2,
              alignItems: 'stretch',
              overflow: 'auto',
              flexDirection: { xs: 'column', md: 'row' }, 
             
            }}
          >
            <Box sx={{ 
              flexGrow: 1, 
              minWidth: 0, 
              width: { xs: '100%', md: '70%' }
            }}>
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
            
            <Box sx={{ 
              width: { xs: '100%', md: '30%' },height:'100%'
            }}>
              <PlayerList 
                members={members} 
                sharedGameState={sharedGameState} 
                userId={user.id} 
              />
            </Box>
          </Box>
        ) : (
            <GameControls 
                    isHost={isHost} 
                    gamePhase={gamePhase}
                    onOpenHostSetup={handleOpenHostSetup}
                    onEndGameByHost={handleEndGameByHost}
                /> 
        )}

        {gamePhase === 'ended' && sharedGameState.rankings && sharedGameState.rankings.length > 0 && (
          <GameEndScreen 
            sharedGameState={sharedGameState}/>
        )}
        
        {gamePhase === 'waiting' && !isHost && !sharedGameState.gameStarted && (
          <Alert 
            severity="info" 
            variant="standard" 
            sx={{ mt: 4, p: 3, justifyContent: 'center', fontSize: '1.2rem' }}
          >
            Hostun oyunu başlatması bekleniyor... 
          </Alert>
        )}
        
        {gamePhase === 'ended' && (!sharedGameState.rankings || sharedGameState.rankings.length === 0) && !isHost && (
          <Alert 
            severity="info" 
            variant="standard" 
            sx={{ mt: 4, p: 3, justifyContent: 'center', fontSize: '1.2rem' }}
          >
            Oyun sona erdi. Yeni oyun için hostu bekleyin.
          </Alert>
        )}
      </GameContainer>

      {gamePhase === 'countdown' && countdown !== null && (
        <CountdownScreen countdown={countdown} />
      )}

      <NotificationArea notifications={notifications} onCloseNotification={handleCloseNotification} />
    </>
  );
};

export default Hangman;