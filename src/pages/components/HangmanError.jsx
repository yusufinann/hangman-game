import { Alert } from "@mui/material";

const HangmanError = ({ t }) => (
  <Alert severity="error" sx={{ m: 3, p: 2 }}>
    {t("hangmanLoadingErrorMessage")}
  </Alert>
);
export default HangmanError;