import { FlameIcon } from "./icons";
import ProfileDropdown from "./ProfileDropdown";

function Header({
  username,
  streak,
  lastPlayedDate,
  playingSince,
  lastResult,
  onLogout,
}) {
  return (
    <header className="header">
      <div className="header-logo">
        STREAK <FlameIcon size={16} />
      </div>

      <div className="profile-section">
        <div className="streak-mini">
          <FlameIcon size={16} />

          <div>
            <small>Current streak</small>
            <strong>{streak ?? 0}</strong>
          </div>
        </div>

        <ProfileDropdown
          username={username}
          streak={streak}
          lastPlayedDate={lastPlayedDate}
          playingSince={playingSince}
          lastResult={lastResult}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
}

export default Header;
