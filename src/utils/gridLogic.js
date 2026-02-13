/**
 * Grid Logic Utilities
 * Pure functions for managing the 3x3 recursive grid state.
 * All business logic is separated from UI components.
 */

const GRID_SIZE = 3;
const LOCK_THRESHOLD = 15;

/**
 * Creates a fresh 3x3 grid initialized to zeros.
 * @returns {number[][]} 3x3 array of zeros
 */
export function createInitialGrid() {
    return Array.from({ length: GRID_SIZE }, () =>
        Array.from({ length: GRID_SIZE }, () => 0)
    );
}

/**
 * Checks if a cell value meets the lock threshold.
 * @param {number} value - Cell value
 * @returns {boolean}
 */
export function isLocked(value) {
    return value >= LOCK_THRESHOLD;
}

/**
 * Checks if a cell can be clicked (not locked).
 * @param {number[][]} grid - Current grid state
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @returns {boolean}
 */
export function canClick(grid, row, col) {
    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return false;
    return !isLocked(grid[row][col]);
}

/**
 * Deep clones a grid to ensure immutable updates.
 * @param {number[][]} grid
 * @returns {number[][]}
 */
export function cloneGrid(grid) {
    return grid.map((row) => [...row]);
}

/**
 * Rule A: Right Neighbor Rule
 * If the clicked cell's NEW value is divisible by 3,
 * decrement the right neighbor by 1.
 * Skips if the cell is in the last column or the target is locked.
 *
 * @param {number[][]} grid - Mutable grid (already cloned)
 * @param {number} row - Row of clicked cell
 * @param {number} col - Column of clicked cell
 * @returns {{ applied: boolean, target: [number, number] | null }}
 */
export function applyRippleA(grid, row, col) {
    const value = grid[row][col];
    const targetCol = col + 1;

    // Guard: divisible by 3, not in last column, target not locked
    if (
        value % 3 === 0 &&
        value !== 0 &&
        targetCol < GRID_SIZE &&
        !isLocked(grid[row][targetCol])
    ) {
        grid[row][targetCol] -= 1;
        return { applied: true, target: [row, targetCol] };
    }
    return { applied: false, target: null };
}

/**
 * Rule B: Bottom Neighbor Rule
 * If the clicked cell's NEW value is divisible by 5,
 * increment the bottom neighbor by 2.
 * Skips if the cell is in the last row or the target is locked.
 *
 * @param {number[][]} grid - Mutable grid (already cloned)
 * @param {number} row - Row of clicked cell
 * @param {number} col - Column of clicked cell
 * @returns {{ applied: boolean, target: [number, number] | null }}
 */
export function applyRippleB(grid, row, col) {
    const value = grid[row][col];
    const targetRow = row + 1;

    // Guard: divisible by 5, not in last row, target not locked
    if (
        value % 5 === 0 &&
        value !== 0 &&
        targetRow < GRID_SIZE &&
        !isLocked(grid[targetRow][col])
    ) {
        grid[targetRow][col] += 2;
        return { applied: true, target: [targetRow, col] };
    }
    return { applied: false, target: null };
}

/**
 * Processes a full click action:
 * 1. Increments the clicked cell by 1
 * 2. Applies Rule A (right neighbor ripple)
 * 3. Applies Rule B (bottom neighbor ripple)
 *
 * @param {number[][]} grid - Current grid state (immutable — will be cloned)
 * @param {number} row - Clicked row
 * @param {number} col - Clicked column
 * @returns {{ newGrid: number[][], rippleTargets: [number, number][], rippleCount: number }}
 */
export function processClick(grid, row, col) {
    if (!canClick(grid, row, col)) {
        return { newGrid: grid, rippleTargets: [], rippleCount: 0 };
    }

    const newGrid = cloneGrid(grid);
    const rippleTargets = [];
    let rippleCount = 0;

    // Step 1: Increment clicked cell
    newGrid[row][col] += 1;

    // Step 2: Apply ripple rules sequentially
    const rippleA = applyRippleA(newGrid, row, col);
    if (rippleA.applied) {
        rippleTargets.push(rippleA.target);
        rippleCount++;
    }

    const rippleB = applyRippleB(newGrid, row, col);
    if (rippleB.applied) {
        rippleTargets.push(rippleB.target);
        rippleCount++;
    }

    return { newGrid, rippleTargets, rippleCount };
}

/**
 * Checks if all cells are locked (win condition).
 * @param {number[][]} grid
 * @returns {boolean}
 */
export function isGameWon(grid) {
    return grid.every((row) => row.every((cell) => isLocked(cell)));
}

/**
 * Returns positions of all locked cells.
 * @param {number[][]} grid
 * @returns {[number, number][]}
 */
export function getLockedCells(grid) {
    const locked = [];
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (isLocked(grid[r][c])) {
                locked.push([r, c]);
            }
        }
    }
    return locked;
}

/**
 * Gets the visual state of a cell for styling decisions.
 * @param {number} value
 * @returns {'locked' | 'odd' | 'even'}
 */
export function getCellState(value) {
    if (isLocked(value)) return "locked";
    if (value % 2 !== 0) return "odd";
    return "even";
}

export { GRID_SIZE, LOCK_THRESHOLD };
