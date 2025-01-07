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
  stringtoArrayPuzzle(puzzleString, from = 0, to = 1) {
    const oneDimensionArrayPuzzle =
      from === 0 ? puzzleString.split("") : puzzleString;
    let twoDimensionArrayPuzzle = [];
    let rowTemp = [];
    oneDimensionArrayPuzzle.forEach((value, index) => {
      rowTemp = [...rowTemp, value];
      if ((index + 1) % 9 === 0) {
        twoDimensionArrayPuzzle = [...twoDimensionArrayPuzzle, rowTemp];
        rowTemp = [];
      }
    });
    return to === 1 ? oneDimensionArrayPuzzle : twoDimensionArrayPuzzle;
  }
  getColumns(puzzleArray) {
    let columns = [];
    for (let i = 0; i < 9; i++) {
      let column = [];
      for (let j = 0; j < 9; j++) {
        column = [...column, puzzleArray[i + j * 9]];
      }
      columns = [...columns, column];
    }
    return columns;
  }
  getRegions(puzzleArray) {
    let regions = Array.from({ length: 9 }, () => []); // Create an array of 9 empty arrays

    puzzleArray.forEach((value, index) => {
      let row = Math.floor(index / 9); // Get the row index
      let col = index % 9; // Get the column index
      let region = Math.floor(row / 3) * 3 + Math.floor(col / 3); // Calculate the region index
      regions[region].push(value); // Add the value to the corresponding region
    });

    return regions; // Return the grouped regions
  }

  checkRowPlacement(puzzleArray, value, rowIndex) {
    if (value === ".") return false;
    puzzleArray = this.stringtoArrayPuzzle(puzzleArray, 1, 2);
    // console.log({ rowIndex });

    // return;
    const row = puzzleArray[rowIndex];
    const isDuplicated = row.filter((num) => num === value).length > 1;
    return isDuplicated;
  }
  // need sm

  checkColPlacement(puzzleArray, value, colIndex) {
    if (value === ".") return false;
    puzzleArray = this.getColumns(puzzleArray);
    const col = puzzleArray[colIndex];
    // console.log(colIndex);
    try {
      const isDuplicated = col.filter((num) => num === value).length > 1;
      return isDuplicated;
    } catch (error) {}
  }

  checkRegionPlacement(puzzleArray, value, regionIndex) {
    if (value === ".") return false;
    puzzleArray = this.getRegions(puzzleArray);
    // console.log({ regionIndex });

    const region = puzzleArray[regionIndex];

    const isDuplicated = region.filter((num) => num === value).length > 1;
    return isDuplicated;
  }

  solve(puzzleString) {
    const validString = this.validate(puzzleString);
    if (validString.hasOwnProperty("error")) {
      return validString;
    }
    // return puzzleArray;

    let totalGrid = 9;
    let currentRowIndex = 0;
    let currentColIndex = 0;
    let currentRegionIndex = 0;
    const puzzleArray = this.stringtoArrayPuzzle(puzzleString, 0, 1);
    // const puzzleArray = puzzleString.split("");
    for (let index = 0; index < puzzleArray.length; index++) {
      const char = puzzleArray[index];
      currentRowIndex = Math.floor(index / totalGrid) + 1;
      currentColIndex =
        (1 + index) % totalGrid > 0 ? (1 + index) % totalGrid : 9;
      const row_ = Math.floor((currentRowIndex - 1) / 3);
      const col_ = Math.floor((currentColIndex - 1) / 3);
      currentRegionIndex = col_ + 3 * row_;

      // row placement check
      let rowPlacement = this.checkRowPlacement(
        puzzleArray,
        char,
        currentRowIndex - 1
      );

      let colPlacement = this.checkColPlacement(
        puzzleArray,
        char,
        currentColIndex - 1
      );
      let regionPlacement = this.checkRegionPlacement(
        puzzleArray,
        char,
        currentRegionIndex
      );

      // row placement check
      if (colPlacement || rowPlacement || regionPlacement) {
        return { error: "Puzzle cannot be solved" };
      }
    }
    let cols = this.getColumns(puzzleArray);
    let rows = this.stringtoArrayPuzzle(puzzleString, 0, 2);
    let regions = this.getRegions(puzzleArray);
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
    return board.flat().join("");
  }
}

module.exports = SudokuSolver;
