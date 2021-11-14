const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("UnitTests", () => {
  const validString =
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  const invalidString =
    "AA9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  const shortString = "stringthatisnot81charactersandhassomeothers....";
  const longString =
    "stringthatisnot81charactersandhassomeothers...............................................";

  suite("Validate String tests", () => {
    // Logic handles a valid puzzle string of 81 characters
    test("valid puzzle string of 81 characters", () => {
      assert.isTrue(
        solver.validate(validString).valid,
        "Valid string should return true"
      );
    });
    // Logic handles a puzzle string with invalid characters (not 1-9 or .)
    test("puzzle string with invalid characters (not 1-9 or .)", () => {
      assert.isFalse(
        solver.validate(invalidString).valid,
        "Invalid characters return false"
      );
    });
    // Logic handles a puzzle string that is not 81 characters in length
    test("puzzle string that is not 81 characters", () => {
      assert.isFalse(
        solver.validate(shortString).valid,
        "Too short strings return false"
      );
      assert.isFalse(
        solver.validate(longString).valid,
        "Too long strings return false"
      );
    });
  });
  suite("Validate Row tests", () => {
    // Logic handles a valid row placement
    test("valid row placement", () => {
      assert.isTrue(
        solver.checkRowPlacement(solver.transform(validString), 1, 7),
        "Valid Row returns true"
      );
    });
    // Logic handles an invalid row placement
    test("invalid row placement", () => {
      assert.isFalse(
        solver.checkRowPlacement(solver.transform(validString), 7, 4),
        "invalid row returns false"
      );
    });
  });
  suite("Validate Column tests", () => {
    // Logic handles a valid column placement
    test("valid column placement", () => {
      assert.isTrue(
        solver.checkColPlacement(solver.transform(validString), 5, 9),
        "Valid column returns true"
      );
    });
    // Logic handles an invalid column placement
    test("invalid row placement", () => {
      assert.isFalse(
        solver.checkColPlacement(solver.transform(validString), 3, 2),
        "invalid column returns false"
      );
    });
  });
  suite("Validate Region tests", () => {
    // Logic handles a valid region (3x3 grid) placement
    test("valid column placement", () => {
      assert.isTrue(
        solver.checkRegionPlacement(solver.transform(validString), 2, 6, 6),
        "Valid region returns true"
      );
    });
    // Logic handles an invalid region (3x3 grid) placement
    test("invalid region placement", () => {
      assert.isFalse(
        solver.checkRegionPlacement(solver.transform(validString), 5, 9, 3),
        "invalid region returns false"
      );
    });
  });
  suite("Solver tests", () => {
    // Valid puzzle strings pass the solver
    test("Valid puzzle strings pass the solver", () => {
      assert.isString(
        solver.solve(validString),
        "Valid puzzle string returns solved string"
      );
    });
    // Invalid puzzle strings fail the solver
    test("Invalid puzzle strings fail the solver", () => {
      assert.isFalse(
        solver.solve(invalidString),
        "invalid puzzle string returns false"
      );
    });
    // Solver returns the expected solution for an incomplete puzzle
    test("Valid puzzle strings pass the solver", () => {
      assert.equal(
        solver.solve(validString),
        "769235418851496372432178956174569283395842761628713549283657194516924837947381625",
        "Solver returns expected solution"
      );
    });
  });
});
