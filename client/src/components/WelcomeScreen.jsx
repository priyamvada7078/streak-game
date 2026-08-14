function WelcomeScreen({ username, setUsername, onContinue }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onContinue();
  };

  return (
    <main className="welcome-page">
      <section className="welcome-card">
        <div className="logo">STREAK 🔥</div>

        <div className="welcome-content">
          <p className="eyebrow">A DAILY NUMBER GAME</p>

          <h1>One number. One guess. Every day.</h1>

          <p className="welcome-description">
            Guess today's secret number and build your streak. Miss a day or
            guess wrong, and your streak resets.
          </p>

          <form onSubmit={handleSubmit} className="username-form">
            <label htmlFor="username">Choose your player name</label>

            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={30}
              autoComplete="off"
            />

            <button type="submit">Start playing →</button>
          </form>

          <p className="username-note">
            Your progress is connected to this username.
          </p>
        </div>
      </section>
    </main>
  );
}

export default WelcomeScreen;