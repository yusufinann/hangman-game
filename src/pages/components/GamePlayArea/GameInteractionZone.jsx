import React from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import HangmanDrawing from "./HangmanDrawing";
import AlphabetGrid from "./AlphabetGrid";

const GameInteractionZone = ({
  isHostObserver,
  amIReallyPlaying,
  myActualRemainingAttempts,
  myPlayerSpecificState,
  onLetterGuess,
  sharedGameState,
  t,
}) => {
  return (
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
          background: (theme) => alpha(theme.palette.background.paper, 0.1),
          borderRadius: "16px",
          backdropFilter: "blur(8px)",
          border: (theme) =>
            `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        }}
      >
        {isHostObserver ? (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: "center", p: 2 }}
          >
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
            background: (theme) =>
              alpha(theme.palette.background.paper, 0.05),
            borderRadius: "16px",
            backdropFilter: "blur(8px)",
            border: (theme) =>
              `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
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
  );
};

export default GameInteractionZone;