const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver;

suite("UnitTests", () => {
  const validString =
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  const invalidString = "stringthatisnot81charactersandhassomeothers....";

  suite("Validate String tests", () => {
    // Logic handles a valid puzzle string of 81 characters
    // Logic handles a puzzle string with invalid characters (not 1-9 or .)
    // Logic handles a puzzle string that is not 81 characters in length
  });
  suite("Validate Row tests", () => {
    // Logic handles a valid row placement
    // Logic handles an invalid row placement
  });
  suite("Validate Column tests", () => {
    // Logic handles a valid column placement
    // Logic handles an invalid column placement
  });
  suite("Validate Region tests", () => {
    // Logic handles a valid region (3x3 grid) placement
    // Logic handles an invalid region (3x3 grid) placement
  });
  suite("Solver tests", () => {
    // Valid puzzle strings pass the solver
    // Invalid puzzle strings fail the solver
    // Solver returns the expected solution for an incomplete puzzle
  });
});
