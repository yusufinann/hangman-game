import React from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Chip,
  Button,
  Alert,
} from "@mui/material";
import HangmanDrawing from "./HangmanDrawing";
import AlphabetGrid from "./AlphabetGrid";
import { TimerBar } from "../StyledComponents";
import GameControls from "../GameControls";
import VolumeButton from "./VolumeButton";

const MAX_TURN_TIME_SECONDS = 12;

const GamePlayArea = ({
  sharedGameState,
  myPlayerSpecificState,
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
  t,
}) => {
  const amIReallyPlaying = myPlayerSpecificState?.isParticipating ?? false;
  const myActualRemainingAttempts =
    myPlayerSpecificState?.remainingAttempts ?? 0;

  const isHostObserver =
    isHost &&
    sharedGameState.wordSourceMode === "host" &&
    !myPlayerSpecificState.isParticipating;
  const showSecondsInTurnLabel = !!sharedGameState.turnEndsAt;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        gap: 1,
        overflow: "auto",
        height: "100%",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 1, sm: 2 },
          background:"transparent",
          backdropFilter: "blur(10px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          overflow: "visible",
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
              mb: 1,
            }}
          >
            <Box sx={{ flex: "1", minWidth: "160px", textAlign: "left" }}>
              <Typography variant="caption" display="block">
                {t("wordLanguage")}:{" "}
                <Chip
                  label={sharedGameState.languageMode?.toUpperCase()}
                  size="small"
                  variant="outlined"
                />{" "}
                {t("Word Selection")}:{" "}
                <Chip
                  label={
                    sharedGameState.wordSourceMode === "server"
                      ? t(
                          "hostSetupModal.wordSourceAutomatic",
                          "Automatic Word"
                        )
                      : t("hostSetupModal.wordSourceCustom", "Custom Word")
                  }
                  size="small"
                  variant="outlined"
                />
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ m: 0 }}>
                {t("gameplay.categoryLabel", "Category")}:{" "}
                <Chip
                  label={
                    sharedGameState.category?.toUpperCase() ||
                    t("gameplay.categoryUndefined", "N/A")
                  }
                  color="info"
                  variant="filled"
                  size="small"
                />
              </Typography>

              {sharedGameState.currentPlayerId && gamePhase === "playing" && (
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", my: 0.5 }}
                >
                  {t("gameplay.turnLabel", "Turn")}:{" "}
                  <Chip
                    label={
                      myPlayerSpecificState.isMyTurn
                        ? showSecondsInTurnLabel
                          ? t("gameplay.yourTurn", { seconds: turnTimeLeft })
                          : t("gameplay.yourTurnSimple", "Your Turn")
                        : `${currentPlayerTurnName}`
                    }
                    color={
                      myPlayerSpecificState.isMyTurn ? "success" : "default"
                    }
                    variant={
                      myPlayerSpecificState.isMyTurn ? "filled" : "outlined"
                    }
                    size="small"
                  />
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                flex: "0 0 auto",
                display: "flex",
                justifyContent: "flex-end",
                gap: { xs: 1, sm: 2 },
                minWidth: { xs: "100%", sm: "auto" },
                alignItems: "center",
              }}
            >
              <GameControls
                isHost={isHost}
                gamePhase={gamePhase}
                onOpenHostSetup={onOpenHostSetup}
                onEndGameByHost={onEndGameByHost}
                t={t}
              />
              <VolumeButton
                toggleSound={toggleSound}
                soundEnabled={soundEnabled}
                t={t}
              />
            </Box>
          </Box>

          {sharedGameState.currentPlayerId &&
            myPlayerSpecificState.isMyTurn &&
            sharedGameState.turnEndsAt &&
            gamePhase === "playing" &&
            !isHostObserver && (
              <TimerBar
                percentage={(turnTimeLeft / MAX_TURN_TIME_SECONDS) * 100}
              />
            )}
        </Box>

        <Typography
          variant="h2"
          letterSpacing={{ xs: 1, sm: 2, md: 3 }}
          sx={{
            my: { xs: 1, md: 2 },
            wordBreak: "break-all",
            userSelect: "none",
            minHeight: "48px",
            fontWeight: 300,
            fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.8rem" },
            overflowWrap: "break-word",
            textAlign: "center",
            p: 1,
          }}
        >
          {sharedGameState.maskedWord ||
            (sharedGameState.wordLength
              ? "_ ".repeat(sharedGameState.wordLength).trim()
              : t("gameplay.loadingWord", "Loading word..."))}
        </Typography>

        {!isHostObserver && amIReallyPlaying && gamePhase === "playing" && (
          <Box sx={{ mb: 1, textAlign: "center" }}>
            <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
              {t("gameplay.attemptsLeftLabel", "Attempts Left")}:{" "}
              <Chip
                label={myActualRemainingAttempts}
                size="small"
                color={
                  myActualRemainingAttempts > 3
                    ? "success"
                    : myActualRemainingAttempts > 1
                    ? "warning"
                    : "error"
                }
                sx={{ fontSize: "0.8rem", fontWeight: "bold" }}
              />
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 0.5,
                minHeight: "24px",
                wordBreak: "break-all",
                color: "text.secondary",
                fontSize: "0.8rem",
              }}
            >
              {t("gameplay.correctGuessesLabel", "Correct")}:{" "}
              <Chip
                label={
                  myPlayerSpecificState.correctGuesses
                    .join(", ")
                    .toUpperCase() || "-"
                }
                size="small"
                color="success"
                variant="outlined"
                sx={{ mr: 0.5, height: "20px" }}
              />
              {t("gameplay.incorrectGuessesLabel", "Incorrect")}:{" "}
              <Chip
                label={
                  myPlayerSpecificState.incorrectGuesses
                    .join(", ")
                    .toUpperCase() || "-"
                }
                size="small"
                color="error"
                variant="outlined"
                sx={{ height: "20px" }}
              />
            </Typography>
          </Box>
        )}

        {isHostObserver && gamePhase === "playing" && (
          <Alert severity="info" sx={{ my: 1, textAlign: "center" }}>
            {t(
              "gameplay.hostObserverMessage",
              "You defined the word and are observing the game. Other players are trying to guess it."
            )}
          </Alert>
        )}

        {gamePhase === "playing" && (
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                mb: 2,
                flex: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: { xs: "100%", sm: "40%" },
                  minHeight: { xs: "100px", sm: "120px" },
                  maxWidth: "200px",
                }}
              >
                {isHostObserver ? (
                  <Typography variant="caption" color="text.secondary">
                    {t(
                      "gameplay.hostObserverDrawingPlaceholder",
                      "Players' progress will be shown in the player list."
                    )}
                  </Typography>
                ) : (
                  <HangmanDrawing
                    incorrectGuesses={6 - myActualRemainingAttempts}
                    size={0.9}
                  />
                )}
              </Box>

              {amIReallyPlaying && !isHostObserver && (
                <Box
                  sx={{
                    flexGrow: 1,
                    width: { xs: "100%", sm: "60%" },
                    minHeight: { xs: "180px", sm: "200px" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AlphabetGrid
                    onGuess={onLetterGuess}
                    disabledLetters={[
                      ...myPlayerSpecificState.correctGuesses,
                      ...myPlayerSpecificState.incorrectGuesses,
                    ]}
                    isMyTurn={myPlayerSpecificState.isMyTurn}
                    languageMode={sharedGameState.languageMode}
                    t={t}
                  />
                </Box>
              )}
            </Box>

            {amIReallyPlaying && !isHostObserver && (
              <Box
                component="form"
                onSubmit={onWordSubmit}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  mt: "auto",
                  mb: 1,
                }}
              >
                <TextField
                  label={t(
                    "gameplay.guessWordFieldLabel",
                    "Guess the full word"
                  )}
                  variant="outlined"
                  size="small"
                  value={currentWordGuessInput}
                  onChange={(e) => setCurrentWordGuessInput(e.target.value)}
                  disabled={!myPlayerSpecificState.isMyTurn}
                  fullWidth
                  sx={{ maxWidth: "350px" }}
                  inputProps={{
                    maxLength:
                      sharedGameState.wordLength > 0
                        ? sharedGameState.wordLength
                        : 30,
                    style: {
                      textTransform:
                        sharedGameState.languageMode === "tr"
                          ? "none"
                          : "uppercase",
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="medium"
                  disabled={
                    !myPlayerSpecificState.isMyTurn ||
                    !currentWordGuessInput.trim()
                  }
                >
                  {t("gameplay.submitButton", "Submit Word")}
                </Button>
              </Box>
            )}
          </Box>
        )}

        {!isHostObserver && myPlayerSpecificState.won && (
          <Alert
            severity="success"
            variant="filled"
            sx={{ mt: 1, justifyContent: "center", fontSize: "1rem", py: 0.5 }}
          >
            {t("gameplay.winMessage", "Congratulations! You won!")}
          </Alert>
        )}

        {!isHostObserver &&
          myPlayerSpecificState.eliminated &&
          !myPlayerSpecificState.won && (
            <Alert
              severity="error"
              variant="filled"
              sx={{
                mt: 1,
                justifyContent: "center",
                fontSize: "1rem",
                py: 0.5,
              }}
            >
              {t("gameplay.eliminationMessage", "You have been eliminated!")}
            </Alert>
          )}

        {gamePhase === "ended" && sharedGameState.word && (
          <Alert
            severity="info"
            sx={{ mt: 1, justifyContent: "center", fontSize: "1rem" }}
          >
            {t("gameplay.wordWas", "The word was:")}{" "}
            <strong>{sharedGameState.word.toUpperCase()}</strong>
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default GamePlayArea;
