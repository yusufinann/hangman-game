import React from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Select, MenuItem, FormControl, InputLabel, Button, CircularProgress
} from '@mui/material';

const HostSetupModal = ({
  open,
  onClose,
  hostSetupData,
  onHostSetupChange,
  onStartGame,
  t
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        {t("hostSetupModal.title")}
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <DialogContentText sx={{ mb: 2 }}>
          {t("hostSetupModal.description")}
        </DialogContentText>
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="category-select-label">{t("hostSetupModal.categoryLabel")}</InputLabel>
          <Select
            labelId="category-select-label"
            name="category"
            value={hostSetupData.category}
            label={t("hostSetupModal.categoryLabel")} // Ensure this matches the InputLabel
            onChange={onHostSetupChange}
          >
            {hostSetupData.availableCategories.length === 0 && (
              <MenuItem disabled>
                <CircularProgress size={20} sx={{mr:1}}/>
                {t("hostSetupModal.loadingCategories")}
              </MenuItem>
            )}
            {hostSetupData.availableCategories.map(cat => (
              <MenuItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)} {/* Assuming category names are fine as is or pre-translated */}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">{t("hostSetupModal.cancelButton")}</Button>
        <Button
          onClick={onStartGame}
          variant="contained"
          disabled={!hostSetupData.category}
        >
          {t("hostSetupModal.startButton")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HostSetupModal;