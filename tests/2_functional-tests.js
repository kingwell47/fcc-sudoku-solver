const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");
const { puzzlesAndSolutions } = require("../controllers/puzzle-strings");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  const validString =
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  const invalidString =
    "AA9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  const longString =
    "stringthatisnot81charactersandhassomeothers...............................................";
  const unsolvableString =
    "...........5....9...4....1.2....3.5....7.....438...2......9.....1.4...6..........";
  const unsolvableString2 =
    "..9.287..8.6..4..5..3.....46.........2.71345.........23.....5..9..4..8.7..125.3..";
  suite("POST tests to api/solve", () => {
    // Solve a puzzle with valid puzzle string: POST request to /api/solve
    test("Solve a puzzle with valid puzzle string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle: puzzlesAndSolutions[0][0],
        })
        .type("application/x-www-form-urlencoded")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.solution, puzzlesAndSolutions[0][1]);
          done();
        });
    });
    // Solve a puzzle with missing puzzle string: POST request to /api/solve
    test("Solve a puzzle with missing puzzle string:", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle: "",
        })
        .type("application/x-www-form-urlencoded")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "Required field missing");
          done();
        });
    });
    // Solve a puzzle with invalid characters: POST request to /api/solve
    test("Solve a puzzle with invalid characters:", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle: invalidString,
        })
        .type("application/x-www-form-urlencoded")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });
    // Solve a puzzle with incorrect length: POST request to /api/solve
    test("Solve a puzzle with incorrect length:", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle: longString,
        })
        .type("application/x-www-form-urlencoded")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });
    // Solve a puzzle that cannot be solved: POST request to /api/solve
    test("Solve a puzzle that cannot be solved:", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle: unsolvableString,
        })
        .type("application/x-www-form-urlencoded")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(
            res.body.error,
            "Not enough givens / multiple solutions"
          );
        });
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle: unsolvableString2,
        })
        .type("application/x-www-form-urlencoded")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "Puzzle cannot be solved");
          done();
        });
    });
  });
  suite("POST tests to api/check", () => {
    // Check a puzzle placement with all fields: POST request to /api/check
    test("Check a puzzle placement with all fields", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: "A4",
          value: 7,
        })
        .type("application/x-www-form-urlencoded")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.property(res.body, "valid");
          assert.isTrue(res.body.valid);
          done();
        });
    });
    // Check a puzzle placement with single placement conflict: POST request to /api/check
    test("Check a puzzle placement with single placement conflict", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: validString,
          coordinate: "A5",
          value: 9,
        })
        .type("application/x-www-form-urlencoded")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.property(res.body, "valid");
          assert.property(res.body, "conflict");
          assert.isFalse(res.body.valid);
          assert.isArray(res.body.conflict, "conflict should be array");
          assert.include(res.body.conflict, "row");
          assert.equal(
            res.body.conflict.length,
            1,
            "conflict should have one element"
          );

          done();
        });
    });
    // Check a puzzle placement with multiple placement conflicts: POST request to /api/check
    test("Check a puzzle placement with multiple placement conflict", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: validString,
          coordinate: "C9",
          value: 3,
        })
        .type("application/x-www-form-urlencoded")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.property(res.body, "valid");
          assert.property(res.body, "conflict");
          assert.isFalse(res.body.valid);
          assert.isArray(res.body.conflict, "conflict should be array");
          assert.include(res.body.conflict, "row");
          assert.include(res.body.conflict, "column");
          assert.equal(
            res.body.conflict.length,
            2,
            "conflict should have two elements"
          );

          done();
        });
    });
    // Check a puzzle placement with all placement conflicts: POST request to /api/check
    test("Check a puzzle placement with all placement conflict", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: validString,
          coordinate: "D7",
          value: 6,
        })
        .type("application/x-www-form-urlencoded")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.property(res.body, "valid");
          assert.property(res.body, "conflict");
          assert.isFalse(res.body.valid);
          assert.isArray(res.body.conflict, "conflict should be array");
          assert.include(res.body.conflict, "row");
          assert.include(res.body.conflict, "column");
          assert.include(res.body.conflict, "region");
          assert.equal(
            res.body.conflict.length,
            3,
            "conflict should have three elements"
          );
          done();
        });
    });

    // Check a puzzle placement with missing required fields: POST request to /api/check
    test("Check a puzzle placement with missing required fields", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: "",
          value: 7,
        })
        .type("application/x-www-form-urlencoded")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Required field(s) missing");
          done();
        });
    });
    // Check a puzzle placement with invalid characters: POST request to /api/check
    test("Check a puzzle placement with invalid characters", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: invalidString,
          coordinate: "A7",
          value: 7,
        })
        .type("application/x-www-form-urlencoded")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });
    // Check a puzzle placement with incorrect length: POST request to /api/check
    test("Check a puzzle placement with incorrect length", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: longString,
          coordinate: "A7",
          value: 7,
        })
        .type("application/x-www-form-urlencoded")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.property(res.body, "error");
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });
    // Check a puzzle placement with invalid placement coordinate: POST request to /api/check
    test("Check a puzzle placement with invalid placement coordinate", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: validString,
          coordinate: "AA",
          value: 7,
        })
        .type("application/x-www-form-urlencoded")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid coordinate");
          done();
        });
    });
    // Check a puzzle placement with invalid placement value: POST request to /api/check
    test("Check a puzzle placement with invalid placement value", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: validString,
          coordinate: "A7",
          value: "0",
        })
        .type("application/x-www-form-urlencoded")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid value");
          done();
        });
    });
  });
});
