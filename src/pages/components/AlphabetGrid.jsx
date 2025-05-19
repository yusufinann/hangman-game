import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const AlphabetGrid = ({ onGuess, disabledLetters = [], isMyTurn,t }) => {
  const alphabet = "ABCÇDEFGHIİJKLMNOÖPRSŞTUÜVYZ".split('');
  
  return (
    <Box 
      sx={{ 
        width: '100%',
        overflowX: 'auto',
        overflowY: 'visible',
        py: 2,
        position: 'relative',
        zIndex: 10
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'center' }}>
        {t("ChooseLetter")}
      </Typography>
      
      <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 0.5,
          maxWidth: { xs: '100%', sm: 520 }, 
          margin: 'auto',
        }}
      >
        {alphabet.map((letter) => (
          <Box key={letter} sx={{ m: 0.2 }}>
            <Button
              variant={disabledLetters.includes(letter.toLowerCase()) ? "outlined" : "contained"}
              color={
                disabledLetters.includes(letter.toLowerCase()) ? 
                  "secondary" : 
                  "primary"
              }
              onClick={() => onGuess(letter)}
              disabled={!isMyTurn || disabledLetters.includes(letter.toLowerCase())}
              sx={{
                minWidth: { xs: '32px', sm: '38px' },
                height: { xs: '32px', sm: '38px' },
                padding: '4px',
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                fontWeight: 'bold',
              }}
            >
              {letter}
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AlphabetGrid;