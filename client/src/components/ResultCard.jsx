function ResultCard({ result }) {
  const isAlreadyPlayed = result.alreadyPlayed;
  const isCorrect = result.correct;

  // eslint-disable-next-line no-useless-assignment
  let title = "";
  let message = result.message;

  if (isAlreadyPlayed) {
    title = "You've already played today! 👋";
  } else if (isCorrect) {
    title = "🎉 Correct!";
  } else {
    title = "😅 Not this time!";
  }

  return (
    <main className="game-page">
      <section className={`game-card result-card ${isCorrect ? "correct" : "wrong"}`}>
        <div className="game-content">
          <p className="eyebrow">
            {isAlreadyPlayed ? "TODAY'S CHALLENGE COMPLETE" : "RESULT"}
          </p>

          <h1>{title}</h1>

          <p className="result-message">{message}</p>

          {!isAlreadyPlayed && result.answer !== undefined && (
            <div className="answer-box">
              <span>The secret number was</span>
              <strong>{result.answer}</strong>
            </div>
          )}

          <div className="result-streak">
            <span>🔥</span>
            <div>
              <small>Current streak</small>
              <strong>{result.streak || 0} days</strong>
            </div>
          </div>

          <p className="tomorrow">
            Come back tomorrow for your next challenge!
          </p>
        </div>
      </section>
    </main>
  );
}

export default ResultCard;