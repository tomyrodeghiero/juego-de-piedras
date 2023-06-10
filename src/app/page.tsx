"use client";

import { useState, useEffect } from "react";

import styles from "./game.module.css";
import { mejorJug, jugadas } from "@/lib/gameLogic";

export default function Game() {
  const [winner, setWinner] = useState("");

  const [gameState, setGameState] = useState({
    stones: 10,
    currentPlayer: "H",
    scores: {
      H: 0,
      C: 0,
    },
  });

  const handleNewGame = () => {
    setWinner("");
    setGameState({
      stones: 10,
      currentPlayer: "H",
      scores: {
        H: 0,
        C: 0,
      },
    });

    setWinner("");
  };

  const handlePlayerHold = (option: number) => {
    const { stones, scores } = gameState;

    setGameState({
      stones: stones - option,
      currentPlayer: "C",
      scores: {
        ...scores,
        H: scores.H + option,
      },
    });
  };

  const handleComputerTurn = () => {
    const { stones } = gameState;
    const bestMove = mejorJug(["C", stones]);

    setTimeout(() => {
      if (gameState.stones > 0) {
        setGameState((prevState) => ({
          stones: prevState.stones - bestMove,
          currentPlayer: "H",
          scores: {
            ...prevState.scores,
            C: prevState.scores.C + bestMove,
          },
        }));
      }

      setTimeout(() => {}, 1000);
    }, 2000);
  };

  useEffect(() => {
    if (gameState.currentPlayer === "C") {
      handleComputerTurn();
    }
  }, [gameState.currentPlayer]);

  useEffect(() => {
    if (gameState.stones <= 0) {
      const winner =
        gameState.scores.H > gameState.scores.C ? "Human" : "Computer";
      setWinner(winner);
    }
  }, [gameState]);

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
              <div key={index} className={styles.stone} />
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
