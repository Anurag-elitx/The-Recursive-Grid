"use client";

import { useState, useCallback, useMemo } from "react";
import {
    createInitialGrid,
    processClick,
    isGameWon,
    getLockedCells,
    isLocked,
} from "@/utils/gridLogic";

const MAX_HISTORY = 10;

/**
 * Custom hook managing all grid state, game logic, and UI state.
 * Provides a clean API for components to interact with the grid.
 */
export function useGridState() {
    const [grid, setGrid] = useState(() => createInitialGrid());
    const [history, setHistory] = useState([]);
    const [clicks, setClicks] = useState(0);
    const [totalRipples, setTotalRipples] = useState(0);
    const [score, setScore] = useState(0);
    const [rippleTargets, setRippleTargets] = useState([]);
    const [clickedCell, setClickedCell] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [gameMode, setGameMode] = useState("normal"); // 'normal' | 'challenge'
    const [showDebug, setShowDebug] = useState(false);

    // Derived state
    const won = useMemo(() => isGameWon(grid), [grid]);
    const lockedCells = useMemo(() => getLockedCells(grid), [grid]);

    /**
     * Handle a cell click — increments value, applies ripples, tracks stats.
     */
    const handleClick = useCallback(
        (row, col) => {
            if (won) return;

            const result = processClick(grid, row, col);
            if (result.newGrid === grid) return; // Click was blocked

            // Save current grid to history (before the click)
            setHistory((prev) => {
                const newHistory = [...prev, grid];
                if (newHistory.length > MAX_HISTORY) {
                    return newHistory.slice(newHistory.length - MAX_HISTORY);
                }
                return newHistory;
            });

            setGrid(result.newGrid);
            setClicks((c) => c + 1);
            setTotalRipples((r) => r + result.rippleCount);

            // Score: 1 point per click + 2 points per ripple trigger
            setScore((s) => s + 1 + result.rippleCount * 2);

            // Track animation targets (auto-clear after animation)
            setClickedCell([row, col]);
            setRippleTargets(result.rippleTargets);

            setTimeout(() => {
                setClickedCell(null);
                setRippleTargets([]);
            }, 400);
        },
        [grid, won]
    );

    /**
     * Undo the last action.
     * Blocked if undoing would un-lock a cell that is currently locked.
     */
    const undo = useCallback(() => {
        if (history.length === 0) return;

        const previousGrid = history[history.length - 1];

        // Safety check: prevent undo if any currently locked cell would become unlocked
        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[r].length; c++) {
                if (isLocked(grid[r][c]) && !isLocked(previousGrid[r][c])) {
                    return; // Block this undo — would un-lock a cell
                }
            }
        }

        setGrid(previousGrid);
        setHistory((prev) => prev.slice(0, -1));
        setClicks((c) => Math.max(0, c - 1));
        setScore((s) => Math.max(0, s - 1));
    }, [history, grid]);

    /**
     * Reset all state to initial values.
     */
    const reset = useCallback(() => {
        setGrid(createInitialGrid());
        setHistory([]);
        setClicks(0);
        setTotalRipples(0);
        setScore(0);
        setRippleTargets([]);
        setClickedCell(null);
    }, []);

    const toggleDarkMode = useCallback(() => {
        setIsDarkMode((prev) => !prev);
    }, []);

    const toggleGameMode = useCallback(() => {
        setGameMode((prev) => (prev === "normal" ? "challenge" : "normal"));
    }, []);

    const toggleDebug = useCallback(() => {
        setShowDebug((prev) => !prev);
    }, []);

    return {
        // State
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

        // Actions
        handleClick,
        undo,
        reset,
        toggleDarkMode,
        toggleGameMode,
        toggleDebug,
    };
}
