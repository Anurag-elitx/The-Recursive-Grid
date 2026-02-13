"use client";

import { useEffect } from "react";
import { useGridState } from "@/hooks/useGridState";
import Header from "@/components/Header";
import Grid from "@/components/Grid";
import GamePanel from "@/components/GamePanel";
import DebugPanel from "@/components/DebugPanel";
import Footer from "@/components/Footer";

export default function Home() {
    const {
        grid,
        history,
        clicks,
        totalRipples,
        score,
        rippleTargets,
        clickedCell,
        isDarkMode,
        gameMode,
        showDebug,
        won,
        lockedCells,
        handleClick,
        undo,
        reset,
        toggleDarkMode,
        toggleGameMode,
        toggleDebug,
    } = useGridState();

    // Apply dark mode class to html element
    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);

    // Keyboard shortcut: Ctrl+D to toggle debug panel
    useEffect(() => {
        const handler = (e) => {
            if (e.ctrlKey && e.key === "d") {
                e.preventDefault();
                toggleDebug();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [toggleDebug]);

    return (
        <div className="app">
            <Header
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                gameMode={gameMode}
                toggleGameMode={toggleGameMode}
            />

            <main className="main">
                {/* Normal mode controls */}
                {gameMode === "normal" && (
                    <div className="normal-controls">
                        <button
                            className="btn btn--secondary"
                            onClick={undo}
                            disabled={history.length === 0}
                            aria-label="Undo last action"
                        >
                            ↩ Undo
                        </button>
                        <button className="btn btn--primary" onClick={reset} aria-label="Reset grid">
                            ⟳ Reset
                        </button>
                    </div>
                )}

                <GamePanel
                    gameMode={gameMode}
                    score={score}
                    clicks={clicks}
                    totalRipples={totalRipples}
                    won={won}
                    canUndo={history.length > 0}
                    onUndo={undo}
                    onReset={reset}
                />

                <Grid
                    grid={grid}
                    onCellClick={handleClick}
                    clickedCell={clickedCell}
                    rippleTargets={rippleTargets}
                />

                {/* Rules legend */}
                <div className="rules-legend">
                    <h3 className="rules-legend__title">Ripple Rules</h3>
                    <div className="rules-legend__items">
                        <div className="rule-item">
                            <span className="rule-item__badge rule-item__badge--a">A</span>
                            <span>Value ÷ 3 → Right neighbor −1</span>
                        </div>
                        <div className="rule-item">
                            <span className="rule-item__badge rule-item__badge--b">B</span>
                            <span>Value ÷ 5 → Bottom neighbor +2</span>
                        </div>
                        <div className="rule-item">
                            <span className="rule-item__badge rule-item__badge--lock">🔒</span>
                            <span>Value ≥ 15 → Cell locks permanently</span>
                        </div>
                    </div>
                </div>
            </main>

            <DebugPanel
                showDebug={showDebug}
                toggleDebug={toggleDebug}
                grid={grid}
                clicks={clicks}
                totalRipples={totalRipples}
                lockedCells={lockedCells}
                history={history}
            />

            <Footer />
        </div>
    );
}
