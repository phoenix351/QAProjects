class SudokuSolver {
  validate(puzzleString) {
    // check if null
    if (!puzzleString) return { error: "Required field missing" };

    if (puzzleString.length === 0) return { error: "Required field missing" };

    // check length
    if (puzzleString.length !== 81)
      return { error: "Expected puzzle to be 81 characters long" };
    // check invalid chars
    const validRegex = /^[1-9.]+$/g;
    if (!validRegex.test(puzzleString))
      return { error: "Invalid characters in puzzle" };
    return { message: "SOmehow, it passed" };
  }

  checkRowPlacement(row, value) {
    if (value === ".") return false;
    const isDuplicated = row.filter((num) => num === value).length > 1;
    return isDuplicated;
  }
  // need sm

  checkColPlacement(column, value) {
    if (value === ".") return false;
    const isDuplicated = column.filter((num) => num === value).length > 1;
    return isDuplicated;
  }

  checkRegionPlacement(region, value) {
    if (value === ".") return false;
    const isDuplicated = region.filter((num) => num === value).length > 1;
    return isDuplicated;
  }

  solve(puzzleString) {
    const validString = this.validate(puzzleString);
    if (validString.hasOwnProperty("error")) {
      return validString;
    }
    const rows = [];
    const cols = [];
    const regions = [];
    let totalGrid = 9;
    let currentRowIndex = 0;
    let currentColIndex = 0;
    let currentRegionIndex = 0;
    const puzzleArray = puzzleString.split("");
    for (let index = 0; index < puzzleArray.length; index++) {
      const char = puzzleArray[index];
      currentRowIndex = Math.floor(index / totalGrid) + 1;
      currentColIndex =
        (1 + index) % totalGrid > 0 ? (1 + index) % totalGrid : 9;
      const row_ = Math.floor((currentRowIndex - 1) / 3);
      const col_ = Math.floor((currentColIndex - 1) / 3);
      currentRegionIndex = col_ + 3 * row_;
      if (!rows[currentRowIndex - 1]) {
        rows[currentRowIndex - 1] = [char];
      } else {
        rows[currentRowIndex - 1] = [...rows[currentRowIndex - 1], char];
      }
      if (!cols[currentColIndex - 1]) {
        cols[currentColIndex - 1] = [char];
      } else {
        cols[currentColIndex - 1] = [...cols[currentColIndex - 1], char];
      }
      if (!regions[currentRegionIndex]) {
        regions[currentRegionIndex] = [char];
      } else {
        regions[currentRegionIndex] = [...regions[currentRegionIndex], char];
      }
      // row placement check
      let rowPlacement = this.checkRowPlacement(
        rows[currentRowIndex - 1],
        char
      );

      let colPlacement = this.checkColPlacement(
        rows[currentRowIndex - 1],
        char
      );
      let regionPlacement = this.checkRegionPlacement(
        regions[currentRegionIndex],
        char
      );

      // row placement check
      if (colPlacement || rowPlacement || regionPlacement) {
        return { error: "Puzzle cannot be solved" };
      }
    }
    const board = [...rows];
    function backTrack(col, row) {
      // if we reached end of rows puzzle is solved
      if (row === 9) return true;

      // move to next row if we finish the columns and dont forget to reset the column index

      if (col === 9) return backTrack(0, row + 1, board);

      // skipp prefilled cells
      if (board[row][col] !== ".") return backTrack(col + 1, row);

      const region = Math.floor(row / 3) * 3 + Math.floor(col / 3);

      for (let num = 1; num <= 9; num++) {
        const char = String(num);
        if (
          !rows[row].includes(char) &&
          !cols[col].includes(char) &&
          !regions[region].includes(char)
        ) {
          board[row][col] = char;
          rows[row] = [...rows[row], char];
          cols[col] = [...cols[col], char];
          regions[region] = [...regions[region], char];
          if (backTrack(col + 1, row)) return true;
          board[row][col] = ".";
          rows[row].pop();
          cols[col].pop();
          regions[region].pop();
        }
      }
      return false;
    }
    backTrack(0, 0);
    return board.flat().join('');
  }
}

module.exports = SudokuSolver;
