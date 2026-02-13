"use client";

/**
 * Header component with title, dark mode toggle, and game mode selector.
 */
export default function Header({
    isDarkMode,
    toggleDarkMode,
    gameMode,
    toggleGameMode,
}) {
    return (
        <header className="header">
            <div className="header__inner">
                <div className="header__brand">
                    <h1 className="header__title">
                        <span className="header__title-icon">◆</span>
                        The Recursive Grid
                    </h1>
                    <p className="header__subtitle">A ripple-based puzzle experience</p>
                </div>
                <div className="header__controls">
                    <button
                        className={`mode-toggle ${gameMode === "challenge" ? "mode-toggle--active" : ""}`}
                        onClick={toggleGameMode}
                        aria-label={`Switch to ${gameMode === "normal" ? "challenge" : "normal"} mode`}
                    >
                        <span className="mode-toggle__icon">
                            {gameMode === "challenge" ? "🏆" : "🎮"}
                        </span>
                        <span className="mode-toggle__label">
                            {gameMode === "challenge" ? "Challenge" : "Normal"}
                        </span>
                    </button>
                    <button
                        className="theme-toggle"
                        onClick={toggleDarkMode}
                        aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
                    >
                        <span className="theme-toggle__icon">
                            {isDarkMode ? "☀️" : "🌙"}
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
}
