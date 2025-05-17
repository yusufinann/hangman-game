import { useMemo, useCallback } from "react";


import countdownSoundSrc from "../assets/sounds/hangman-countdown.mp3";
import gameStartSoundSrc from "../assets/sounds/hangman-game-start.mp3";
import turnChangeSoundSrc from "../assets/sounds/hangman-your-turn.mp3";
import playerTimeoutSoundSrc from "../assets/sounds/hangman-timeout.mp3";
import guessCorrectSoundSrc from "../assets/sounds/hangman-guess-correct.wav";
import guessIncorrectSoundSrc from "../assets/sounds/hangman-guess-incorrect.wav";
import playerEliminatedSoundSrc from "../assets/sounds/hangman-game-lose.mp3";
import gameOverWinSoundSrc from "../assets/sounds/hangman-game-win.wav";
import gameOverLoseSoundSrc from "../assets/sounds/hangman-game-lose.mp3";

/*
 * @param {boolean} soundEnabled - Seslerin etkin olup olmadığını belirten boolean değer.
 */
const useHangmanSound = (soundEnabled) => {
  const audioElements = useMemo(() => ({
    countdown: new Audio(countdownSoundSrc),
    gameStart: new Audio(gameStartSoundSrc),
    turnChange: new Audio(turnChangeSoundSrc),
    playerTimeout: new Audio(playerTimeoutSoundSrc),
    guessCorrect: new Audio(guessCorrectSoundSrc),
    guessIncorrect: new Audio(guessIncorrectSoundSrc),
    playerEliminated: new Audio(playerEliminatedSoundSrc),
    gameOverWin: new Audio(gameOverWinSoundSrc),
    gameOverLose: new Audio(gameOverLoseSoundSrc),
  }), []);

  /**
   * @param {string} soundName 
   */
  const playSound = useCallback((soundName) => {
 
    if (soundEnabled && audioElements[soundName]) {
      audioElements[soundName].currentTime = 0;
      audioElements[soundName].play().catch((error) => {
        console.error(`Error playing ${soundName} sound:`, error);
      });
    }
  }, [audioElements, soundEnabled]); 

  return {
    playSound
  };
};

export default useHangmanSound;