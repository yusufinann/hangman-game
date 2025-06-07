import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const alphabets = {
  en: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(''),
  tr: "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split('')
};

const AlphabetGrid = ({ onGuess, disabledLetters = [], isMyTurn, languageMode = 'en', t }) => {
  const currentAlphabet = alphabets[languageMode] || alphabets.en;

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
        {t("alphabetGrid.chooseLetter", "Choose a Letter")}
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
        {currentAlphabet.map((letter) => {
          const letterToSend = letter;

          let displayLetterLowerCase;
          if (languageMode === 'tr') {
            displayLetterLowerCase = letter.toLocaleLowerCase('tr-TR');
          } else {
            displayLetterLowerCase = letter.toLowerCase();
          }

          const isDisabled = disabledLetters.includes(displayLetterLowerCase);

          return (
            <Box key={letter} sx={{ m: 0.2 }}>
              <Button
                variant={isDisabled ? "outlined" : "contained"}
                color={isDisabled ? "secondary" : "primary"}
                onClick={() => onGuess(letterToSend)} 
                disabled={!isMyTurn || isDisabled}
                sx={{
                  minWidth: { xs: '32px', sm: '38px' },
                  height: { xs: '32px', sm: '38px' },
                  padding: '4px',
                  fontSize: { xs: '0.75rem', sm: '0.85rem' },
                  fontWeight: 'bold',
                }}
              >
                {letter}
              </Button>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default AlphabetGrid;