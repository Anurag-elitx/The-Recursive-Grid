"use client";

import { useMemo } from "react";
import { isLocked } from "@/utils/gridLogic";

/**
 * Toggleable developer/debug panel showing internal state.
 */
export default function DebugPanel({
    showDebug,
    toggleDebug,
    grid,
    clicks,
    totalRipples,
    lockedCells,
    history,
}) {
    const gridSnapshot = useMemo(() => {
        return grid.map((row) => row.map((val) => val)).toString();
    }, [grid]);

    return (
        <>
            <button className="debug-toggle" onClick={toggleDebug} aria-label="Toggle debug panel">
                {showDebug ? "✕ Close Debug" : "⚙ Debug"}
            </button>

            {showDebug && (
                <div className="debug-panel">
                    <h3 className="debug-panel__title">Developer Panel</h3>

                    <div className="debug-panel__section">
                        <h4>Statistics</h4>
                        <div className="debug-panel__grid">
                            <span className="debug-label">Clicks:</span>
                            <span className="debug-value">{clicks}</span>
                            <span className="debug-label">Ripples:</span>
                            <span className="debug-value">{totalRipples}</span>
                            <span className="debug-label">History Size:</span>
                            <span className="debug-value">{history.length}</span>
                        </div>
                    </div>

                    <div className="debug-panel__section">
                        <h4>Locked Cells</h4>
                        {lockedCells.length === 0 ? (
                            <p className="debug-empty">None</p>
                        ) : (
                            <div className="debug-chips">
                                {lockedCells.map(([r, c]) => (
                                    <span key={`${r}-${c}`} className="debug-chip">
                                        [{r},{c}]
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="debug-panel__section">
                        <h4>Current Grid</h4>
                        <pre className="debug-pre">
                            {grid.map((row) => row.map((v) => String(v).padStart(3)).join(" ")).join("\n")}
                        </pre>
                    </div>

                    {history.length > 0 && (
                        <div className="debug-panel__section">
                            <h4>History ({history.length} states)</h4>
                            <div className="debug-history">
                                {history
                                    .slice(-3)
                                    .reverse()
                                    .map((state, idx) => (
                                        <pre key={idx} className="debug-pre debug-pre--small">
                                            {state
                                                .map((row) => row.map((v) => String(v).padStart(3)).join(" "))
                                                .join("\n")}
                                        </pre>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
