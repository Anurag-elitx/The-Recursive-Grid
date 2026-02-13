"use client";

/**
 * Game/Challenge mode panel showing score, stats, and action buttons.
 */
export default function GamePanel({
    gameMode,
    score,
    clicks,
    totalRipples,
    won,
    canUndo,
    onUndo,
    onReset,
}) {
    if (gameMode !== "challenge") return null;

    return (
        <div className="game-panel">
            {won && (
                <div className="game-panel__win">
                    <span className="game-panel__win-icon">🎉</span>
                    <span className="game-panel__win-text">All Cells Locked — You Win!</span>
                </div>
            )}

            <div className="game-panel__stats">
                <div className="stat-card">
                    <span className="stat-card__value">{score}</span>
                    <span className="stat-card__label">Score</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card__value">{clicks}</span>
                    <span className="stat-card__label">Clicks</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card__value">{totalRipples}</span>
                    <span className="stat-card__label">Ripples</span>
                </div>
            </div>

            <div className="game-panel__actions">
                <button
                    className="btn btn--secondary"
                    onClick={onUndo}
                    disabled={!canUndo}
                    aria-label="Undo last action"
                >
                    ↩ Undo
                </button>
                <button
                    className="btn btn--primary"
                    onClick={onReset}
                    aria-label="Reset grid"
                >
                    ⟳ Reset
                </button>
            </div>
        </div>
    );
}
