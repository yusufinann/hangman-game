import { Box, CircularProgress, Typography } from "@mui/material";

const HangmanLoading = ({ t }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50vh",
    }}
  >
    <CircularProgress size={50} />
    <Typography variant="h6" sx={{ ml: 2 }}>
      {t("Game Loading...")}
    </Typography>
  </Box>
);
export default HangmanLoading;