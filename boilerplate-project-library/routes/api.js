/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const { ObjectId } = require("mongodb");

module.exports = function (app, myBook) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      const books = await myBook.find({}).toArray();
      // console.log({ books });

      res.send(books);

      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    .post(async function (req, res) {
      if (!req.body.hasOwnProperty("title")) {
        return res.send("missing required field title");
      }

      const { title } = req.body;
      if (title.length === 0) {
        return res.send("missing required field title");
      }
      try {
        const newBook = {
          title,
          comments: [],
          commentcount: 0,
        };
        const { insertedId } = await myBook.insertOne(newBook);
        const result = {
          title,
          _id: insertedId,
        };
        // console.log(result);

        return res.send(result);
      } catch (error) {
        console.log("error happen");

        return res.send({
          error: "Failed to Add Book to Database",
          message: error.message,
        });
      }
    })
    .delete(async function (req, res) {
      try {
        const result = myBook.deleteMany({});
        if (result) {
          return res.send("complete delete successful");
        }
      } catch (error) {
        return res.send(error.message);
      }
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      let bookid = req.params.id;
      console.log({ bookid });

      if (!ObjectId.isValid(bookid)) {
        return res.send("no book exists");
      }
      const result = await myBook.findOne({ _id: new ObjectId(bookid) });
      if (!result) {
        return res.send("no book exists");
      }
      return res.send(result);
    })
    .post(async function (req, res) {
      let bookid = req.params.id;
      if (!ObjectId.isValid(bookid)) {
        return res.send("no book exists");
      }
      const result = await myBook.findOne({ _id: new ObjectId(bookid) });
      if (!result) {
        return res.send("no book exists");
      }
      if (!req.body.hasOwnProperty("comment")) {
        return res.send("missing required field comment");
      }
      const comment = req.body.comment;
      result.comments.push(comment);
      // result.commentcount++;
      console.log({ks:result.comments});
      
      try {
        const updateResult = await myBook.updateOne(
          { _id: bookid },
          { $set: { comments: result.comments, commentcount: result.comments.length } }
        );
        return res.send({
          _id: bookid,
          title: result.title,
          comments: result.comments,
        });
      } catch (error) {
        return res.send("something error when inserting into database");
      }
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      if (!ObjectId.isValid(bookid)) {
        return res.send("no book exists");
      }
      const book = await myBook.findOne({ _id: new ObjectId(bookid) });
      if (!book) {
        return res.send("no book exists");
      }
      try {
        const result = await myBook.deleteOne({ _id: bookid });
        if (result) {
          return res.send("delete successful");
        }
      } catch (error) {
        return res.send(error.message);
      }
      //if successful response will be 'delete successful'
    });
};
