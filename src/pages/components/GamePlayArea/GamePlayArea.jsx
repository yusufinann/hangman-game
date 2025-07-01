import React, { useMemo } from "react";
import { Box, Typography, Paper, Chip, Alert } from "@mui/material";
import { alpha } from "@mui/material/styles";
import GameHeader from "./GameHeader";
import GameInteractionZone from "./GameInteractionZone";
import WordGuessForm from "./WordGuessForm";

const MaskedWordDisplay = React.memo(({ maskedWord, wordLength, t }) => (
  <Typography
    variant="h2"
    letterSpacing={{ xs: 2, sm: 4, md: 6 }}
    sx={{
      my: { xs: 1, md: 2 },
      wordBreak: "break-all",
      userSelect: "none",
      minHeight: "48px",
      fontWeight: 800,
      fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.5rem" },
      overflowWrap: "break-word",
      textAlign: "center",
      p: 1,
      fontFamily: '"Orbitron", "Roboto", sans-serif',
      color: (theme) => alpha(theme.palette.primary.main, 0.9), // Degistirildi: Gradyan yerine direkt renk
      // Degistirildi: Daha belirgin bir golge efekti
      textShadow: `
        0 0 15px ${alpha("#2dd4bf", 0.4)}, 
        0 0 5px ${alpha("#ffffff", 0.5)},
        2px 2px 4px ${alpha("#000000", 0.3)}
      `,
    }}
  >
    {maskedWord ||
      (wordLength
        ? "_ ".repeat(wordLength).trim()
        : t("gameplay.loadingWord", "Loading word..."))}
  </Typography>
));

const PlayerStats = React.memo(({ myPlayerSpecificState, t }) => {
  const remainingAttempts = myPlayerSpecificState?.remainingAttempts ?? 0;
  return (
    <Box sx={{ mb: 1, textAlign: "center" }}>
      <Typography
        variant="subtitle2"
        sx={{
          fontSize: "1rem",
          color: (theme) => alpha(theme.palette.text.primary, 0.95),
          fontWeight: 600,
          fontFamily: '"Roboto Mono", monospace', // Eklendi: Monospaced font
          textShadow: "1px 1px 2px rgba(0,0,0,0.2)", // Eklendi: Metin golgesi
        }}
      >
        {t("gameplay.attemptsLeftLabel", "Kalan Hak")}:{" "}
        <Chip
          label={remainingAttempts}
          size="small"
          sx={{
            fontSize: "0.9rem",
            fontWeight: "bold",
            fontFamily: "'Orbitron', 'Press Start 2P', cursive",
            color: 'white',
            background: (theme) => {
              const color =
                remainingAttempts > 3
                  ? theme.palette.success.main
                  : remainingAttempts > 1
                  ? theme.palette.warning.main
                  : theme.palette.error.main;
              return `linear-gradient(145deg, ${alpha(color, 0.9)} 0%, ${alpha(
                color,
                0.7
              )} 100%)`;
            },
            boxShadow: (theme) => {
              const color =
                remainingAttempts > 3
                  ? theme.palette.success.light
                  : remainingAttempts > 1
                  ? theme.palette.warning.light
                  : theme.palette.error.light;
              return `0 4px 15px ${alpha(color, 0.3)}`;
            },
          }}
        />
      </Typography>
      <Typography
        variant="caption"
        sx={{
          my: 0.5,
          minHeight: "24px",
          wordBreak: "break-all",
          color: (theme) =>
            theme.palette.mode === "dark"
              ? theme.palette.common.white
              : "text.primary",
          fontSize: "0.85rem",
          display: "block",
          fontFamily: '"Roboto Mono", monospace', // Eklendi: Monospaced font
          textShadow: "1px 1px 2px rgba(0,0,0,0.2)", // Eklendi: Metin golgesi
        }}
      >
        {t("gameplay.correctGuessesLabel", "Doğru Tahminler")}:{" "}
        <Chip
          label={
            myPlayerSpecificState.correctGuesses.join(", ").toUpperCase() || "-"
          }
          size="small"
          color="success"
          variant="outlined"
          sx={{
            mr: 0.5,
            height: "24px",
            fontFamily: '"Roboto Mono", monospace',
            background: (theme) => alpha(theme.palette.success.main, 0.1),
            borderColor: (theme) => alpha(theme.palette.success.main, 0.5),
            backdropFilter: "blur(4px)",
          }}
        />
        {t("gameplay.incorrectGuessesLabel", "Yanlış Tahminler")}:{" "}
        <Chip
          label={
            myPlayerSpecificState.incorrectGuesses.join(", ").toUpperCase() ||
            "-"
          }
          size="small"
          color="error"
          variant="outlined"
          sx={{
            height: "24px",
            fontFamily: '"Roboto Mono", monospace',
            background: (theme) => alpha(theme.palette.error.main, 0.1),
            borderColor: (theme) => alpha(theme.palette.error.main, 0.5),
            backdropFilter: "blur(4px)",
          }}
        />
      </Typography>
    </Box>
  );
});

