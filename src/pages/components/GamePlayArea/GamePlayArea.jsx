import React from 'react';
import { Box, Typography, Paper, TextField, Chip, Button, Alert } from '@mui/material';
import HangmanDrawing from './HangmanDrawing';
import AlphabetGrid from './AlphabetGrid';
import { TimerBar } from '../StyledComponents';
import GameControls from '../GameControls';
import VolumeButton from './VolumeButton';

const GamePlayArea = ({
  sharedGameState,
  myPlayerSpecificState,
  myActualRemainingAttempts,
  amIReallyPlaying,
  turnTimeLeft,
  currentPlayerTurnName,
  onLetterGuess,
  onWordSubmit,
  currentWordGuessInput,
  setCurrentWordGuessInput,
  isHost,
  gamePhase,
  onOpenHostSetup,
  onEndGameByHost,
  toggleSound,
  soundEnabled,
  t 
}) => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      gap: 1,
      overflow: 'auto',
      height:'100%'
    }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 1, sm: 2 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          overflow: 'visible'
        }}
      >
        <Box>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            mb: 2
          }}>
            <Box sx={{ flex: '1', minWidth: '160px', textAlign: 'left' }}>
              <Typography variant="h6" gutterBottom sx={{ m: 0 }}>
                {t("gameplay.categoryLabel")}: <Chip
                  label={sharedGameState.category?.toUpperCase() || t("gameplay.categoryUndefined")}
                  color="info"
                  variant="filled"
                  size="small"
                  sx={{ fontSize: '0.8rem' }}
                />
              </Typography>

              {sharedGameState.currentPlayerId && (
                <Typography variant="body2" sx={{ fontWeight: 'bold', my: 0.5 }}>
                  {t("gameplay.turnLabel")}: <Chip
                    label={myPlayerSpecificState.isMyTurn ? t("gameplay.yourTurn", { seconds: turnTimeLeft }) : `${currentPlayerTurnName}`}
                    color={myPlayerSpecificState.isMyTurn ? "success" : "default"}
                    variant={myPlayerSpecificState.isMyTurn ? "filled" : "outlined"}
                    size="small"
                    sx={{ fontSize: '0.8rem', py: 0.5 }}
                  />
                </Typography>
              )}
            </Box>

            <Box sx={{
              flex: '0 0 auto',
              display: 'flex',
              justifyContent: 'flex-end',
              gap:5,
              minWidth: { xs: '100%', sm: 'auto' }
            }}>
              <Box>
              <GameControls
                isHost={isHost}
                gamePhase={gamePhase}
                onOpenHostSetup={onOpenHostSetup}
                onEndGameByHost={onEndGameByHost}
                t={t} 
              />
              </Box>
              <Box>
 <VolumeButton toggleSound={toggleSound} soundEnabled={soundEnabled} t={t} />
              </Box>
            </Box>
          </Box>

          {sharedGameState.currentPlayerId && myPlayerSpecificState.isMyTurn && (
            <TimerBar percentage={(turnTimeLeft / 10) * 100} />
          )}
        </Box>

        <Typography
          variant="h2"
          letterSpacing={{ xs: 1, sm: 2, md: 4 }}
          sx={{
            my: { xs: 1, md: 2 },
            wordBreak: 'break-all',
            userSelect: 'none',
            minHeight: '45px',
            fontWeight: 300,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            overflowWrap: 'break-word',
            textAlign: 'center'
          }}
        >
          {sharedGameState.maskedWord || (sharedGameState.wordLength ? '_ '.repeat(sharedGameState.wordLength).trim() : t("gameplay.loadingWord"))}
        </Typography>

        <Box sx={{ mb: 1,textAlign: 'center' }}>
          <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
            {t("gameplay.attemptsLeftLabel")}: <Chip
              label={myActualRemainingAttempts}
              size="small"
              color={myActualRemainingAttempts > 3 ? "success" : (myActualRemainingAttempts > 1 ? "warning" : "error")}
              sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}
            />
          </Typography>
          <Typography variant="body1" sx={{ mb: 0.5, minHeight: '30px', wordBreak: 'break-all', color: 'text.secondary' }}>
            {t("gameplay.correctGuessesLabel")}: <Chip
              label={myPlayerSpecificState.correctGuesses.join(', ').toUpperCase() || "-"}
              size="small"
              color="success"
              variant="outlined"
              sx={{ mr: 0.5, height: '20px' }}
            />
            {t("gameplay.incorrectGuessesLabel")}: <Chip
              label={myPlayerSpecificState.incorrectGuesses.join(', ').toUpperCase() || "-"}
              size="small"
              color="error"
              variant="outlined"
              sx={{ height: '20px' }}
            />
          </Typography>
        </Box>

        {amIReallyPlaying && (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              mb: 2,
              flex: 1
            }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                width: { xs: '100%', sm: '40%' },
                minHeight: { xs: '100px', sm: '120px' }
              }}>
                <HangmanDrawing incorrectGuesses={6 - myActualRemainingAttempts} size={0.9} />
              </Box>

              <Box sx={{
                flexGrow: 1,
                width: { xs: '100%', sm: '60%'},
                minHeight: { xs: '180px', sm: '200px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlphabetGrid
                  onGuess={onLetterGuess}
                  disabledLetters={[...myPlayerSpecificState.correctGuesses, ...myPlayerSpecificState.incorrectGuesses]}
                  isMyTurn={myPlayerSpecificState.isMyTurn}
                  t={t} 
                />
              </Box>
            </Box>

            <Box
              component="form"
              onSubmit={onWordSubmit}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                mt: 'auto',
                mb: 1
              }}
            >
              <TextField
                label={t("gameplay.guessWordFieldLabel")}
                variant="outlined"
                size="small"
                value={currentWordGuessInput}
                onChange={(e) => setCurrentWordGuessInput(e.target.value.toUpperCase())}
                disabled={!myPlayerSpecificState.isMyTurn}
                fullWidth
                sx={{ maxWidth: '350px' }}
                inputProps={{
                  maxLength: sharedGameState.wordLength > 0 ? sharedGameState.wordLength : 30,
                  style: { textTransform: 'uppercase' }
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="small"
                disabled={!myPlayerSpecificState.isMyTurn || !currentWordGuessInput.trim()}
              >
                {t("gameplay.submitButton")}
              </Button>
            </Box>
          </Box>
        )}

        {myPlayerSpecificState.won &&
          <Alert
            severity="success"
            variant="filled"
            sx={{ mt: 1, justifyContent: 'center', fontSize: '1rem', py: 0.5 }}
          >
            {t("gameplay.winMessage")}
          </Alert>
        }

        {myPlayerSpecificState.eliminated && !myPlayerSpecificState.won &&
          <Alert
            severity="error"
            variant="filled"
            sx={{ mt: 1, justifyContent: 'center', fontSize: '1rem', py: 0.5 }}
          >
            {t("gameplay.eliminationMessage")}
          </Alert>
        }
      </Paper>
    </Box>
  );
};

export default GamePlayArea;