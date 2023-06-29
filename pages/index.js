import { useEffect, useState, useCallback } from "react";
import {
  VictoryChart,
  VictoryScatter,
  VictoryTheme,
  VictoryTooltip,
  VictoryAxis,
} from "victory";
import { addScore, getScores } from "../lib/firestore";

export default function Home() {
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);
  const [gameActive, setGameActive] = useState(false);
  const [rounds, setRounds] = useState(0);
  const [scoresData, setScoresData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displayScore, setDisplayScore] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [roundScores, setRoundScores] = useState([]);

  const startGame = () => {
    if (username === "" || age === "") {
      setError("Username and age are required.");
      return;
    }
    setError(null);
    setGameActive(true);
  };

  const dismissBall = useCallback(() => {
    let elapsedTime = Date.now() - startTime;
    setScore(elapsedTime);
    addScore(username, elapsedTime, age);
    setScoresData((prevData) => [
      ...prevData,
      { x: age, y: elapsedTime, id: Date.now() },
    ]);
    setRounds((prevRounds) => prevRounds + 1);
    setDisplayScore(true);
  }, [username, age, startTime]);

  const handleKeyPress = useCallback(
    (event) => {
      dismissBall();
    },
    [dismissBall]
  );

  const endGame = () => {
    setGameActive(false);
    setRounds(10);
    setGameEnded(true);
  };

  const resetGame = () => {
    setUsername("");
    setAge("");
    setScore(null);
    setGameActive(false);
    setRounds(0);
    setScoresData([]);
    setDisplayScore(false);
    setGameEnded(false);
  };

  useEffect(() => {
    if (username && gameActive) {
      setLoading(true);
      getScores(username)
        .then((fetchedScores) => {
          setScoresData(
            fetchedScores.map((score) => ({ ...score, id: score.id }))
          );
        })
        .catch((error) => setError(`Failed to fetch scores: ${error.message}`))
        .finally(() => setLoading(false));
    }
  }, [username, gameActive]);

  useEffect(() => {
    let timeoutId;
    if (gameActive && rounds < 10) {
      let redBall = document.getElementById("redBall");
      setStartTime(Date.now());
      redBall.style.display = "none";
      setDisplayScore(false);
      timeoutId = setTimeout(() => {
        redBall.style.display = "block";
        redBall.onclick = () => {
          let elapsedTime = Math.min(Date.now() - startTime, 999);
          setRoundScores((prevScores) => [...prevScores, elapsedTime]);
          setScore(elapsedTime);
          addScore(username, elapsedTime, age);
          setScoresData((prevData) => [
            ...prevData,
            { x: age, y: elapsedTime, id: Date.now() },
          ]);
          redBall.style.display = "none";
          setDisplayScore(true);
          setRounds((prevRounds) => prevRounds + 1);
        };
      }, Math.random() * (5000 - 2000) + 2000);
    } else if (rounds === 10) {
      setGameActive(false);
      setGameEnded(true);
      console.log("Game ends because rounds are 10");
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [username, age, gameActive, startTime, scoresData, rounds]);

  useEffect(() => {
    if (gameActive) {
      window.addEventListener("keypress", handleKeyPress);
    }

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [gameActive, handleKeyPress]);

  // The useEffect for managing the disappearance of the reaction time
  useEffect(() => {
    if (displayScore) {
      console.log("Display Score is true");
      const timer = setTimeout(() => {
        setDisplayScore(false);
        console.log("Display Score is set to false");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [displayScore]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 className="title">Reaction Game</h1>
      <h3 className="subtitle">Brain reaction time to a visual stimulus</h3>
      <div className="inputContainer">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name..."
          className="input"
        />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter your age..."
          className="input"
        />
        {error && <p>{error}</p>}
        {!gameActive && rounds < 10 && (
          <button onClick={startGame} className="button" disabled={loading}>
            Start
          </button>
        )}
        {gameActive && (
          <button onClick={endGame} className="button">
            End Game
          </button>
        )}
        {!gameActive && rounds === 10 && (
          <button onClick={resetGame} className="button">
            Play Again
          </button>
        )}
      </div>
      {!gameEnded && <div id="redBall" className="redBall"></div>}
      {roundScores.map((score, index) => (
        <p key={index}>
          Round {index + 1} : {score}ms
        </p>
      ))}
      {!loading && gameEnded && scoresData.length > 0 && (
        <VictoryChart
          theme={VictoryTheme.material}
          domain={{ x: [25, 105], y: [100, 999] }}
          width={800}
          height={400}
          padding={{ top: 20, bottom: 100, left: 100, right: 100 }}
        >
          <VictoryScatter
            style={{ data: { fill: "#0000ff" } }}
            size={7}
            data={scoresData.map((score) => ({ x: score.x, y: score.y }))}
            labels={({ datum }) => `Age: ${datum.x}, Time: ${datum.y}ms`}
            labelComponent={<VictoryTooltip />}
          />
          <VictoryAxis
            tickValues={[25, 35, 45, 55, 65, 75, 85, 95, 100, 105]}
            label="Age (Years)"
          />
          <VictoryAxis
            dependentAxis
            tickValues={[100, 200, 300, 400, 500, 600, 700, 800, 900, 999]}
            label="Reaction Time (ms)"
            style={{
              axisLabel: { padding: 50 },
            }}
          />
        </VictoryChart>
      )}
    </div>
  );
}
