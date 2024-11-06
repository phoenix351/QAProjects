"use strict";

const Joi = require("joi");

const Issue = Joi.object({
  project: Joi.string().alphanum().required(),
  issue_title: Joi.string().required(),
  issue_text: Joi.string().required(),
  assigned_to: Joi.string(),
  created_by: Joi.string().required(),
  created_on: Joi.date(),
  updated_on: Joi.date(),
  status_text: Joi.string(),
  open: Joi.boolean(),
});
module.exports = Issue;
