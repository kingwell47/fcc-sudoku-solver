"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    if (!puzzle || !coordinate || !value)
      return res.json({ error: "Required field(s) missing" });

    if (!/[1-9]/.test(value) || value.length > 1)
      return res.json({ error: "Invalid value" });

    const [row, column] = coordinate.toUpperCase().split("");
    if (
      coordinate.length !== 2 ||
      !/[A-I]/.test(row) ||
      !/[1-9]/.test(column)
    ) {
      return res.json({ error: "Invalid coordinate" });
    }

    const { valid, errorMessage } = solver.validate(puzzle);
    if (!valid) return res.json({ error: errorMessage });

    return res.json(solver.checkPlacement(puzzle, row, column, value));
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;
    if (!puzzle) return res.json({ error: "Required field missing" });
    const { valid, errorMessage } = solver.validate(puzzle);
    if (!valid) return res.json({ error: errorMessage });
    let solvedString = solver.solve(puzzle);

    if (!solvedString) return res.json({ error: "Puzzle cannot be solved" });
    return res.json({ solution: solvedString });
  });
};
