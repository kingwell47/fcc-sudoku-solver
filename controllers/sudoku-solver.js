class SudokuSolver {
  validate(puzzleString) {
    let errorMessage = "";
    if (puzzleString.length !== 81) {
      errorMessage = "Expected puzzle to be 81 characters long";
      return { valid: false, errorMessage };
    }
    if (/[^1-9.]/g.test(puzzleString)) {
      errorMessage = "Invalid characters in puzzle";
      return { valid: false, errorMessage };
    }
    let count = 0;
    for (let i = 0; i < puzzleString.length; i++) {
      if (puzzleString[i] !== ".") count++;
    }
    if (count < 17) {
      errorMessage = "Not enough givens / multiple solutions";
      return { valid: false, errorMessage };
    }
    return { valid: true };
  }
  // https://www.geeksforgeeks.org/sudoku-backtracking-7/

  solveSuduko(grid, row, col) {
    let N = 9;
    /* If we have reached the 8th
       row and 9th column (0
       indexed matrix) ,
       we are returning true to avoid further
       backtracking       */
    if (row == N - 1 && col == N) return grid;

    // Check if column value  becomes 9 ,
    // we move to next row
    // and column start from 0
    if (col == N) {
      row++;
      col = 0;
    }

    // Check if the current position
    // of the grid already
    // contains value >0, we iterate
    // for next column
    if (grid[row][col] != 0) return this.solveSuduko(grid, row, col + 1);

    for (let num = 1; num < 10; num++) {
      // Check if it is safe to place
      // the num (1-9)  in the given
      // row ,col ->we move to next column
      if (this.isSafe(grid, row, col, num)) {
        /*  assigning the num in the current
            (row,col)  position of the grid and
            assuming our assigned num in the position
            is correct */
        grid[row][col] = num;

        // Checking for next
        // possibility with next column
        if (this.solveSuduko(grid, row, col + 1)) return grid;
      }

      /* removing the assigned num , since our
           assumption was wrong , and we go for next
           assumption with diff num value   */
      grid[row][col] = 0;
    }
    return false;
  }

  isSafe(grid, row, col, num) {
    // Check if we find the same num
    // in the similar row , we
    // return false
    for (let x = 0; x <= 8; x++) if (grid[row][x] == num) return false;

    // Check if we find the same num
    // in the similar column ,
    // we return false
    for (let x = 0; x <= 8; x++) if (grid[x][col] == num) return false;

    // Check if we find the same num
    // in the particular 3*3
    // matrix, we return false
    let startRow = row - (row % 3),
      startCol = col - (col % 3);

    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (grid[i + startRow][j + startCol] == num) return false;

    return true;
  }

  transform(puzzleString) {
    let gridArray = puzzleString.replace(/\./g, "0").split("");

    let grid = [];
    let row = [];

    for (let i = 0; i < gridArray.length; i++) {
      row = [];
      for (let j = 0; j < 9; j++) {
        row.push(parseInt(gridArray.shift()));
      }
      grid.push(row);
    }
    return grid;
  }

  transformBack(grid) {
    return grid.flat().join("");
  }

  letterToNumber(row) {
    switch (row) {
      case "A":
        return 1;
      case "B":
        return 2;
      case "C":
        return 3;
      case "D":
        return 4;
      case "E":
        return 5;
      case "F":
        return 6;
      case "G":
        return 7;
      case "H":
        return 8;
      case "I":
        return 9;
      default:
        return "none";
    }
  }

  checkPlacement(puzzleString, row, col, num) {
    let grid = this.transform(puzzleString);
    row = this.letterToNumber(row);
    col = parseInt(col);
    num = parseInt(num);
    let conflict = [];

    if (grid[row - 1][col - 1] === num) return { valid: true };
    let rowIsValid = this.checkRowPlacement(grid, row, num);
    let colIsValid = this.checkColPlacement(grid, col, num);
    let regionIsValid = this.checkRegionPlacement(grid, row, col, num);

    if (!rowIsValid) conflict.push("row");
    if (!colIsValid) conflict.push("column");
    if (!regionIsValid) conflict.push("region");

    if (conflict.length > 0) return { valid: false, conflict };
    return { valid: true };
  }

  checkRowPlacement(grid, row, num) {
    // Check if we find the same num
    // in the similar row , we
    // return false
    for (let x = 0; x <= 8; x++) if (grid[row - 1][x] == num) return false;

    return true;
  }

  checkColPlacement(grid, col, num) {
    // Check if we find the same num
    // in the similar column ,
    // we return false
    for (let x = 0; x <= 8; x++) if (grid[x][col - 1] == num) return false;

    return true;
  }

  checkRegionPlacement(grid, row, col, num) {
    // Check if we find the same num
    // in the particular 3*3
    // matrix, we return false
    row = row - 1;
    col = col - 1;

    let startRow = row - (row % 3),
      startCol = col - (col % 3);

    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (grid[i + startRow][j + startCol] == num) return false;

    return true;
  }

  solve(puzzleString) {
    if (!this.validate(puzzleString).valid) return false;
    let grid = this.transform(puzzleString);
    let solved = this.solveSuduko(grid, 0, 0);
    if (!solved) return false;
    let solvedString = this.transformBack(solved);
    return solvedString;
  }
}

module.exports = SudokuSolver;
