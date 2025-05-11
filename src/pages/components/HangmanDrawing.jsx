import React from 'react';
import { useTheme } from '@mui/material/styles';

const HangmanDrawing = ({ incorrectGuesses, size = 1 }) => {
  const theme = useTheme();
  const scale = (val) => val * size;
  const partsToDraw = [];
  const baseColor = theme.palette.text.primary;
  let dynamicColor = baseColor;
  if (incorrectGuesses >= 6) dynamicColor = theme.palette.error.main;
  else if (incorrectGuesses >= 4) dynamicColor = theme.palette.warning.main;

  const base = [
    <line key="base" x1={scale(60)} y1={scale(230)} x2={scale(180)} y2={scale(230)} stroke={baseColor} strokeWidth={scale(4)} />,
    <line key="post" x1={scale(100)} y1={scale(230)} x2={scale(100)} y2={scale(50)} stroke={baseColor} strokeWidth={scale(4)} />,
    <line key="beam" x1={scale(100)} y1={scale(50)} x2={scale(170)} y2={scale(50)} stroke={baseColor} strokeWidth={scale(4)} />,
    <line key="rope" x1={scale(170)} y1={scale(50)} x2={scale(170)} y2={scale(80)} stroke={baseColor} strokeWidth={scale(4)} />,
  ];
  partsToDraw.push(...base);
  if (incorrectGuesses > 0) partsToDraw.push(<circle key="head" cx={scale(170)} cy={scale(100)} r={scale(20)} stroke={dynamicColor} strokeWidth={scale(4)} fill="none" />);
  if (incorrectGuesses > 1) partsToDraw.push(<line key="body" x1={scale(170)} y1={scale(120)} x2={scale(170)} y2={scale(170)} stroke={dynamicColor} strokeWidth={scale(4)} />);
  if (incorrectGuesses > 2) partsToDraw.push(<line key="arm1" x1={scale(170)} y1={scale(130)} x2={scale(140)} y2={scale(160)} stroke={dynamicColor} strokeWidth={scale(4)} />);
  if (incorrectGuesses > 3) partsToDraw.push(<line key="arm2" x1={scale(170)} y1={scale(130)} x2={scale(200)} y2={scale(160)} stroke={dynamicColor} strokeWidth={scale(4)} />);
  if (incorrectGuesses > 4) partsToDraw.push(<line key="leg1" x1={scale(170)} y1={scale(170)} x2={scale(140)} y2={scale(200)} stroke={dynamicColor} strokeWidth={scale(4)} />);
  if (incorrectGuesses > 5) partsToDraw.push(<line key="leg2" x1={scale(170)} y1={scale(170)} x2={scale(200)} y2={scale(200)} stroke={dynamicColor} strokeWidth={scale(4)} />);

  return (
    <svg width={scale(250)} height={scale(250)} viewBox={`0 0 ${scale(250)} ${scale(250)}`}>
      {partsToDraw}
    </svg>
  );
};

export default HangmanDrawing;