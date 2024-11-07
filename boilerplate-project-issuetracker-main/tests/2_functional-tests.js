const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const { test } = require("mocha");

chai.use(chaiHttp);
let created_id;
suite("Functional Tests", function () {
  test("Test#1 Create an issue with every field: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/apitest")
      .send({
        issue_title: "All Field Issue",
        issue_text: "Details about the new issue",
        created_by: "Ponimin",
        assigned_to: "John",
        status_text: "In QA",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "_id");
        assert.lengthOf(res.body._id, 24);
        created_id = res.body._id;
        done();
      });
  });
  test("Test#2 Create an issue with only required fields: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/apitest")
      .send({
        issue_title: "Only required fields",
        issue_text: "Details about the new issue",
        created_by: "Ponimin",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "_id");
        assert.lengthOf(res.body._id, 24);
        // console.log(res.body);

        done();
      });
  });
  test("Test#3 Create an issue with missing required fields: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/apitest")
      .send({
        issue_title: "missing required fields",
        issue_text: "Details about the new issue",
        // created_by: "Ponimin",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "required field(s) missing");
        // assert.lengthOf(res.body._id, 24);
        done();
      });
  });
  test("Test#4 CreateView issues on a project: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/issues/apitest")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "should be an array");
        assert.isNotEmpty(res.body, "should be not empty ");
        done();
      });
  });
  test("Test#5 View issues on a project with one filter: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/issues/apitest?created_by=Ponimin")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "should be an array");
        // assert.isNotEmpty(res.body, "should be not empty ");
        done();
      });
  });
  test("Test#6 View issues on a project with multiple filters: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/issues/apitest?created_by=Ponimin&assigned_to=John")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "should be an array");
        // assert.isNotEmpty(res.body, "should be not empty ");
        done();
      });
  });
  test("Test#7 Update one field on an issue: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/apitest")
      .send({
        _id: created_id,
        issue_title: "Jeng jeng jeng berubah",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);

        assert.equal(res.body._id, created_id);
        assert.equal(res.body.result, "successfully updated");
        // assert.isNotEmpty(res.body, "should be not empty ");
        done();
      });
  });
  test("Test#8 Update multiple fields on an issue: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/apitest")
      .send({
        _id: created_id,
        issue_title: "Jengje berubah",
        assigned_to: "Nama Berubah hohoho",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);

        assert.equal(res.body._id, created_id);
        assert.equal(res.body.result, "successfully updated");
        // assert.isNotEmpty(res.body, "should be not empty ");
        done();
      });
  });
  test("Test#9 UpdateUpdate an issue with missing _id: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/apitest")
      .send({
        issue_title: "Jengje berubah",
        assigned_to: "Nama Berubah hohoho",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);

        // assert.equal(res.body._id, "672b13044c521c0bc4ea9932");
        assert.equal(res.body.error, "missing _id");
        // assert.isNotEmpty(res.body, "should be not empty ");
        done();
      });
  });
  test("Test#10 Update an issue with no fields to update: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/apitest")
      .send({
        _id: created_id,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);

        assert.equal(res.body._id, created_id);
        assert.equal(res.body.error, "no update field(s) sent");
        // assert.isNotEmpty(res.body, "should be not empty ");
        done();
      });
  });
  test("Test#11 Update an issue with an invalid _id: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/apitest")
      .send({
        _id: "672b13044c521c0bc4ea9939",
        issue_title: "Jengje berubah",
        assigned_to: "Nama Berubah hohoho",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);

        // assert.equal(res.body._id, "672b13044c521c0bc4ea9932");
        assert.equal(res.body.error, "could not update");
        // assert.isNotEmpty(res.body, "should be not empty ");
        done();
      });
  });
  test("Test#12 Delete an issue: DELETE request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete("/api/issues/apitest")
      .send({
        _id: created_id,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);

        // assert.equal(res.body._id, "672b13044c521c0bc4ea9932");
        assert.equal(res.body.result, "successfully deleted");
        assert.equal(res.body._id, created_id);
        // assert.isNotEmpty(res.body, "should be not empty ");
        done();
      });
  });
  test("Test#13 Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete("/api/issues/apitest")
      .send({
        _id: created_id,
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);

        assert.equal(res.body.error, "could not delete");
        assert.equal(res.body._id, created_id);
        done();
      });
  });
  test("Test#14 Delete an issue with missing _id: DELETE request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete("/api/issues/apitest")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });
});
