import { useEffect, useState } from "react";
import { intersection, isEqual, random } from "lodash";

function Sqaure({ value, playerData, onSquareClick }) {
  const mark = playerData.X.includes(value)
    ? "🌷"
    : playerData.O.includes(value)
    ? "🌻"
    : null;
  return (
    <div
      className={`square win ${mark ? "active" : ""}`}
      onClick={onSquareClick}
    >
      {mark}
    </div>
  );
}

function Board({ player, playerName, setCurrentPlayer }) {
  const [availableSquares, setAvailableSquares] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9,
  ]);
  const [playerData, setPlayerData] = useState({
    X: [],
    O: [],
  });

  const [winner, setWinner] = useState(null);
  const totalSquaresUsed = playerData?.X.length + playerData?.O.length;

  useEffect(() => {
    const lastPlayer = player === "X" ? "O" : "X";
    const isWinner = checkWinner(playerData, lastPlayer);
    if (isWinner) setWinner(lastPlayer);
  }, [playerData]);

  function handleClick(value, cp = "X") {
    if (winner) return;
    if (totalSquaresUsed === 9) return;
    if (playerData.X.includes(value) || playerData.O.includes(value)) return;
    let compValue;
    setPlayerData((prev) => ({ ...prev, [cp]: [...prev[cp], value] }));
    setAvailableSquares((as) => {
      const newVal = as.filter((f) => f !== value);
      compValue = newVal[random(1, newVal.length) - 1];
      return newVal;
    });
    cp === "X" ? setCurrentPlayer("O") : setCurrentPlayer("X");
    if (cp === "X")
      setTimeout(() => {
        handleClick(compValue, "O");
      }, 1000);
  }
  function getName(variable) {
    if (variable === "X") return playerName;
    else return "Computer";
  }

  function handleRetry() {
    setPlayerData({
      X: [],
      O: [],
    });
    setCurrentPlayer("X");
    setWinner(null);
    setAvailableSquares([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  }
  return (
    <div className="board">
      {winner && (
        <div className="confetti-container">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className="confetti-piece" />
          ))}
        </div>
      )}
      {winner || totalSquaresUsed === 9 ? (
        <div className="banner">
          {winner === "X" ? (
            <p>Congratulations, {getName(winner)}!! 🥳</p>
          ) : winner === "O" ? (
            <p>Computer won 🤖</p>
          ) : (
            <p>"It's a tie! 🤷🏼‍♀️"</p>
          )}
          <button onClick={() => handleRetry()}>
            {totalSquaresUsed === 9 ? "Retry" : "Play again"}
          </button>
        </div>
      ) : (
        <p className="banner">
          {player === "X"
            ? `Your turn, ${getName(player)}`
            : "Computer playing"}{" "}
        </p>
      )}
      <div className={`board-row ${player === "X" ? "active " : ""}`}>
        {[1, 2, 3].map((v) => (
          <Sqaure
            value={v}
            playerData={playerData}
            onSquareClick={() => handleClick(v)}
          />
        ))}
      </div>
      <div className={`board-row ${player === "X" ? "active " : ""}`}>
        {[4, 5, 6].map((v) => (
          <Sqaure
            value={v}
            playerData={playerData}
            onSquareClick={() => handleClick(v)}
          />
        ))}
      </div>
      <div className={`board-row ${player === "X" ? "active " : ""}`}>
        {[7, 8, 9].map((v) => (
          <Sqaure
            value={v}
            playerData={playerData}
            onSquareClick={() => handleClick(v)}
          />
        ))}
      </div>
    </div>
  );
}

const checkWinner = (playerData, player) => {
  const lines = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];
  let isWinner = null;

  if (playerData[player].length < 3) return false;
  else {
    let remains;
    lines.forEach((line) => {
      remains = intersection(line, playerData[player]);
      if (remains.length >= 3 && isEqual(line, remains.sort())) {
        isWinner = player;
      }
    });
  }

  return isWinner;
};
function App() {
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [playing, setPlaying] = useState(false);
  const [name, setName] = useState("");

  function handlePlay() {
    const saved = localStorage.getItem("name");
    if (!saved) {
      const name = prompt("Please enter your name", "");
      setName(name);
      localStorage.setItem("name", name);
    } else {
      setName(saved);
    }
    setPlaying(true);
  }

  return playing ? (
    <Board
      player={currentPlayer}
      playerName={name}
      setCurrentPlayer={setCurrentPlayer}
    />
  ) : (
    <button onClick={handlePlay}> Play</button>
  );
}

export default App;
