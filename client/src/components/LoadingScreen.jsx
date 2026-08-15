import { FlameIcon } from "./icons";

function LoadingScreen() {
  return (
    <div className="loading">
      <div className="loading-logo">
        STREAK <FlameIcon size={20} />
      </div>
      <p>Loading today's challenge...</p>
    </div>
  );
}

export default LoadingScreen;
