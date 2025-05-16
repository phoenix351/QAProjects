const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server"); // adjust the path as needed
const { expect } = chai;

chai.use(chaiHttp);

describe("Functional Tests", () => {
  describe("POST /api/translate", () => {
    it("Translation with text and locale fields", (done) => {
      chai
        .request(server)
        .post("/api/translate")
        .send({
          text: "Mangoes are my favorite fruit.",
          locale: "american-to-british",
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("text");
          expect(res.body).to.have.property("translation");
          expect(res.body.translation).to.include(
            '<span class="highlight">favourite</span>'
          );
          done();
        });
    });

    it("Translation with text and invalid locale field", (done) => {
      chai
        .request(server)
        .post("/api/translate")
        .send({
          text: "Mangoes are my favorite fruit.",
          locale: "invalid-locale",
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            error: "Invalid value for locale field",
          });
          done();
        });
    });

    it("Translation with missing text field", (done) => {
      chai
        .request(server)
        .post("/api/translate")
        .send({
          locale: "american-to-british",
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            error: "Required field(s) missing",
          });
          done();
        });
    });

    it("Translation with missing locale field", (done) => {
      chai
        .request(server)
        .post("/api/translate")
        .send({
          text: "Mangoes are my favorite fruit.",
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            error: "Required field(s) missing",
          });
          done();
        });
    });

    it("Translation with empty text", (done) => {
      chai
        .request(server)
        .post("/api/translate")
        .send({
          text: "",
          locale: "american-to-british",
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({ error: "No text to translate" });
          done();
        });
    });

    it("Translation with text that needs no translation", (done) => {
      chai
        .request(server)
        .post("/api/translate")
        .send({
          text: "Hello world!",
          locale: "american-to-british",
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({
            text: "Hello world!",
            translation: "Everything looks good to me!",
          });
          done();
        });
    });
  });
});
