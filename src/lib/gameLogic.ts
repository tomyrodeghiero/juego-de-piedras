type Jugador = "C" | "H";
type Estado = [Jugador, number];
type Resultado = "CPerdio" | "CGano";

export const jugadas = [1, 3, 4];

const otroJugador = (jugador: Jugador): Jugador =>
  jugador === "C" ? "H" : "C";

export const hacerJugada = (jugada: number, estado: Estado): Estado => {
  if (!jugadas.includes(jugada)) {
    throw new Error("Jugada inválida");
  }
  return [otroJugador(estado[0]), estado[1] - jugada];
};

const evalEstado = (estado: Estado): Resultado => {
  const [jugador, piedras] = estado;
  if (piedras === 0) {
    return jugador === "C" ? "CPerdio" : "CGano";
  }
  const posibleJugs = jugadas
    .filter((jugada) => jugada <= piedras)
    .map((jugada) => [otroJugador(jugador), piedras - jugada] as Estado);

  if (jugador === "C") {
    return Math.max(...posibleJugs.map(evalEstado));
  }
  if (jugador === "H") {
    return Math.min(...posibleJugs.map(evalEstado));
  }
  throw new Error("Jugada no válida");
};

export const mejorJug = (estado: Estado): number => {
  const [jugador, piedras] = estado;
  const jugadasValidas = jugadas.filter(
    (jugada) =>
      jugada <= piedras &&
      evalEstado([otroJugador(jugador), piedras - jugada]) ===
        (jugador === "C" ? "CGano" : "CPerdio")
  );
  const obtenerMejorJugada = (
    jugadas: number[],
    f: (arr: number[]) => number
  ) => (jugadas.length === 0 ? 1 : f(jugadas));

  return jugador === "C"
    ? obtenerMejorJugada(jugadasValidas, Math.max)
    : obtenerMejorJugada(jugadasValidas, Math.min);
};

const jugar = async (estado: Estado): Promise<void> => {
  console.log(`Hay ${estado[1]} piedras, cuantas saca?:`);
  const jugada = parseInt(
    prompt("Ingrese el número de piedras que desea sacar:")
  );
  const [jugador, piedras] = hacerJugada(jugada, estado);
  if (piedras === 0) {
    console.log("Gano!");
    return;
  }
  const mj = mejorJug([jugador, piedras]);
  console.log(`mi jugada: ${mj}`);
  if (piedras - mj === 0) {
    console.log("Perdió!");
    return;
  }
  await jugar(["H", piedras - mj]);
};

export const comenzarJuego = async (cant: number): Promise<void> => {
  if (cant <= 0) {
    throw new Error("La cantidad de piedras debe ser mayor que 0.");
  }
  await jugar(["H", cant]);
};

const juegosGanadores = (i: number): number[] => {
  return Array.from({ length: i }, (_, i) => i + 1).filter(
    (x) => evalEstado(["H", x]) === "CGano"
  );
};
