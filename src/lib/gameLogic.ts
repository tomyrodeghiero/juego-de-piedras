export type Jugador = "C" | "H";
export type Estado = [Jugador, number];
export type Resultado = "CPerdio" | "CGano";

export const jugadas = [1, 3, 4];

export function otroJugador(jugador: Jugador): Jugador {
  return jugador === "C" ? "H" : "C";
}

export function hacerJugada(jugada: number, estado: Estado): Estado {
  const [jugador, piedras] = estado;
  if (!jugadas.includes(jugada) || piedras - jugada < 0) {
    throw new Error("Jugada inválida");
  }
  return [otroJugador(jugador), piedras - jugada];
}

export function evalEstado(estado: Estado): Resultado {
  const [j, k] = estado;
  if (k === 0) return j === "C" ? "CPerdio" : "CGano";

  const posibleJugs = jugadas
    .filter((i) => i <= k)
    .map((i) => [otroJugador(j), k - i] as Estado);

  if (j === "C") {
    return posibleJugs
      .map(evalEstado)
      .reduce((a, b) => (a > b ? a : b), "CPerdio");
  } else {
    return posibleJugs
      .map(evalEstado)
      .reduce((a, b) => (a < b ? a : b), "CGano");
  }
}

export function mejorJug(estado: Estado): number {
  const [jugador, piedras] = estado;
  const jugadasValidas = jugadas.filter(
    (jugada) =>
      jugada <= piedras &&
      evalEstado([otroJugador(jugador), piedras - jugada]) ===
        (jugador === "C" ? "CGano" : "CPerdio")
  );

  return jugador === "C"
    ? Math.max(...jugadasValidas)
    : Math.min(...jugadasValidas);
}

export function juegosGanadores(i: number): number[] {
  return Array.from({ length: i }, (_, x) => x + 1).filter(
    (x) => evalEstado(["H", x]) === "CGano"
  );
}
