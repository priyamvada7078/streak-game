import { useEffect, useRef, useState } from "react";
import "./index.css";

const API_URL = "http://localhost:5000";

function getInitials(name) {
  return name.trim().slice(0, 2).toUpperCase();
}

function formatDate(dateString) {
  if (!dateString) return "—";
  try {
    const d = new Date(`${dateString}T00:00:00`);
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

function FlameIcon({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`chevron ${open ? "chevron-open" : ""}`}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

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
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  useEffect(() => {
    const loadGame = async () => {
      setInitializing(true);
      setError("");

      try {
        const puzzleResponse = await fetch(`${API_URL}/api/puzzle`);
        if (!puzzleResponse.ok) throw new Error("puzzle");
        const puzzleData = await puzzleResponse.json();
        setPuzzle(puzzleData);

        const storedUsername = localStorage.getItem("streak_username");

        if (storedUsername) {
          const playerResponse = await fetch(
            `${API_URL}/api/player/${encodeURIComponent(storedUsername)}`,
          );

          if (playerResponse.ok) {
            const player = await playerResponse.json();
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

  // Close the profile dropdown on outside click.
  useEffect(() => {
    if (!profileOpen) return;

    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileOpen]);

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
      const response = await fetch(
        `${API_URL}/api/player/${encodeURIComponent(name)}`,
      );

      if (!response.ok) {
        // New player — no record yet, so no firstPlayedDate until they guess.
        return;
      }

      const data = await response.json();
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
    setProfileOpen(false);
  };

  const handleGuess = async (number) => {
    if (!savedUsername || result || loading) return;

    setGuess(number);
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/guess`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: savedUsername,
          guess: number,
        }),
      });

      if (!response.ok) throw new Error("guess failed");

      const data = await response.json();
      setResult(data);
      setPlayerData((prev) => ({
        username: savedUsername,
        streak: data.streak,
        lastPlayedDate: puzzle.date,
        lastResult: data.correct ? "correct" : "wrong",
        // /api/guess doesn't return this — keep it if we already had it,
        // otherwise this was their very first guess ever, so it's today.
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
    return (
      <div className="status-screen">
        <div className="status-card">
          <div className="brand-mark pulse">STREAK</div>
          <div className="spinner" aria-hidden="true" />
          <p>Loading today's challenge…</p>
        </div>
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div className="status-screen">
        <div className="status-card">
          <div className="brand-mark">STREAK</div>
          <p className="error-text">
            {error || "Something went wrong loading the game."}
          </p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {savedUsername && (
        <header className="topbar">
          <div className="topbar-inner">
            <span className="brand-mark">
              STREAK <FlameIcon size={16} className="brand-flame" />
            </span>

            <div className="profile" ref={profileRef}>
              <button
                className={`profile-trigger ${profileOpen ? "open" : ""}`}
                onClick={() => setProfileOpen((o) => !o)}
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <span className="profile-streak">
                  <FlameIcon size={14} />
                  <span className="profile-streak-num">{streakValue}</span>
                </span>
                <span className="avatar">{getInitials(savedUsername)}</span>
                <span className="profile-name">{savedUsername}</span>
                <ChevronIcon open={profileOpen} />
              </button>

              {profileOpen && (
                <div className="profile-panel" role="menu">
                  <div className="profile-panel-header">
                    <span className="avatar large">
                      {getInitials(savedUsername)}
                    </span>
                    <div>
                      <p className="profile-panel-name">{savedUsername}</p>
                      <p className="profile-panel-sub">Player profile</p>
                    </div>
                  </div>

                  <div className="profile-panel-section">
                    <div className="profile-panel-row">
                      <span>Current streak</span>
                      <strong className="row-flame">
                        <FlameIcon size={14} />
                        {streakValue}
                      </strong>
                    </div>
                    <div className="profile-panel-row">
                      <span>Playing since</span>
                      <strong>{formatDate(playerData?.firstPlayedDate)}</strong>
                    </div>
                    <div className="profile-panel-row">
                      <span>Last played</span>
                      <strong>{formatDate(playerData?.lastPlayedDate)}</strong>
                    </div>
                    {playerData?.lastResult && (
                      <div className="profile-panel-row">
                        <span>Last result</span>
                        <strong className={`tag-${playerData.lastResult}`}>
                          {playerData.lastResult === "correct"
                            ? "Correct"
                            : "Missed"}
                        </strong>
                      </div>
                    )}
                  </div>

                  <button className="btn-ghost full" onClick={handleLogout}>
                    Switch player
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      <main className="app-main">
        {error && <div className="error-banner">{error}</div>}

        {!savedUsername ? (
          <div className="welcome-screen">
            <div className="welcome-brand-panel">
              <div className="welcome-brand-inner">
                <span className="brand-mark large">
                  STREAK <FlameIcon size={30} />
                </span>
                <p className="welcome-copy">
                  One secret number, one guess, every day. Build your streak
                  and come back tomorrow to keep it alive.
                </p>
                <div className="pattern-grid" aria-hidden="true">
                  {Array.from({ length: 10 }, (_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="welcome-form-panel">
              <div className="username-form">
                <p className="eyebrow">Get started</p>
                <label htmlFor="username-input">Choose a username</label>
                <input
                  id="username-input"
                  type="text"
                  placeholder="e.g. skywalker42"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveUsername();
                  }}
                  autoFocus
                />
                <button
                  className="btn-primary"
                  onClick={saveUsername}
                  disabled={!username.trim()}
                >
                  Continue
                </button>
                <p className="hint">
                  Your progress is tied to this username on this device.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="game-shell">
            <div className="game-layout">
              <section className="game-card">
                {!result ? (
                  <>
                    <p className="eyebrow">{formatDate(puzzle.date)}</p>
                    <h1>Hey {savedUsername}, guess today's number</h1>
                    <p className="subtitle">
                      {puzzle.message ||
                        `Pick a number between ${puzzle.range.min} and ${puzzle.range.max}.`}{" "}
                      You get one guess — make it count.
                    </p>

                    <div
                      className="numbers"
                      role="group"
                      aria-label="Choose a number"
                    >
                      {Array.from(
                        { length: puzzle.range.max - puzzle.range.min + 1 },
                        (_, index) => {
                          const number = puzzle.range.min + index;
                          const isSelected = guess === number;

                          return (
                            <button
                              key={number}
                              className={`number-button ${
                                isSelected ? "selected" : ""
                              } ${loading && !isSelected ? "dimmed" : ""}`}
                              onClick={() => handleGuess(number)}
                              disabled={loading}
                              aria-pressed={isSelected}
                            >
                              {isSelected && loading ? (
                                <span
                                  className="mini-spinner"
                                  aria-hidden="true"
                                />
                              ) : (
                                number
                              )}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </>
                ) : (
                  <div
                    className={`result-panel ${
                      result.alreadyPlayed
                        ? "already"
                        : result.correct
                          ? "correct"
                          : "wrong"
                    }`}
                  >
                    <p className="eyebrow">{formatDate(puzzle.date)}</p>

                    {result.alreadyPlayed ? (
                      <>
                        <h2>You've already played today</h2>
                        <p className="result-sub">
                          Come back after midnight for the next number.
                        </p>
                        <div className="result-tag">
                          Today's result:{" "}
                          <strong>
                            {result.correct ? "Correct" : "Missed"}
                          </strong>
                        </div>
                      </>
                    ) : result.correct ? (
                      <>
                        <h2>Correct!</h2>
                        <p className="result-sub">
                          {result.message || "Nice guess — that's the one."}
                        </p>
                        {typeof result.answer !== "undefined" && (
                          <div className="answer-chip">
                            Secret number: <strong>{result.answer}</strong>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <h2>Not this time</h2>
                        <p className="result-sub">
                          {result.message ||
                            "Your streak has reset — new day, new shot."}
                        </p>
                        {typeof result.answer !== "undefined" && (
                          <div className="answer-chip">
                            Secret number was: <strong>{result.answer}</strong>
                          </div>
                        )}
                      </>
                    )}

                    <div className="streak-display">
                      <FlameIcon size={26} />
                      <div>
                        <span className="streak-num">{streakValue}</span>
                        <span className="streak-label">day streak</span>
                      </div>
                    </div>

                    <p className="tomorrow">
                      See you tomorrow for the next number.
                    </p>
                  </div>
                )}
              </section>

              <aside className="stats-panel">
                <p className="eyebrow">Your stats</p>

                <div className="stats-streak">
                  <FlameIcon size={22} />
                  <div>
                    <span className="stats-streak-num">{streakValue}</span>
                    <span className="stats-streak-label">day streak</span>
                  </div>
                </div>

                <div className="stats-section">
                  <div className="profile-panel-row">
                    <span>Username</span>
                    <strong>{savedUsername}</strong>
                  </div>
                  <div className="profile-panel-row">
                    <span>Playing since</span>
                    <strong>{formatDate(playerData?.firstPlayedDate)}</strong>
                  </div>
                  <div className="profile-panel-row">
                    <span>Last played</span>
                    <strong>{formatDate(playerData?.lastPlayedDate)}</strong>
                  </div>
                  {playerData?.lastResult && (
                    <div className="profile-panel-row">
                      <span>Last result</span>
                      <strong className={`tag-${playerData.lastResult}`}>
                        {playerData.lastResult === "correct"
                          ? "Correct"
                          : "Missed"}
                      </strong>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
