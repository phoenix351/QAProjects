"use strict";

const expect = require("chai").expect;
const ConvertHandler = require("../controllers/convertHandler.js");

module.exports = function (app) {
  let convertHandler = new ConvertHandler();
  app.route("/api/convert").get((req, res) => {
    const input = req.query.input;
    const initNum = convertHandler.getNum(input);
    const initUnit = convertHandler.getUnit(input);
    const returnNum = convertHandler.convert(initNum,initUnit);
    const returnUnit = convertHandler.getReturnUnit(initUnit);
    
    const result = convertHandler.getString(
      initNum,
      initUnit,
      returnNum,
      returnUnit
    );
    if(result.includes('invalid')){
      res.send(result)
    }
    res.send({initNum,initUnit,returnNum,returnUnit,string:result});
  });
};
