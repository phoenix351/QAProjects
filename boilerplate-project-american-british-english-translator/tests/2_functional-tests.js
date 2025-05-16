const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
chai.use(chaiHttp);

suite("Functional Tests", () => {
  test("POST /api/translate - valid request", (done) => {
    chai
      .request(server)
      .post("/api/translate")
      .send({
        text: "I ate yogurt for breakfast.",
        locale: "american-to-british",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.translation,
          'I ate <span class="highlight">yoghurt</span> for breakfast.'
        );
        done();
      });
  });

  test("POST /api/translate - invalid locale", (done) => {
    chai
      .request(server)
      .post("/api/translate")
      .send({ text: "text", locale: "french-to-german" })
      .end((err, res) => {
        assert.equal(res.body.error, "Invalid value for locale field");
        done();
      });
  });
});
