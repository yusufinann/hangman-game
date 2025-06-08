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
  <p align="center">
    <a href="#overview"><strong>Overview</strong></a>
    ·
    <a href="#key-features"><strong>Key Features</strong></a>
    ·
    <a href="#gameplay-modes--options"><strong>Gameplay Modes & Options</strong></a>
    ·
    <a href="#how-to-play"><strong>How to Play</strong></a>
    ·
    <a href="#uninterrupted-gameplay-with-redis-integration"><strong>Resilience with Redis</strong></a>
    ·
    <a href="#installation-within-gamehub"><strong>Installation</strong></a>
    ·
    <a href="#technology-stack"><strong>Technology Stack</strong></a>
  </p>
</div>

---

<h2 id="overview">✨ Overview</h2>

**Hangman Game** is a captivating module designed to be seamlessly integrated into the **GameHub** Lerna monorepo. It offers the classic word-guessing experience, enhanced with real-time multiplayer capabilities, dynamic game modes, interactive sounds, and robust game management features, all within the vibrant GameHub ecosystem.

Players can enjoy Hangman in **single-player mode** to test their wits or dive into **online multiplayer lobbies** for a turn-based, real-time competitive or collaborative experience with friends.

This module leverages the core functionalities of the GameHub platform, including lobby creation, user authentication, real-time communication via WebSockets, in-game chat, and advanced features like cross-lobby turn notifications.

---

<h2 id="key-features">🚀 Key Features</h2>

*   **✍️ Classic Word-Guessing Fun:** The beloved Hangman game mechanics you know and love.
*   **👤 Single Player Mode:** Test your vocabulary and deduction skills on your own.
*   **👥 Real-Time Multiplayer:**
    *   Play competitively or collaboratively with friends in GameHub lobbies.
    *   Turn-based gameplay ensures everyone gets a chance.
    *   See opponents' Hangman figure progress or guessed letters in real-time.
*   **🔔 Smart Turn Notifications:** In turn-based multiplayer, if it's your turn and you're not in the active game lobby, you'll receive a prominent on-screen notification. This alert allows you to instantly navigate back to the correct lobby to take your turn, ensuring you never miss out on the action, even when engaged in multiple games across different lobbies.
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
    *   Set game parameters, including language, word source, and difficulty (if applicable).
*   **🏆 Clear Win/Loss Conditions:** Know instantly if you've guessed the word or if the Hangman is complete.
*   **📊 Game Results & History:** Game outcomes are recorded in the player's GameHub profile.
*   **🔄 Concurrent Gameplay:** Players can participate in Hangman games across multiple lobbies simultaneously on the GameHub platform.

---

<h2 id="gameplay-modes--options">⚙️ Gameplay Modes & Options</h2>

Hangman in GameHub offers diverse gameplay configurations, set by the lobby host, to tailor the experience:

### 1. Language Selection

Choose the language for words and categories:

*   **🇬🇧 English Language**
    *   **Features:**
        *   Words and categories are in English.
        *   Guess letters from the English alphabet.
*   **🇹🇷 Turkish Language**
    *   **Features:**
        *   Kelimeler ve kategoriler Türkçe'dir.
        *   Türk alfabesinden harf tahmin edin (ç, ğ, ı, ö, ş, ü).

### 2. Word Source & Host Role

Determine how the word is chosen and the host's involvement:

*   **💻 Server Provides Word (Host Plays)**
    *   **Mode Key:** `server`
    *   **Style:** Cooperative
    *   **Features:**
        *   The game server randomly selects a word from a predefined category.
        *   The game host participates as a player alongside others.
        *   All players (including the host) work together to guess the server-chosen word.
*   **👤 Host Provides Word (Host Manages)**
    *   **Mode Key:** `host`
    *   **Style:** Competitive
    *   **Features:**
        *   The game host chooses a custom word and optionally a category.
        *   The game host does not play but manages the game and oversees the players.
        *   Players compete to guess the word set by the host.

