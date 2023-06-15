"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./game.module.css";
import { mejorJug, jugadas } from "@/lib/gameLogic";

export default function Game() {
  const initialState = {
    stones: undefined,
    currentPlayer: "H",
    scores: {
      H: 0,
      C: 0,
    },
  };

  const [animation, setAnimation] = useState(true);
  const [animationOver, setAnimationOver] = useState(false); // New state to keep track of animation
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setGameState] = useState(initialState);
  const [winner, setWinner] = useState("");
  const [initialStoneCount, setInitialStoneCount] = useState(0);

  // Animation effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimation(!animation);
      setAnimationOver(true); // Set animation over to true when animation is done
    }, 3225);
    return () => clearTimeout(timeout);
  }, [animation]);

  // New game handler
  const handleNewGame = useCallback(() => {
    setGameStarted(true);
    setGameState({
      ...initialState,
      stones: initialStoneCount,
    });
    setWinner("");
  }, [initialState, initialStoneCount]);

  // Handle player hold
  const handlePlayerHold = useCallback(
    (option: any) => {
      if (gameState.stones <= 0) {
        return;
      }
      const newStonesCount = gameState.stones - option;
      const newScore = gameState.scores.H + option;
      setGameState({
        ...gameState,
        stones: newStonesCount,
        currentPlayer: "C",
        scores: {
          ...gameState.scores,
          H: newScore,
        },
      });
    },
    [gameState]
  );

  // Handle computer turn
  const handleComputerTurn = useCallback(() => {
    if (gameState.stones > 0) {
      const bestMove = mejorJug(["C", gameState.stones]);
      const newStonesCount = gameState.stones - bestMove;
      const newScore = gameState.scores.C + bestMove;
      setGameState({
        ...gameState,
        stones: newStonesCount,
        currentPlayer: "H",
        scores: {
          ...gameState.scores,
          C: newScore,
        },
      });
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState.currentPlayer === "C") {
      const timeoutId = setTimeout(handleComputerTurn, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [gameState.currentPlayer, handleComputerTurn]);

  // Check for winner
  useEffect(() => {
    if (gameState.stones <= 0) {
      const winner =
        gameState.scores.H > gameState.scores.C ? "Human" : "Computer";
      setWinner(winner);
    }
  }, [gameState.scores, gameState.stones, gameState.currentPlayer]);

  // Game not started
  if (!gameStarted) {
    return (
      <main className="welcome--container">
        {animationOver ? (
          // If animation is over show this
          <div className="animation welcome--content">
            <div className="navbar--container">
              <div className="logo">
                <img
                  className="logotype--img"
                  src="/unrc-logo.png"
                  alt={"Programación Avanzada"}
                />
                <h2>Programación Avanzada</h2>
              </div>
              <h2>Año 2023</h2>
            </div>
            <div className="hero">
              <img className="bot" src="/bot.png" alt="Bot" />
              <div className="hero--content">
                <p className="welcome-text">
                  Preparate para desafiar a la Inteligencia Artificial 🧠
                </p>

                <input
                  className="input-stones"
                  value={initialStoneCount || ""}
                  onChange={(e) => setInitialStoneCount(Number(e.target.value))}
                  placeholder="Piedras inciciales"
                  style={{
                    color: initialStoneCount ? "white" : "#AFAFAF",
                  }}
                />

                <button onClick={handleNewGame} className="button">
                  Empieza ahora
                </button>
              </div>
            </div>
            <div className="footer">
              <img className="arrow" src="/code-left.png" alt="Code left" />
              <div className="avatar">
                <img className="avatar--img" src="/brunito.png" alt="Avatar" />
                <div className="name">Conti, Bruno Emanuel</div>
              </div>
              <div className="avatar">
                <img className="avatar--img" src="/joaco.png" alt="Avatar" />
                <div className="name">Mezzano, Joaquin Nicolas</div>
              </div>
              <div className="avatar">
                <img className="avatar--img" src="/tomi.png" alt="Avatar" />
                <div className="name">Rodeghiero, Tomás</div>
              </div>
              <img className="arrow" src="/code-right.png" alt="Code right" />
            </div>
            ;
          </div>
        ) : (
          // Else show the animation text
          <p
            className={
              animation ? styles.welcomeTextAnimation : styles.welcomeText
            }
          >
            Bienvenido al juego de piedras 🪨
          </p>
        )}
      </main>
    );
  }

  // Game has started, render the main game UI
  return (
    <main>
      <section
        className={`${styles.player} ${styles["player--0"]} ${
          gameState.currentPlayer === "H" ? styles.active : styles.inactive
        } ${winner === "Human" ? styles.winner : ""}`}
      >
        <h2 className={styles.name} id="name">
          Human
        </h2>
        <p className={styles.score} id="score--0">
          {gameState.scores.H}
        </p>

        <div className={styles.current}>
          <p className={styles["current-label"]}>Stones to take</p>
          <div className={styles.buttons}>
            {jugadas.map((option) => (
              <button
                key={option}
                className={styles.button}
                onClick={() => {
                  if (gameState.stones > 0) {
                    handlePlayerHold(option);
                  }
                }}
                disabled={gameState.stones <= 0}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section
        className={`${styles.player} ${styles["player--1"]} ${
          gameState.currentPlayer === "C" ? styles.active : styles.inactive
        } ${winner === "Computer" ? styles.winner : ""}`}
      >
        <h2 className={styles.name} id="name">
          Computer
        </h2>
        <p className={styles.score} id="score--1">
          {gameState.scores.C}
        </p>
        <div className={styles.current}>
          <p className={styles["current-label"]}>Stones to take</p>
          <div className={styles.buttons}>
            {jugadas.map((option) => (
              <button key={option} className={styles.button} disabled={true}>
                {option}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.dice}>
        <div className={styles.stones}>
          {gameState.stones >= 0 &&
            [...Array(gameState.stones)].map((_, index) => (
              <div key={index} className={styles.stone}>
                🪨
              </div>
            ))}
        </div>
      </div>

      <button
        className={`${styles.btn} ${styles["btn--new"]}`}
        onClick={handleNewGame}
      >
        🔄 New game
      </button>
    </main>
  );
}
