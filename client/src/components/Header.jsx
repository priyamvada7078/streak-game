function Header({ username, streak, onLogout }) {
  const initial = username ? username.charAt(0).toUpperCase() : "?";

  return (
    <header className="header">
      <div className="header-logo">STREAK 🔥</div>

      <div className="profile-section">
        <div className="streak-mini">
          <span>🔥</span>
          <div>
            <small>Current streak</small>
            <strong>{streak || 0}</strong>
          </div>
        </div>

        <div className="profile">
          <div className="avatar">{initial}</div>

          <span className="profile-name">{username}</span>

          <button
            className="logout-button"
            onClick={onLogout}
            type="button"
          >
            Switch player
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;