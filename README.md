<div align="center">
  <br />
  <h1 align="center">Hangman Game Module</h1>

  <p align="center">
    A classic word-guessing game for the <a href="https://github.com/yusufinann/GameHub">GameHub Platform</a>! 🔠
    <br />
    Challenge friends or play solo in this engaging and interactive Hangman experience.
  </p>

  <p align="center">
    Part of the <strong>GameHub</strong> - Web-Based Live Game and Social Interaction Platform 🚀
  </p>
</div>

---

## ✨ Overview

**Hangman Game** is a captivating module designed to be seamlessly integrated into the **GameHub** Lerna monorepo. It offers the classic word-guessing experience, enhanced with real-time multiplayer capabilities, interactive sounds, and robust game management features, all within the vibrant GameHub ecosystem.

Players can enjoy Hangman in **single-player mode** to test their wits or dive into **online multiplayer lobbies** for a turn-based, real-time competitive or collaborative experience with friends.

This module leverages the core functionalities of the GameHub platform, including lobby creation, user authentication, real-time communication via WebSockets, and in-game chat.

---

## 🚀 Key Features

*   **✍️ Classic Word-Guessing Fun:** The beloved Hangman game mechanics you know and love.
*   **👤 Single Player Mode:** Test your vocabulary and deduction skills on your own.
*   **👥 Real-Time Multiplayer:**
    *   Play competitively or collaboratively with friends in GameHub lobbies.
    *   Turn-based gameplay ensures everyone gets a chance.
    *   See opponents' Hangman figure progress or guessed letters in real-time.
*   **⚡ Synchronized Experience:** All players in a multiplayer game see the game state (word progression, guessed letters, Hangman figure) update simultaneously thanks to WebSockets.
*   **⌨️ Interactive Game Area:**
    *   **Word Display:** Hidden word represented by blanks.
    *   **Hangman Figure:** Watch the iconic figure build with each incorrect guess.
    *   **Letter Selection:** Easy-to-use on-screen keyboard or input for guessing letters.
    *   **Guessed Letters:** Track correct and incorrect letters already chosen.
*   **💬 In-Game Chat:** Strategize, tease, or cheer with the integrated chat, complete with emoji support (powered by GameHub).
*   **🔊 Engaging Sound Effects:** Interactive sounds for correct/incorrect guesses, game events, wins, and losses, enhancing the player experience.
*   **👑 Host Controls:**
    *   Initiate the game within a GameHub lobby.
    *   Set game parameters (e.g., word category, difficulty level if applicable).
*   **🏆 Clear Win/Loss Conditions:** Know instantly if you've guessed the word or if the Hangman is complete.
*   **📊 Game Results & History:** Game outcomes are recorded in the player's GameHub profile.

---

## 🛠️ Installation (within GameHub Lerna Monorepo)

The Hangman game module is designed to be a package within the `GameHub` Lerna monorepo structure.

1.  **Navigate to your GameHub project's `packages` directory:**
    ```bash
    cd /path/to/your/GameHub/packages
    ```

2.  **Clone the Hangman game repository:**
    ```bash
    git clone https://github.com/yusufinann/hangman-game.git
    ```
    This will create a `hangman-game` folder inside your `packages` directory.

3.  **Bootstrap the GameHub project:**
    Navigate back to the root directory of your `GameHub` project and run:
    ```bash
    # If using Yarn (as per GameHub's main README)
    yarn install
    # Or, if Lerna is used directly for bootstrapping
    # lerna bootstrap
    ```
    This will link the `hangman-game` package with the rest of the GameHub monorepo.

---

## 📖 How to Play Hangman

The objective is to guess a secret word before the Hangman figure is fully drawn.

1.  A **secret word** is chosen by the game (or host, depending on settings), represented by a series of blank spaces – one for each letter.
2.  Players take turns (in multiplayer) or proceed (in single player) to **guess letters** they believe are in the word.
3.  **Correct guesses** will reveal the letter in all its position(s) in the word.
4.  **Incorrect guesses** will add a part to the Hangman drawing (e.g., head, body, arm).
5.  You **win** by guessing all the letters in the word before the Hangman figure is completed. You **lose** if the figure is fully drawn before the word is guessed.

---

## ⚙️ Game Rules & Lobby Validations (Integrated with GameHub)

The Hangman game adheres to the following rules and validations within the GameHub lobby system:

*   **Starting a Game:**
    *   The lobby host initiates the Hangman game.
    *   **Validation:** To start a new game, neither the host nor any other member currently in the lobby can be actively participating in another ongoing game session.

*   **During an Active Game:**
    *   **No New Entrants:** If a Hangman game is in progress within a lobby, new users attempting to join that specific lobby will be notified that they cannot enter until the current game concludes.
    *   **Player Leaving Lobby:** If a player leaves the GameHub lobby while a Hangman game is active, they are considered to have **forfeited** or are **eliminated** from that specific Hangman game instance.
    *   **Host Kicking a Player:** The lobby host has the authority to remove any player from the lobby at any time.
        *   If a player is kicked during an active Hangman game, they are **eliminated** from the game and removed from the lobby.

---

## 💻 Technology Stack

The Hangman game module leverages the robust technology stack of the main **GameHub Platform**:

*   **Frontend:** React, Material UI, React Context, Axios, react-router-dom
*   **Backend Communication:** Primarily via WebSockets for real-time game state, and REST APIs (Axios) for other interactions.
*   **Real-Time Engine:** WebSockets managed by the GameHub backend (Node.js, Express).
*   **State Management:** Utilizes GameHub's state management patterns.

(For a full list of technologies used by the GameHub platform, please refer to the [main GameHub README's Technology Stack section](https://github.com/yusufinann/GameHub#technology-stack).)

---

## 🤝 Contributing

As a module of the GameHub project, contributions to the Hangman game should align with the overall contribution guidelines of the GameHub platform. Please refer to the main [GameHub repository](https://github.com/yusufinann/GameHub) for details on how to contribute, report issues, or suggest features.

<div align="center">
  <p>
    <a href="https://github.com/yusufinann/GameHub">
      <img src="https://img.shields.io/badge/Main%20Project-GameHub-blueviolet.svg?style=for-the-badge&logo=github" alt="Main Project: GameHub">
    </a>
    <a href="https://github.com/yusufinann/hangman-game">
      <img src="https://img.shields.io/badge/Game%20Module-Hangman-orange.svg?style=for-the-badge" alt="Game: Hangman">
    </a>
    <a href="https://github.com/yusufinann/hangman-game/issues"> 
      <img src="https://img.shields.io/github/issues/yusufinann/hangman-game?style=for-the-badge&logo=github&label=Issues" alt="GitHub issues for Hangman Game">
    </a>
    <a href="https://github.com/yusufinann/hangman-game/pulls"> 
      <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge&logo=git" alt="PRs Welcome">
    </a>
  </p>
</div>

---

<div align="center">
  <p>
    Thank you for checking out the Hangman Game module for GameHub!
  </p>
</div>
