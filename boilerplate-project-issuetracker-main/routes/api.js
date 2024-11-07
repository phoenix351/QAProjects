"use strict";
const { ObjectId } = require("mongodb");
const Issue = require("../public/models/issueModel");
module.exports = function (app, myDataBase) {
  app
    .route("/api/issues/:project")

    .get(async function (req, res) {
      try {
        const project = req.params.project;
        const { open, assigned_to, issue_title, created_by, status_text, _id } =
          req.query;
        const filter = { project };
        if (_id) filter._id = new ObjectId(_id); // Convert "true"/"false" to boolean
        if (open) filter.open = open === "true"; // Convert "true"/"false" to boolean
        if (assigned_to) filter.assigned_to = assigned_to;
        if (issue_title) filter.issue_title = issue_title;
        if (created_by) filter.created_by = created_by;
        if (status_text) filter.status_text = status_text;
        let issues;
        if (project) {
          issues = await myDataBase.find(filter).toArray();
        } else {
          issues = await myDataBase.find({}).toArray();
        }

        return res.json(issues);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      // console.log({ issue });
    })

    .post(async function (req, res) {
      let project = req.params.project;
      let newIssue = {
        project,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        open: true,
        status_text: req.body.status_text,
      };
      const { error } = Issue.validate(newIssue);
      if (error) {
        // If validation fails, return the required field(s) missing error
        return res.send({ error: "required field(s) missing" });
      }
      try {
        // Prepare the new issue object
        const newIssue = {
          project: req.params.project,
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_on: new Date(),
          updated_on: new Date(),
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to || "", // Set default values if empty
          open: true,
          status_text: req.body.status_text || "",
        };

        // Validate the new issue

        // Insert into database if validation passes
        const { insertedId } = await myDataBase.insertOne(newIssue);
        // Return the inserted issue data
        return res.send({
          _id: insertedId,
          issue_title: newIssue.issue_title,
          issue_text: newIssue.issue_text,
          created_by: newIssue.created_by,
          assigned_to: newIssue.assigned_to,
          status_text: newIssue.status_text,
          open: newIssue.open,
          created_on: newIssue.created_on,
          updated_on: newIssue.updated_on,
        });
      } catch (error) {
        // Handle unexpected errors
        return res.status(500).json({ error: error.message });
      }
    })

    .put(async function (req, res) {
      // Construct updated issue fields only if they are present in the request
      const updatedIssue = {
        ...(req.body.issue_title ? { issue_title: req.body.issue_title } : {}),
        ...(req.body.issue_text ? { issue_text: req.body.issue_text } : {}),
        ...(req.body.created_by ? { created_by: req.body.created_by } : {}),
        ...(req.body.assigned_to ? { assigned_to: req.body.assigned_to } : {}),
        ...(req.body.open ? { open: req.body.open === "true" } : {}),
        ...(req.body.status_text ? { status_text: req.body.status_text } : {}),
      };

      // Ensure _id is provided
      if (!req.body.hasOwnProperty("_id")) {
        return res.send({
          error: "missing _id",
        });
      }

      const { _id } = req.body;

      // Find the issue with the provided _id
      const findResult = await myDataBase
        .find({ _id: new ObjectId(_id) })
        .toArray();

      // If no matching issue is found, return error
      if (!findResult.length) {
        return res.send({
          error: "could not update",
          _id: _id,
        });
      }

      try {
        // If no update fields are present, return error with the expected format
        if (!Object.entries(updatedIssue).length) {
          return res.send({
            error: "no update field(s) sent",
            _id: _id, // Include the _id in the error response to match the expected format
          });
        }

        // Update the issue
        updatedIssue["updated_on"] = new Date();
        const result = await myDataBase.updateOne(
          { _id: new ObjectId(_id) },
          { $set: updatedIssue }
        );

        // If no modification occurred, return error
        if (!result.modifiedCount)
          return res.send({
            error: "could not update",
            _id: _id,
          });

        // Success response
        res.send({
          result: "successfully updated",
          _id,
        });
      } catch (error) {
        // Catch and return any other errors
        return res.send({
          error: "could not update",
          _id,
        });
      }
    })

    .delete(async function (req, res) {
      try {
        if (!req.body.hasOwnProperty("_id")) {
          return res.send({
            error: "missing _id",
          });
        }
        const { _id } = req.body;
        const result = await myDataBase.findOneAndDelete({
          _id: new ObjectId(_id),
        });
        if (!result) {
          return res.send({
            error: "could not delete",
            _id: _id,
          });
        }
        res.send({
          result: "successfully deleted",
          _id: _id,
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
};
