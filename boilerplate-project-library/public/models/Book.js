"use strict";

const Joi = require("joi");

const Book = Joi.object({
  title: Joi.string().required(),
  comments: Joi.array().default([]),
  commentcount: Joi.number().default(0),
});

module.exports = Book;