// GameStatusAlerts bileşeni değişmedi.

const GameStatusAlerts = React.memo(
    ({
      gamePhase,
      isHostObserver,
      myPlayerSpecificState,
      sharedGameState,
      t,
    }) => {
      if (gamePhase === "playing" && isHostObserver) {
        return (
          <Alert
            severity="info"
            sx={{
              my: 1,
              textAlign: "center",
              borderRadius: "16px",
              background: (theme) => `linear-gradient(135deg, 
                  ${alpha(theme.palette.info.main, 0.1)} 0%, 
                  ${alpha(theme.palette.info.main, 0.05)} 100%)`,
              backdropFilter: "blur(8px)",
              border: (theme) =>
                `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
              boxShadow: (theme) =>
                `0 4px 16px ${alpha(theme.palette.info.main, 0.2)}`,
            }}
          >
            {t(
              "gameplay.hostObserverMessage",
              "You defined the word and are observing the game. Other players are trying to guess it."
            )}
          </Alert>
        );
      }
  
      if (!isHostObserver) {
        if (myPlayerSpecificState.won) {
          return (
            <Alert
              severity="success"
              variant="filled"
              sx={{
                mt: 1,
                justifyContent: "center",
                borderRadius: "16px",
                background: (theme) => `linear-gradient(135deg, 
                  ${theme.palette.success.main} 0%, 
                  ${theme.palette.success.light} 100%)`,
                boxShadow: (theme) =>
                  `0 6px 24px ${alpha(theme.palette.success.main, 0.4)}`,
                animation: "celebrate 0.6s ease-out",
                "@keyframes celebrate": {
                  "0%": { transform: "scale(0.8)", opacity: 0 },
                  "50%": { transform: "scale(1.05)" },
                  "100%": { transform: "scale(1)", opacity: 1 },
                },
              }}
            >
              <Typography
                variant="h5"
                component="span"
                sx={{
                  fontWeight: "bold",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {t("gameplay.winMessage", "Congratulations! You won!")}
              </Typography>
            </Alert>
          );
        }
        if (myPlayerSpecificState.eliminated && !myPlayerSpecificState.won) {
          return (
            <Alert
              severity="error"
              variant="filled"
              sx={{
                mt: 1,
                justifyContent: "center",
                borderRadius: "16px",
                background: (theme) => `linear-gradient(135deg, 
                    ${theme.palette.error.main} 0%, 
                    ${theme.palette.error.dark} 100%)`,
                boxShadow: (theme) =>
                  `0 6px 24px ${alpha(theme.palette.error.main, 0.4)}`,
              }}
            >
              <Typography
                variant="h5"
                component="span"
                sx={{
                  fontWeight: "bold",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {t("gameplay.eliminationMessage", "You have been eliminated!")}
              </Typography>
            </Alert>
          );
        }
      }
  
      if (gamePhase === "ended" && sharedGameState.word) {
        return (
          <Alert
            severity="info"
            sx={{
              mt: 1,
              justifyContent: "center",
              borderRadius: "16px",
              background: (theme) => `linear-gradient(135deg, 
                  ${alpha(theme.palette.info.main, 0.9)} 0%, 
                  ${alpha(theme.palette.info.main, 0.7)} 100%)`,
              backdropFilter: "blur(8px)",
              border: (theme) =>
                `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
              boxShadow: (theme) =>
                `0 4px 16px ${alpha(theme.palette.info.main, 0.3)}`,
            }}
          >
            {t("gameplay.wordWas", "The word was:")}{" "}
            <Typography
              component="strong"
              variant="h6"
              sx={{
                display: "inline",
                background: (theme) => `linear-gradient(135deg, 
                    ${theme.palette.primary.main} 0%, 
                    ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: "bold",
                fontFamily: '"Orbitron", sans-serif',
              }}
            >
              {sharedGameState.word.toUpperCase()}
            </Typography>
          </Alert>
        );
      }
      return null;
    }
  );

const GamePlayArea = React.memo(
  ({
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
    const amIReallyPlaying = useMemo(
      () => myPlayerSpecificState?.isParticipating ?? false,
      [myPlayerSpecificState?.isParticipating]
    );

    const isHostObserver = useMemo(
      () =>
        isHost &&
        sharedGameState.wordSourceMode === "host" &&
        !myPlayerSpecificState.isParticipating,
      [
        isHost,
        sharedGameState.wordSourceMode,
        myPlayerSpecificState.isParticipating,
      ]
    );

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
          elevation={0}
          sx={{
            p: { xs: 1, sm: 2 },
            // Degistirildi: Aurora efekti için radyal ve lineer gradyan kombinasyonu
            background: (theme) =>
              theme.palette.mode === "dark"
                ? `radial-gradient(ellipse at 50% 40%, ${alpha("#2dd4bf", 0.1)}, transparent 80%),
                   linear-gradient(135deg, ${alpha("#0f172a", 0.2)} 0%, ${alpha("#1e293b", 0.3)} 100%)`
                : `radial-gradient(ellipse at 50% 40%, ${alpha(theme.palette.primary.light, 0.15)}, transparent 80%),
                   linear-gradient(135deg, ${alpha("#ffffff", 0.25)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: (theme) =>
              `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            overflow: "visible",
            boxShadow: (theme) => `
              0 8px 32px 0 ${alpha(theme.palette.common.black, 0.37)}
            `,
            position: "relative",
          }}
        >
          <GameHeader
            sharedGameState={sharedGameState}
            myPlayerSpecificState={myPlayerSpecificState}
            turnTimeLeft={turnTimeLeft}
            currentPlayerTurnName={currentPlayerTurnName}
            isHost={isHost}
            gamePhase={gamePhase}
            onOpenHostSetup={onOpenHostSetup}
            onEndGameByHost={onEndGameByHost}
            toggleSound={toggleSound}
            soundEnabled={soundEnabled}
            t={t}
          />

          <MaskedWordDisplay
            maskedWord={sharedGameState.maskedWord}
            wordLength={sharedGameState.wordLength}
            t={t}
          />

          {!isHostObserver && amIReallyPlaying && gamePhase === "playing" && (
            <PlayerStats myPlayerSpecificState={myPlayerSpecificState} t={t} />
          )}

          <GameStatusAlerts
            gamePhase={gamePhase}
            isHostObserver={isHostObserver}
            myPlayerSpecificState={myPlayerSpecificState}
            sharedGameState={sharedGameState}
            t={t}
          />

          {gamePhase === "playing" && (
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <GameInteractionZone
                isHostObserver={isHostObserver}
                amIReallyPlaying={amIReallyPlaying}
                myActualRemainingAttempts={
                  myPlayerSpecificState?.remainingAttempts ?? 0
                }
                myPlayerSpecificState={myPlayerSpecificState}
                onLetterGuess={onLetterGuess}
                sharedGameState={sharedGameState}
                t={t}
              />
              {amIReallyPlaying && !isHostObserver && (
                <WordGuessForm
                  onWordSubmit={onWordSubmit}
                  currentWordGuessInput={currentWordGuessInput}
                  setCurrentWordGuessInput={setCurrentWordGuessInput}
                  myPlayerSpecificState={myPlayerSpecificState}
                  sharedGameState={sharedGameState}
                  t={t}
                />
              )}
            </Box>
          )}
        </Paper>
      </Box>
    );
  }
);

export default GamePlayArea;