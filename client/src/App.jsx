import { useEffect, useState } from "react";
import "./index.css";
import { getPuzzle, getPlayer, submitGuess } from "./services/api";
import LoadingScreen from "./components/LoadingScreen";
import WelcomeScreen from "./components/WelcomeScreen";
import Header from "./components/Header";
import GameBoard from "./components/GameBoard";
import ResultCard from "./components/ResultCard";

function App() {
  const [username, setUsername] = useState("");

  const [savedUsername, setSavedUsername] = useState(() => {
    return localStorage.getItem("streak_username") || "";
  });

  const [puzzle, setPuzzle] = useState(null);
  const [guess, setGuess] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGame = async () => {
      setInitializing(true);
      setError("");

      try {
        const puzzleData = await getPuzzle();
        setPuzzle(puzzleData);

        const storedUsername = localStorage.getItem("streak_username");

        if (storedUsername) {
          const player = await getPlayer(storedUsername);

          if (player) {
            setPlayerData(player);

            if (player.lastPlayedDate === puzzleData.date) {
              setResult({
                correct: player.lastResult === "correct",
                streak: player.streak,
                alreadyPlayed: true,
                message: "You've already played today's challenge.",
              });
            }
          }
        }
      } catch {
        setError(
          "We couldn't reach the game server. Check your connection and try again.",
        );
      } finally {
        setInitializing(false);
      }
    };

    loadGame();
  }, []);

  const saveUsername = () => {
    const trimmedName = username.trim();

    if (!trimmedName) return;

    localStorage.setItem("streak_username", trimmedName);
    setSavedUsername(trimmedName);
    setResult(null);
    setGuess(null);
    setError("");
    fetchPlayer(trimmedName);
  };

  const fetchPlayer = async (name) => {
    try {
      const data = await getPlayer(name);

      if (!data) {
        setPlayerData(null);
        return;
      }

      setPlayerData(data);

      if (puzzle && data.lastPlayedDate === puzzle.date) {
        setResult({
          correct: data.lastResult === "correct",
          streak: data.streak,
          alreadyPlayed: true,
          message: "You've already played today's challenge.",
        });
      }
    } catch {
      console.error("Failed to fetch player data");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("streak_username");
    setSavedUsername("");
    setUsername("");
    setResult(null);
    setGuess(null);
    setPlayerData(null);
    setError("");
  };

  const handleGuess = async (number) => {
    if (!savedUsername || result || loading) return;

    setGuess(number);
    setLoading(true);
    setError("");

    try {
      const data = await submitGuess(savedUsername, number);

      setResult(data);

      setPlayerData((prev) => ({
        username: savedUsername,
        streak: data.streak,
        lastPlayedDate: puzzle.date,
        lastResult: data.correct ? "correct" : "wrong",
        firstPlayedDate: prev?.firstPlayedDate || puzzle.date,
      }));
    } catch {
      setGuess(null);
      setError("Your guess didn't go through. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const streakValue = playerData?.streak ?? result?.streak ?? 0;

  if (initializing) {
    return <LoadingScreen />;
  }

  if (!puzzle) {
    return (
      <div className="status-screen">
        <div className="status-card">
          <div className="brand-mark">STREAK</div>

          <p className="error-text">
            {error || "Something went wrong loading the game."}
          </p>

          <button
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!savedUsername) {
    return (
      <WelcomeScreen
        username={username}
        setUsername={setUsername}
        onContinue={saveUsername}
      />
    );
  }

  return (
    <div className="app">
      <Header
        username={savedUsername}
        streak={streakValue}
        lastPlayedDate={playerData?.lastPlayedDate}
        playingSince={playerData?.firstPlayedDate}
        lastResult={playerData?.lastResult}
        onLogout={handleLogout}
      />

      {error && <div className="error-banner">{error}</div>}

      {result ? (
        <ResultCard result={result} />
      ) : (
        <GameBoard
          username={savedUsername}
          puzzle={puzzle}
          guess={guess}
          loading={loading}
          streak={streakValue}
          onGuess={handleGuess}
        />
      )}
    </div>
  );
}

export default App;