*(Single-player mode typically uses server-provided words.)*

---

<h2 id="how-to-play">📖 How to Play Hangman</h2>

The objective is to guess a secret word before the Hangman figure is fully drawn.

1.  A **secret word** is chosen (by the server or host, based on game mode), represented by a series of blank spaces – one for each letter.
2.  Players take turns (in multiplayer) or proceed (in single player) to **guess letters** they believe are in the word.
3.  **Correct guesses** will reveal the letter in all its position(s) in the word.
4.  **Incorrect guesses** will add a part to the Hangman drawing (e.g., head, body, arm).
5.  You **win** by guessing all the letters in the word before the Hangman figure is completed. You **lose** if the figure is fully drawn before the word is guessed.
6.  *(Note: Players can participate in Hangman games across multiple lobbies simultaneously, with turn notifications ensuring they can jump back into the action when needed!)*

---

<h2 id="uninterrupted-gameplay-with-redis-integration">🛡️ Uninterrupted Gameplay with Redis Integration</h2>

The Hangman module, as part of GameHub, leverages the platform's sophisticated backend **Redis integration** for exceptional game stability and data persistence.

*   **Critical Game State in Redis:** Key real-time game data, such as the current word, guessed letters, incorrect guess count, player turn order, and active game timers, is meticulously managed and stored in Redis. This ensures rapid access and resilience. For technical details, refer to the GameHub backend implementation [here](https://github.com/yusufinann/GameHub/tree/master/backend).
*   **Seamless Recovery:** In the event of temporary backend disruptions or server restarts, the active Hangman game state is securely preserved in Redis. Upon backend restoration, games can resume precisely from where they left off, preventing data loss and ensuring a continuous player experience.
*   **Turn Management Persistence:** The state of whose turn it is, especially crucial in multiplayer games, is also maintained in Redis. This means even after a server hiccup, the game will correctly identify the next player, and turn notifications will function as expected.

This Redis-powered architecture provides the Hangman game with robust protection against common backend issues, delivering maximum durability and high-performance in-game interactions.

---

<h2 id="installation-within-gamehub">🛠️ Installation (within GameHub Lerna Monorepo)</h2>

The Hangman game module is designed to be a package within the `GameHub` Lerna monorepo structure.

1.  **Navigate to your GameHub project's `packages` directory:**
    ```bash
    cd /path/to/your/GameHub/packages
    ```

2.  **Clone the Hangman game repository:**
    (Assuming your Hangman module repository is `https://github.com/yusufinann/hangman-game.git` - replace if different)
    ```bash
    git clone https://github.com/yusufinann/hangman-game.git hangman-game-module
    ```
    This will create a `hangman-game-module` folder (or your chosen name) inside your `packages` directory.

3.  **Bootstrap the GameHub project:**
    Navigate back to the root directory of your `GameHub` project and run:
    ```bash
    # If using Yarn (as per GameHub's main README)
    yarn install
    # Or, if Lerna is used directly for bootstrapping
    # lerna bootstrap
    ```
    This will link the `hangman-game-module` package with the rest of the GameHub monorepo.

**Important Note:** This module is deeply integrated with the GameHub platform. For full functionality, including user authentication, lobby management, real-time communication, and Redis-backed resilience, it should be run as part of the complete GameHub system.

---

<h2 id="technology-stack">💻 Technology Stack</h2>

The Hangman game module leverages the robust technology stack of the main **GameHub Platform**:

*   **Frontend:** React, Material UI, React Context, Axios, react-router-dom
*   **Backend Communication:** Primarily via WebSockets for real-time game state, and REST APIs (Axios) for other interactions, all managed by GameHub's backend.
*   **Real-Time Engine:** WebSockets (Node.js, Express on the GameHub backend).
*   **State Management & Resilience:** Utilizes GameHub's state management patterns and Redis integration for persistence.

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
