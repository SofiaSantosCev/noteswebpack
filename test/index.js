const expect = require("chai").expect;
const assert = require("chai").assert;
var login = require("../src/index");
var request = require("supertest");
var signIn = login.signIn;
var signUp = login.signUp;

//let's set up the data we need to pass to the login method
const userCredentials = {
  email: "sofiasantosmelian@gmail.com",
  password: "12345678",
};

//now let's login the user before we run any tests
var authenticatedUser = request.agent(app);
before(function (done) {
  authenticatedUser
    .post("/login")
    .send(userCredentials)
    .end(function (err, response) {
      expect(response.statusCode).to.equal(200);
      expect("Location", "/app.html");
      done();
    });
});

describe("Sign up user", function () {
  it("");
});

describe("POST /login", function (done) {
  it("should return a 200 response if the user is logged in", function (done) {
    authenticatedUser.post("/login").expect(200, done);
  });
});
