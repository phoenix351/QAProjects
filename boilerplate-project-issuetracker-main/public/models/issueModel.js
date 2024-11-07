"use strict";

const Joi = require("joi");

const Issue = Joi.object({
  project: Joi.string().required(),
  issue_title: Joi.string().required(),
  issue_text: Joi.string().required(),
  created_by: Joi.string().required(),
  assigned_to: Joi.string().allow(""),
  created_on: Joi.date(),
  updated_on: Joi.date(),
  status_text: Joi.string().allow(""),
  open: Joi.boolean(),
});
module.exports = Issue;
