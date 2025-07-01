import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { TimerBar } from "../StyledComponents";
import GameControls from "../GameControls";
import VolumeButton from "./VolumeButton";

const MAX_TURN_TIME_SECONDS = 12;

const GameHeader = ({
  sharedGameState,
  myPlayerSpecificState,
  turnTimeLeft,
  currentPlayerTurnName,
  isHost,
  gamePhase,
  onOpenHostSetup,
  onEndGameByHost,
  toggleSound,
  soundEnabled,
  t,
}) => {
  const isHostObserver =
    isHost &&
    sharedGameState.wordSourceMode === "host" &&
    !myPlayerSpecificState.isParticipating;
  const showSecondsInTurnLabel = !!sharedGameState.turnEndsAt;

  return (
    <>
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
          <Typography
            variant="caption"
            display="block"
            sx={{
              color: (theme) => alpha(theme.palette.text.primary, 0.8),
              fontWeight: 500,
              letterSpacing: "0.5px",
            }}
          >
            {t("wordLanguage")}:{" "}
            <Chip
              label={sharedGameState.languageMode?.toUpperCase()}
              size="small"
              variant="filled"
              sx={{
                background: (theme) => `linear-gradient(135deg, 
                  ${alpha(theme.palette.secondary.main, 0.2)} 0%, 
                  ${alpha(theme.palette.secondary.main, 0.35)} 100%)`,
                color: "text.primary",
                fontWeight: "bold",
                backdropFilter: "blur(8px)",
                border: (theme) =>
                  `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
                boxShadow: (theme) =>
                  `0 2px 8px ${alpha(theme.palette.secondary.main, 0.2)}`,
              }}
            />{" "}
            {t("Word Selection")}:{" "}
            <Chip
              label={
                sharedGameState.wordSourceMode === "server"
                  ? t("hostSetupModal.wordSourceAutomatic", "Automatic Word")
                  : t("hostSetupModal.wordSourceCustom", "Custom Word")
              }
              size="small"
              variant="filled"
              sx={{
                background: (theme) => `linear-gradient(135deg, 
                  ${alpha(theme.palette.secondary.main, 0.2)} 0%, 
                  ${alpha(theme.palette.secondary.main, 0.35)} 100%)`,
                color: "text.primary",
                fontWeight: "bold",
                backdropFilter: "blur(8px)",
                border: (theme) =>
                  `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
                boxShadow: (theme) =>
                  `0 2px 8px ${alpha(theme.palette.secondary.main, 0.2)}`,
              }}
            />
          </Typography>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              m: 0,
              mt: 0.5,
              color: (theme) => alpha(theme.palette.text.primary, 0.9),
              fontWeight: 600,
            }}
          >
            {t("gameplay.categoryLabel", "Category")}:{" "}
            <Chip
              label={
                sharedGameState.category?.toUpperCase() ||
                t("gameplay.categoryUndefined", "N/A")
              }
              color="info"
              variant="filled"
              size="small"
              sx={{
                background: (theme) => `linear-gradient(135deg, 
                  ${theme.palette.info.main} 0%, 
                  ${alpha(theme.palette.info.main, 0.8)} 100%)`,
                fontWeight: "bold",
                textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                boxShadow: (theme) =>
                  `0 2px 8px ${alpha(theme.palette.info.main, 0.3)}`,
              }}
            />
          </Typography>

          {sharedGameState.currentPlayerId && gamePhase === "playing" && (
            <Typography
              variant="body2"
              sx={{
                fontWeight: "bold",
                my: 0.5,
                color: (theme) => alpha(theme.palette.text.primary, 0.9),
              }}
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
                color={myPlayerSpecificState.isMyTurn ? "success" : "default"}
                variant="filled"
                size="small"
                sx={{
                  background: (theme) =>
                    myPlayerSpecificState.isMyTurn
                      ? `linear-gradient(135deg, 
                        ${theme.palette.success.main} 0%, 
                        ${theme.palette.success.light} 100%)`
                      : `linear-gradient(135deg, 
                        ${alpha(theme.palette.text.primary, 0.1)} 0%, 
                        ${alpha(theme.palette.text.primary, 0.2)} 100%)`,
                  fontWeight: "bold",
                }}
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
    </>
  );
};

export default GameHeader;