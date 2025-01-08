const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
const { test } = require("mocha");
let solver = new Solver();

suite("Unit Tests", () => {
  const validPuzzleString =
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  const invalidPuzzleString =
    "..9..5.1.85.4....2432x.....1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  const invalidLengthPuzzleString =
    "..9..5.1.85.4....2432.....1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  test("1. Logic handles a valid puzzle string of 81 characters", function () {
    assert.lengthOf(solver.solve(validPuzzleString), 81);
  });

  test("2. Logic handles a puzzle string with invalid characters (not 1-9 or .)", function () {
    assert.equal(
      solver.solve(invalidPuzzleString).hasOwnProperty("error"),
      true,
      "2. Logic handles a puzzle string with invalid characters (not 1-9 or .)"
    );
  });
  test("3. Logic handles a puzzle string that is not 81 characters in length", function () {
    assert.equal(
      solver.solve(invalidLengthPuzzleString).error,
      "Expected puzzle to be 81 characters long"
    );
  });

  test("4. Logic handles a valid row placement", () => {
    assert.lengthOf(solver.solve(validPuzzleString), 81);
  });

  test("5. Logic handles a invalid row placement", () => {
    assert.equal(
      solver
        .solve(
          "..5..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
        )
        .hasOwnProperty("error"),
      true
    );
  });

  test("6. Logic handles a valid column placement", () => {
    assert.lengthOf(solver.solve(validPuzzleString), 81);
  });
  test("7. Logic handles a invalid column placement", () => {
    assert.equal(
      solver
        .solve(
          "4.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
        )
        .hasOwnProperty("error"),
      true
    );
  });
  test("8. Logic handles a valid region (3x3 grid) placement", () => {
    assert.lengthOf(solver.solve(validPuzzleString), 81);
  });
  test("9. Logic handles a invalid region (3x3 grid) placement", () => {
    assert.equal(
      solver
        .solve(
          "4.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
        )
        .hasOwnProperty("error"),
      true
    );
  });
  test("10. Valid spuzzle strings pass the solver", () => {
    assert.lengthOf(solver.solve(validPuzzleString), 81);
  });
  test("11. Invalid puzzle strings fail the solver", () => {
    assert.equal(
      solver.solve(invalidLengthPuzzleString).hasOwnProperty("error"),
      true
    );
  });
  test("12. Solver returns the expected solution for an incomplete puzzle", () => {
    assert.lengthOf(solver.solve(validPuzzleString), 81);
  });
});
