import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { IconButton, Box} from "@mui/material";
const VolumeButton = ({toggleSound,soundEnabled}) => {
  return (
  <Box
        sx={{
          position: 'fixed',
          top: (theme) => theme.spacing(2),
          right: (theme) => theme.spacing(2),
          zIndex: 1301,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '50%',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          }
        }}
      >
        <IconButton
          onClick={toggleSound}
          color="primary"
          aria-label={soundEnabled ? "Sesi Kapat" : "Sesi Aç"}
          title={soundEnabled ? "Sesi Kapat" : "Sesi Aç"}
        >
          {soundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
        </IconButton>
      </Box>
  )
}

export default VolumeButton
