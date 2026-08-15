// Purely decorative — used on the welcome page only. Renders a static
// 1-10 grid and never calls onGuess or touches the API.
function PuzzlePreview({ label, variant = "dark", highlighted = 7 }) {
  return (
    <div className={`puzzle-preview puzzle-preview-${variant}`} aria-hidden="true">
      {label && <p className="puzzle-preview-label">{label}</p>}
      <div className="puzzle-preview-grid">
        {Array.from({ length: 10 }, (_, i) => {
          const number = i + 1;
          return (
            <span
              key={number}
              className={`puzzle-preview-cell ${
                number === highlighted ? "is-active" : ""
              }`}
            >
              {number}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default PuzzlePreview;
