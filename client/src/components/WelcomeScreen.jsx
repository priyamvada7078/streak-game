import { FlameIcon } from "./icons";
import PuzzlePreview from "./PuzzlePreview";

function WelcomeScreen({ username, setUsername, onContinue }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim()) return;

    onContinue();
  };

  return (
    <main className="welcome-page">
      <div className="welcome-layout">
        <div className="welcome-brand-panel">
          <div className="welcome-brand-inner">
            <div className="logo">
              STREAK <FlameIcon size={22} />
            </div>

            <p className="welcome-headline">
              ONE NUMBER.
              <br />
              ONE CHANCE.
              <br />
              KEEP THE STREAK ALIVE.
            </p>

            <PuzzlePreview variant="dark" label="Puzzle preview" />
          </div>
        </div>

        <div className="welcome-form-panel">
          <div className="welcome-panel-inner">
            <div className="welcome-mini-brand">
              <span className="welcome-mini-logo">STREAK</span>
              <p className="welcome-mini-tagline">
                One number. One guess. Every day. Build a streak you don&apos;t
                want to lose.
              </p>
            </div>

            <section className="welcome-card">
              <div className="welcome-content">
                <p className="eyebrow">A DAILY NUMBER GAME</p>

                <h1>One number. One guess. Every day.</h1>

                <p className="welcome-description">
                  Guess today&apos;s secret number and build your streak. Miss a
                  day or guess wrong, and your streak resets.
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

                  <button type="submit" disabled={!username.trim()}>
                    Start playing →
                  </button>
                </form>

                <p className="username-note">
                  Your progress is connected to this username.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

export default WelcomeScreen;
