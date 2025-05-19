import { Modal, Box } from "@mui/material";
import GameEndScreen from "./GameEndScreen"; 

const GameEndModalManager = ({
  show, 
  sharedGameState,
  onClose,
  t,
}) => {
  if (!show) return null;

  return (
    <Modal
      open={show}
      onClose={onClose}
      aria-labelledby="game-end-screen-title"
      aria-describedby="game-end-screen-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 1,
      }}
    >
      <Box sx={{ outline: "none" }}>
        <GameEndScreen
          sharedGameState={sharedGameState}
          onClose={onClose}
          t={t}
        />
      </Box>
    </Modal>
  );
};
export default GameEndModalManager;