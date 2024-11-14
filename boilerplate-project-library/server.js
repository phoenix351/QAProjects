"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const apiRoutes = require("./routes/api.js");
const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner");
const connection = require("./connection.js");

const app = express();

app.use("/public", express.static(process.cwd() + "/public"));

app.use(cors({ origin: "*" })); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
const connectApiRoutes = async () => {
  await connection(async function (client) {
    const myBook = await client.db("database").collection("books");
    apiRoutes(app, myBook);
    app.use(function (req, res, next) {
      res.status(404).type("text").send("Not Found");
    });
  });
  console.log("1");
};
(async () => {
  await connectApiRoutes();
  const listener = app.listen(process.env.PORT || 3000, function () {
    console.log("Your app is listening on port " + listener.address().port);
    if (process.env.NODE_ENV === "test") {
      console.log("Running Tests...");
      setTimeout(function () {
        try {
          runner.run();
        } catch (e) {
          console.log("Tests are not valid:");
          console.error(e);
        }
      }, 1500);
    }
  });
})();

// apiRoutes(app)
// //404 Not Found Middleware

//Start our server and tests!

module.exports = app; //for unit/functional testing
