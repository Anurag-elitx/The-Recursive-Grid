"use client";

import { memo, useMemo } from "react";
import { getCellState, isLocked, LOCK_THRESHOLD } from "@/utils/gridLogic";

/**
 * Individual grid cell component.
 * Handles display, styling based on value state, and click interactions.
 */
function Box({
    value,
    row,
    col,
    onClick,
    isClicked,
    isRippleTarget,
}) {
    const cellState = useMemo(() => getCellState(value), [value]);
    const locked = useMemo(() => isLocked(value), [value]);

    const handleClick = () => {
        if (!locked) {
            onClick(row, col);
        }
    };

    const handleKeyDown = (e) => {
        if ((e.key === "Enter" || e.key === " ") && !locked) {
            e.preventDefault();
            onClick(row, col);
        }
    };

    // Build dynamic class names
    const stateClasses = {
        even: "box--even",
        odd: "box--odd",
        locked: "box--locked",
    };

    const classNames = [
        "box",
        stateClasses[cellState],
        isClicked ? "box--clicked" : "",
        isRippleTarget ? "box--ripple" : "",
        locked ? "box--disabled" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            className={classNames}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            disabled={locked}
            aria-label={`Cell ${row + 1},${col + 1}: value ${value}${locked ? " (locked)" : ""}`}
            aria-disabled={locked}
            role="gridcell"
            tabIndex={locked ? -1 : 0}
        >
            <span className="box__value">{value}</span>
            {locked && <span className="box__lock-icon">🔒</span>}
            {value > 0 && !locked && (
                <span className="box__progress">
                    <span
                        className="box__progress-bar"
                        style={{ width: `${Math.min((value / LOCK_THRESHOLD) * 100, 100)}%` }}
                    />
                </span>
            )}
        </button>
    );
}

export default memo(Box);
