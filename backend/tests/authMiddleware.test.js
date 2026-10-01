const assert = require("node:assert/strict");
const test = require("node:test");
const jwt = require("jsonwebtoken");

const authMiddleware = require("../src/middleware/authMiddleware");

test("auth middleware accepts a valid bearer token", () => {
  process.env.JWT_SECRET = "test-secret";
  const token = jwt.sign({ id: 7, email: "user@example.com" }, process.env.JWT_SECRET);
  const request = { headers: { authorization: `Bearer ${token}` } };
  let nextCalled = false;

  authMiddleware(request, {}, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.deepEqual(request.user, { id: 7, email: "user@example.com" });
});

test("auth middleware rejects a missing token", () => {
  let responseCode;
  let responseBody;
  const response = {
    status(code) {
      responseCode = code;
      return this;
    },
    json(body) {
      responseBody = body;
    }
  };

  authMiddleware({ headers: {} }, response, () => {});

  assert.equal(responseCode, 401);
  assert.equal(responseBody.message, "Authentication required");
});