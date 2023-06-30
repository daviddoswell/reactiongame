import { useEffect, useState, useCallback } from "react";
import ScatterPlot from "@/components/ScatterPlot";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import { addScore, getScores, listenScores } from "../lib/firestore";

export default function Home() {
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
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
    addScore(username, elapsedTime, age, gender);
    setScoresData((prevData) => [
      ...prevData,
      { x: age, y: elapsedTime, id: Date.now() },
    ]);
    setRounds((prevRounds) => prevRounds + 1);
    setDisplayScore(true);
  }, [username, age, gender, startTime]);

  const handleKeyPress = useCallback(() => {
    dismissBall();
  }, [dismissBall]);

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
          let elapsedTime = Math.min(Date.now() - startTime);
          setRoundScores((prevScores) => [...prevScores, elapsedTime]);
          setScore(elapsedTime);
          addScore(username, elapsedTime, age, gender);
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
  }, [username, age, gender, gameActive, startTime, scoresData, rounds]);

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

  useEffect(() => {
    const unsubscribe = listenScores((newScores) => {
      setScoresData(newScores);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "50px",
      }}
    >
      <NavBar />
      <div>
        <Image src="/img/brain.svg" alt="Brain Image" width={75} height={75} />
      </div>
      <h1 className="title">Brain Game</h1>
      <h3 className="subtitle">
        Reaction-time software based on a visual stimulus
        <br />
        to detect early onset of Alzheimer&apos;s disease.
      </h3>
      <div className="inputContainer">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Name"
          className="input"
        />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
          className="input"
        />
        <div>
          <input
            type="radio"
            id="male"
            name="gender"
            value="male"
            onChange={(e) => setGender(e.target.value)}
          />
          <label for="male">Male</label>
          <input
            type="radio"
            id="female"
            name="gender"
            value="female"
            onChange={(e) => setGender(e.target.value)}
          />
          <label for="female">Female</label>
        </div>

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
      {!loading && gameEnded && scoresData.length > 0 && (
        <div style={{ marginTop: "50px" }}>
          <ScatterPlot
            data={scoresData.map((score) => ({
              age: score.age,
              score: score.score,
              gender: score.gender,
            }))}
            width={600}
            height={400}
          />
        </div>
      )}
    </div>
  );
}
