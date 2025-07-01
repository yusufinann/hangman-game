import React from "react";
import { Box, TextField, Button } from "@mui/material";
import { alpha } from "@mui/material/styles";

const WordGuessForm = ({
  onWordSubmit,
  currentWordGuessInput,
  setCurrentWordGuessInput,
  myPlayerSpecificState,
  sharedGameState,
  t,
}) => {
  return (
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
        p: 2,
        background: (theme) => alpha(theme.palette.background.paper, 0.1),
        borderRadius: "16px",
        backdropFilter: "blur(8px)",
        border: (theme) =>
          `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
      }}
    >
      <TextField
        label={t("gameplay.guessWordFieldLabel", "Guess the full word")}
        variant="outlined"
        size="small"
        value={currentWordGuessInput}
        onChange={(e) => setCurrentWordGuessInput(e.target.value)}
        disabled={!myPlayerSpecificState.isMyTurn}
        fullWidth
        sx={{
          maxWidth: "350px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            background: (theme) =>
              alpha(theme.palette.background.paper, 0.3),
            backdropFilter: "blur(8px)",
            transition: "all 0.3s ease",
            "&.Mui-focused": {
              background: (theme) =>
                alpha(theme.palette.background.paper, 0.5),
            },
            "&.Mui-focused fieldset": {
              borderColor: "primary.main",
              borderWidth: "2px",
              boxShadow: (theme) =>
                `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
            },
          },
          "& .MuiInputLabel-root": {
            color: (theme) => alpha(theme.palette.text.primary, 0.7),
            "&.Mui-focused": {
              color: "primary.main",
              fontWeight: 600,
            },
          },
        }}
        inputProps={{
          maxLength:
            sharedGameState.wordLength > 0 ? sharedGameState.wordLength : 30,
          style: {
            textTransform:
              sharedGameState.languageMode === "tr" ? "none" : "uppercase",
            fontWeight: "600",
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        size="medium"
        disabled={
          !myPlayerSpecificState.isMyTurn || !currentWordGuessInput.trim()
        }
        sx={{
          borderRadius: "12px",
          background: (theme) => `linear-gradient(135deg, 
            ${theme.palette.primary.main} 0%, 
            ${theme.palette.primary.dark || theme.palette.primary.main} 100%)`,
          boxShadow: (theme) =>
            `0 4px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
          fontWeight: "bold",
          textTransform: "none",
          px: 3,
          "&:hover": {
            background: (theme) => `linear-gradient(135deg, 
              ${theme.palette.primary.dark || theme.palette.primary.main} 0%, 
              ${theme.palette.primary.main} 100%)`,
            transform: "translateY(-1px)",
            boxShadow: (theme) =>
              `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
          },
          "&:disabled": {
            background: (theme) => alpha(theme.palette.action.disabled, 0.1),
            color: (theme) => alpha(theme.palette.text.disabled, 0.5),
          },
        }}
      >
        {t("gameplay.submitButton", "Submit Word")}
      </Button>
    </Box>
  );
};

export default WordGuessForm;