"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    let valid = false;
    let conflict = [];
    if (
      !req.body.hasOwnProperty("puzzle") ||
      !req.body.hasOwnProperty("value") ||
      !req.body.hasOwnProperty("coordinate")
    ) {
      return res.send({
        error: "Required field(s) missing",
      });
    }
    if (
      req.body.puzzle.length === 0 ||
      req.body.value.length === 0 ||
      req.body.coordinate.length === 0
    ) {
      return res.send({
        error: "Required field(s) missing",
      });
    }

    let puzzle = req.body.puzzle;
    let value = req.body.value;
    const valueRegex = /^[1-9]$/;
    if (!valueRegex.test(value)) {
      return res.send({ error: "Invalid value" });
    }

    let coordinate = req.body.coordinate;
    const coordinateRegex = /^[A-I][1-9]$/;
    let isValidCoordinate = coordinateRegex.test(coordinate);
    if (!isValidCoordinate) {
      return res.send({ error: "Invalid coordinate" });
    }
    let isValid = solver.validate(puzzle);

    if (isValid.hasOwnProperty("error")) {
      return res.send(isValid);
    }

    let puzzleArray = solver.stringtoArrayPuzzle(puzzle, 0, 1);
    const columnIndex = solver.alphaToNumber(coordinate[0]);
    const index = Number(coordinate[1]) + (Number(columnIndex) - 1) * 9;
    if (puzzleArray[index - 1] !== ".") {
      puzzleArray[index - 1] = ".";
    }

    // cek row
    let rowCheck = solver.checkRowPlacement(
      puzzleArray,
      value,
      coordinate[1] - 1
    );
    let columnCheck = solver.checkColPlacement(
      puzzleArray,
      value,
      columnIndex - 1
    );
    let regionCheck = solver.checkRegionPlacement(
      puzzleArray,
      value,
      solver.coordinateToRegion(coordinate)
    );

    let result = { valid };
    if (rowCheck) {
      conflict = [...conflict, "row"];
    }
    if (columnCheck) {
      conflict = [...conflict, "column"];
    }
    if (regionCheck) {
      conflict = [...conflict, "region"];
    }
    if (conflict.length > 0) {
      result["conflict"] = conflict;
    } else {
      result.valid = true;
    }
    return res.send(result);
  });

  app.route("/api/solve").post((req, res) => {
    if (!req.body.hasOwnProperty("puzzle")) {
      return res.send({
        error: "Required field missing",
      });
    }
    const solved = solver.solve(req.body.puzzle);

    if (solved.hasOwnProperty("error"))
      return res.send({ error: solved.error });
    return res.send({ solution: solved });
  });
};
