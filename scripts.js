document.addEventListener('DOMContentLoaded', () => {
    const sudokuGrid = document.getElementById('sudokuGrid');
    const generatePuzzleButton = document.getElementById('generatePuzzleButton');
    const solveButton = document.getElementById('solveButton');

    // Create an empty Sudoku grid
    function createGrid() {
        sudokuGrid.innerHTML = ''; // Clear existing grid
        for (let i = 0; i < 81; i++) {
            const input = document.createElement('input');
            input.classList.add('cell');
            input.type = 'text';
            input.maxLength = '1';
            input.addEventListener('input', (e) => {
                // Allow only numbers 1-9
                if (!/^[1-9]$/.test(e.target.value)) {
                    e.target.value = '';
                }
            });
            sudokuGrid.appendChild(input);
        }
    }

    // Generate a valid Sudoku puzzle
    function generateValidSudoku() {
        let board = Array.from({ length: 9 }, () => Array(9).fill(0));
        fillDiagonal(board);
        fillRemaining(board);
        removeCells(board);
        return board;
    }

    // Fill diagonal 3x3 boxes
    function fillDiagonal(board) {
        for (let i = 0; i < 9; i += 3) {
            fillBox(board, i, i);
        }
    }

    // Fill a 3x3 box
    function fillBox(board, row, col) {
        let num;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                do {
                    num = Math.floor(Math.random() * 9) + 1;
                } while (!isSafeToPlace(board, row, col, num));
                board[row + i][col + j] = num;
            }
        }
    }

    // Check if a number can be placed safely
    function isSafeToPlace(board, row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num || board[x][col] === num) {
                return false;
            }
        }
        const startRow = row - (row % 3);
        const startCol = col - (col % 3);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i + startRow][j + startCol] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    // Fill the remaining cells in the grid
    function fillRemaining(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isSafeToPlace(board, row, col, num)) {
                            board[row][col] = num;
                            if (fillRemaining(board)) {
                                return true;
                            }
                            board[row][col] = 0; // Backtrack
                        }
                    }
                    return false; // No valid number found, trigger backtracking
                }
            }
        }
        return true; // Sudoku is filled
    }

    // Remove cells to create a puzzle
    function removeCells(board) {
        let cellsToRemove = 40; // Adjust difficulty level
        while (cellsToRemove > 0) {
            let i = Math.floor(Math.random() * 9);
            let j = Math.floor(Math.random() * 9);
            if (board[i][j] !== 0) {
                board[i][j] = 0;
                cellsToRemove--;
            }
        }
    }

    // Fill the grid with the generated puzzle
    function fillGrid(puzzle) {
        const inputs = sudokuGrid.querySelectorAll('.cell');
        inputs.forEach((input, index) => {
            input.value = puzzle[Math.floor(index / 9)][index % 9] || '';
            input.disabled = puzzle[Math.floor(index / 9)][index % 9] !== 0; // Disable given cells
        });
    }

    // Solve the Sudoku puzzle
    function solveSudoku(grid) {
        let emptySpot = findEmptySpot(grid);
        if (!emptySpot) return true; // Solved

        let row = emptySpot[0];
        let col = emptySpot[1];

        for (let num = 1; num <= 9; num++) {
            if (isValid(grid, num, row, col)) {
                grid[row][col] = num;
                if (solveSudoku(grid)) return true; // Recursively attempt to solve
                grid[row][col] = 0; // Backtrack
            }
        }
        return false; // Trigger backtracking
    }

    // Find an empty spot in the grid
    function findEmptySpot(grid) {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (grid[r][c] === 0) return [r, c];
            }
        }
        return null; // No empty spots found
    }

    // Check if a number can be placed in the grid
    function isValid(grid, num, row, col) {
        // Check row
        for (let c = 0; c < 9; c++) {
            if (grid[row][c] === num) return false;
        }

        // Check column
        for (let r = 0; r < 9; r++) {
            if (grid[r][col] === num) return false;
        }

        // Check 3x3 box
        let boxRowStart = Math.floor(row / 3) * 3;
        let boxColStart = Math.floor(col / 3) * 3;
        for (let r = boxRowStart; r < boxRowStart + 3; r++) {
            for (let c = boxColStart; c < boxColStart + 3; c++) {
                if (grid[r][c] === num) return false;
            }
        }

        return true; // Valid placement
    }

    // Get current grid values
    function getGridValues() {
        const inputs = sudokuGrid.querySelectorAll('.cell');
        let grid = [];
        for (let r = 0; r < 9; r++) {
            grid[r] = [];
            for (let c = 0; c < 9; c++) {
                grid[r][c] = parseInt(inputs[r * 9 + c].value) || 0;
            }
        }
        return grid;
    }

    // Display the solution in the grid
    function displaySolution(grid) {
        const inputs = sudokuGrid.querySelectorAll('.cell');
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                inputs[r * 9 + c].value = grid[r][c] || '';
            }
        }
    }

    // Event listeners for buttons
    generatePuzzleButton.addEventListener('click', () => {
        const newPuzzle = generateValidSudoku();
        fillGrid(newPuzzle);
    });

    solveButton.addEventListener('click', () => {
        const grid = getGridValues();
        if (solveSudoku(grid)) {
            displaySolution(grid);
        } else {
            alert("No solution exists.");
        }
    });

    // Initialize grid on page load
    createGrid();
});





