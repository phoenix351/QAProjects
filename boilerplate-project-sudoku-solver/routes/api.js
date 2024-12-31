"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {});

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
