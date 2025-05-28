import React, { useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Select, MenuItem, FormControl, InputLabel, Button, CircularProgress, TextField,
  RadioGroup, FormControlLabel, Radio, FormLabel
} from '@mui/material';

const HostSetupModal = ({
  open,
  onClose,
  hostSetupData,
  onHostSetupChange,
  onStartGame,
  isStarting,
  socket,
  t
}) => {
  const handleInputChange = (event) => {
    onHostSetupChange(event);
  };

  const handleLanguageChange = (event) => {
    onHostSetupChange(event, true);
    if (socket && event.target.value) {
      socket.send(JSON.stringify({ type: "HANGMAN_GET_LANGUAGE_CATEGORIES", language: event.target.value }));
    }
  };

  useEffect(() => {
    if (open && socket && socket.readyState === WebSocket.OPEN && hostSetupData.availableLanguages.length === 0) {
        socket.send(JSON.stringify({ type: "HANGMAN_GET_CATEGORIES" }));
    }
    else if (open && socket && socket.readyState === WebSocket.OPEN && hostSetupData.languageMode && hostSetupData.availableCategories.length === 0 && hostSetupData.wordSourceMode === 'server') {
        socket.send(JSON.stringify({ type: "HANGMAN_GET_LANGUAGE_CATEGORIES", language: hostSetupData.languageMode }));
    }
  }, [open, socket, hostSetupData.languageMode, hostSetupData.availableLanguages.length, hostSetupData.wordSourceMode, hostSetupData.availableCategories.length]);


  const canStart = () => {
    if (!hostSetupData.languageMode || !hostSetupData.wordSourceMode) return false;
    if (hostSetupData.wordSourceMode === 'server') {
      return !!hostSetupData.category;
    }
    if (hostSetupData.wordSourceMode === 'host') {
      const word = hostSetupData.customWord?.trim() || "";
      const category = hostSetupData.customCategory?.trim() || "";
      const isCategoryValid = category.length === 0 || (category.length > 0 && category.length <= 30);
      return word.length >= 2 && word.length <= 25 && isCategoryValid;
    }
    return false;
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        {t("hostSetupModal.title", "Hangman Game Setup")}
      </DialogTitle>
      <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <DialogContentText sx={{ mb: 1 }}>
          {t("hostSetupModal.description", "Configure the game settings before starting.")}
        </DialogContentText>

        <FormControl fullWidth required>
          <InputLabel id="language-mode-label">{t("hostSetupModal.languageLabel", "Language")}</InputLabel>
          <Select
            labelId="language-mode-label"
            name="languageMode"
            value={hostSetupData.languageMode}
            label={t("hostSetupModal.languageLabel", "Language")}
            onChange={handleLanguageChange}
          >
            {hostSetupData.availableLanguages.length === 0 && (
              <MenuItem value="" disabled>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                {t("hostSetupModal.loadingLanguages", "Loading languages...")}
              </MenuItem>
            )}
            {hostSetupData.availableLanguages.map(lang => (
              <MenuItem key={lang} value={lang}>
                {lang === 'en' ? t('languages.en', 'English') : (lang === 'tr' ? t('languages.tr', 'Turkish') : lang)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl component="fieldset" fullWidth required>
          <FormLabel component="legend">{t("hostSetupModal.wordSourceLabel", "Word Source")}</FormLabel>
          <RadioGroup
            row
            aria-label="word-source-mode"
            name="wordSourceMode"
            value={hostSetupData.wordSourceMode}
            onChange={handleInputChange}
          >
            <FormControlLabel
              value="server"
              control={<Radio />}
              label={t("hostSetupModal.wordSourceAutomatic", "Automatic Word")}
            />
            <FormControlLabel
              value="host"
              control={<Radio />}
              label={t("hostSetupModal.wordSourceCustom", "Custom Word")}
            />
          </RadioGroup>
        </FormControl>

        {hostSetupData.wordSourceMode === 'server' && (
          <FormControl fullWidth required margin="normal">
            <InputLabel id="category-select-label">{t("hostSetupModal.categoryLabel", "Category")}</InputLabel>
            <Select
              labelId="category-select-label"
              name="category"
              value={hostSetupData.category}
              label={t("hostSetupModal.categoryLabel", "Category")}
              onChange={handleInputChange}
              disabled={!hostSetupData.languageMode}
            >
              {(!hostSetupData.languageMode) && (
                 <MenuItem value="" disabled>{t("hostSetupModal.selectLanguageFirst", "Select language first")}</MenuItem>
              )}
              {(hostSetupData.languageMode && hostSetupData.availableCategories.length === 0) && (
                <MenuItem value="" disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  {t("hostSetupModal.loadingCategories", "Loading categories...")}
                </MenuItem>
              )}
              {hostSetupData.availableCategories.map(cat => (
                <MenuItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {hostSetupData.wordSourceMode === 'host' && (
          <>
            <TextField
              fullWidth
              required
              margin="normal"
              name="customWord"
              label={t("hostSetupModal.customWordLabel", "Custom Word")}
              value={hostSetupData.customWord}
              onChange={handleInputChange}
              helperText={t("hostSetupModal.customWordHelper", "2-25 characters. Host will not play.")}
              inputProps={{ minLength: 2, maxLength: 25 }}
              disabled={!hostSetupData.languageMode}
            />
            <TextField
              fullWidth
              margin="normal"
              name="customCategory"
              label={t("hostSetupModal.customCategoryLabel", "Custom Category (Optional)")}
              value={hostSetupData.customCategory}
              onChange={handleInputChange}
              helperText={t("hostSetupModal.customCategoryHelper", "Max 30 characters. If empty, a default will be used.")}
              inputProps={{ maxLength: 30 }}
              disabled={!hostSetupData.languageMode}
            />
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={isStarting}>{t("Cancel")}</Button>
        <Button
          onClick={onStartGame}
          variant="contained"
          disabled={!canStart() || isStarting}
        >
          {isStarting ? <CircularProgress size={24} color="inherit" /> : t("hostSetupModal.startButton", "Start Game")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HostSetupModal;