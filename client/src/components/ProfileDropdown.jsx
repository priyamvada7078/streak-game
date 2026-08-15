import { useEffect, useRef, useState } from "react";
import { FlameIcon, ChevronIcon } from "./icons";

function formatDate(dateString) {
  if (!dateString) return "—";

  try {
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

function formatLastResult(lastResult) {
  if (lastResult === "correct") return "Correct";
  if (lastResult === "wrong") return "Wrong";
  return "Not played yet";
}

function ProfileDropdown({
  username,
  streak,
  lastPlayedDate,
  playingSince,
  lastResult,
  onLogout,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const initials = username
    ? username
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((name) => name.charAt(0).toUpperCase())
        .join("")
    : "?";

  useEffect(() => {
    if (!open) return;

    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleLogoutClick = () => {
    setOpen(false);
    onLogout();
  };

  const resultTagClass =
    lastResult === "correct"
      ? "tag-correct"
      : lastResult === "wrong"
        ? "tag-wrong"
        : "";

  return (
    <div className="profile" ref={containerRef}>
      <button
        className={`profile-trigger ${open ? "open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Open player profile"
      >
        <div className="avatar" title={username}>
          {initials}
        </div>
        <span className="profile-name">{username}</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="profile-panel" role="menu">
          <div className="profile-panel-header">
            <div className="avatar large">{initials}</div>
            <div>
              <p className="profile-panel-name">{username}</p>
              <p className="profile-panel-sub">Player profile</p>
            </div>
          </div>

          <div className="profile-panel-section">
            <div className="profile-panel-row">
              <span>Current streak</span>
              <strong className="row-flame">
                <FlameIcon size={14} />
                {streak ?? 0} {streak === 1 ? "day" : "days"}
              </strong>
            </div>

            <div className="profile-panel-row">
              <span>Last played</span>
              <strong>{formatDate(lastPlayedDate)}</strong>
            </div>

            <div className="profile-panel-row">
              <span>Playing since</span>
              <strong>{formatDate(playingSince)}</strong>
            </div>

            <div className="profile-panel-row">
              <span>Last result</span>
              <strong className={resultTagClass}>
                {formatLastResult(lastResult)}
              </strong>
            </div>
          </div>

          <button
            className="logout-button full"
            onClick={handleLogoutClick}
            type="button"
            aria-label="Switch to a different player"
          >
            Switch player
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
