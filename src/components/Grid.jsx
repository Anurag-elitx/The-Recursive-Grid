"use client";

import { useMemo } from "react";
import Box from "./Box";

/**
 * 3x3 Grid component that renders Box cells.
 * Handles layout and passes animation state to children.
 */
export default function Grid({
    grid,
    onCellClick,
    clickedCell,
    rippleTargets,
}) {
    // Pre-compute ripple target set for O(1) lookup
    const rippleSet = useMemo(() => {
        const set = new Set();
        rippleTargets.forEach(([r, c]) => set.add(`${r}-${c}`));
        return set;
    }, [rippleTargets]);

    return (
        <div className="grid-wrapper" role="grid" aria-label="Recursive Grid">
            <div className="grid-container">
                {grid.map((row, rowIdx) =>
                    row.map((value, colIdx) => (
                        <Box
                            key={`${rowIdx}-${colIdx}`}
                            value={value}
                            row={rowIdx}
                            col={colIdx}
                            onClick={onCellClick}
                            isClicked={
                                clickedCell &&
                                clickedCell[0] === rowIdx &&
                                clickedCell[1] === colIdx
                            }
                            isRippleTarget={rippleSet.has(`${rowIdx}-${colIdx}`)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
