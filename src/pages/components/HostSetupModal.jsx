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
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>Yeni Oyun Ayarları</DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <DialogContentText sx={{ mb: 2 }}>
          Oyuncuların tahmin edeceği kelime için bir kategori seçin. Kelime rastgele seçilecektir.
        </DialogContentText>
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="category-select-label">Kategori</InputLabel>
          <Select
            labelId="category-select-label"
            name="category"
            value={hostSetupData.category}
            label="Kategori"
            onChange={onHostSetupChange}
          >
            {hostSetupData.availableCategories.length === 0 && <MenuItem disabled><CircularProgress size={20} sx={{mr:1}}/>Kategoriler yükleniyor...</MenuItem>}
            {hostSetupData.availableCategories.map(cat => <MenuItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</MenuItem>)}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">İptal</Button>
        <Button onClick={onStartGame} variant="contained" disabled={!hostSetupData.category}>Oyunu Başlat</Button>
      </DialogActions>
    </Dialog>
  );
};

export default HostSetupModal;