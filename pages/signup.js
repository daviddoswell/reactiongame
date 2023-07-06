import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const signUpUser = () => {
    if (username === "" || password === "" || confirmPassword === "") {
      setError("Please enter your username and password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // Perform sign up operation
    // Remember to implement password encryption
    setError(null);
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <AnimatedBackground />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "50px",
          position: "relative",
          zIndex: 1,
          height: "100vh",
        }}
      >
        <NavBar />
        <div></div>
        <h1 className="title">NeuroAge Therapeutics</h1>
        <h2 className="secondTitle">
          Welcome to our cognitive interactive gaming platform <br /> to detect
          early onset of neurodegenerative diseases
        </h2>
        <h3 className="subtitle">Member Login</h3>{" "}
        <div className="inputContainer">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="input"
          />

          <button onClick={signUpUser} className="button">
            Sign Up
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
