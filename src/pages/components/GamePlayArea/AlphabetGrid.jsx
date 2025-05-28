import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const alphabets = {
  en: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(''),
  tr: "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split('') // Türkçe karakterleri ekledim (Ğ unutulmuştu sanırım)
};

const AlphabetGrid = ({ onGuess, disabledLetters = [], isMyTurn, languageMode = 'en', t }) => {
  // Dil moduna göre doğru alfabeyi seç, eğer dil modu geçerli değilse varsayılan olarak İngilizce kullan
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
        {t("alphabetGrid.chooseLetter", "Choose a Letter")} {/* Çeviri anahtarını güncelledim */}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 0.5,
          maxWidth: { xs: '100%', sm: 520 }, // Maksimum genişlik Türkçe alfabe için biraz daha fazla olabilir
          margin: 'auto',
        }}
      >
        {currentAlphabet.map((letter) => {
          const lowerCaseLetter = letter.toLowerCase(); // Karşılaştırma için küçük harf
          const isDisabled = disabledLetters.includes(lowerCaseLetter);

          return (
            <Box key={letter} sx={{ m: 0.2 }}>
              <Button
                variant={isDisabled ? "outlined" : "contained"}
                color={isDisabled ? "secondary" : "primary"}
                onClick={() => onGuess(letter)} // Orijinal büyük/küçük harfi gönder
                disabled={!isMyTurn || isDisabled}
                sx={{
                  minWidth: { xs: '32px', sm: '38px' }, // Boyutlar TR için ayarlanabilir
                  height: { xs: '32px', sm: '38px' },
                  padding: '4px',
                  fontSize: { xs: '0.75rem', sm: '0.85rem' }, // Türkçe alfabe daha fazla harf içerdiği için fontu biraz küçültebiliriz
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