function GameBoard({
  username,
  puzzle,
  guess,
  loading,
  streak,
  onGuess,
}) {
  const numbers = Array.from(
    { length: puzzle.range.max - puzzle.range.min + 1 },
    (_, index) => puzzle.range.min + index
  );

  return (
    <main className="game-page">
      <section className="game-card">
        <div className="game-top">
          <div>
            <p className="eyebrow">TODAY'S CHALLENGE</p>
            <p className="date">📅 {puzzle.date}</p>
          </div>

          <div className="streak-badge">
            🔥 <strong>{streak || 0}</strong> day streak
          </div>
        </div>

        <div className="game-content">
          <p className="welcome">Hey, {username} 👋</p>

          <h1>Guess the secret number</h1>

          <p className="subtitle">
            Pick one number between{" "}
            <strong>{puzzle.range.min}</strong> and{" "}
            <strong>{puzzle.range.max}</strong>.
            <br />
            You only get <strong>one guess</strong>!
          </p>

          <div className="numbers">
            {numbers.map((number) => (
              <button
                key={number}
                type="button"
                className={`number-button ${
                  guess === number ? "selected" : ""
                }`}
                onClick={() => onGuess(number)}
                disabled={loading}
              >
                {number}
              </button>
            ))}
          </div>

          {loading && (
            <p className="guess-loading">
              Checking your guess...
            </p>
          )}

          <p className="game-note">
            Choose carefully — once you submit, that's your guess for today.
          </p>
        </div>
      </section>
    </main>
  );
}

export default GameBoard;