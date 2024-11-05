const chai = require("chai");
let assert = chai.assert;
const ConvertHandler = require("../controllers/convertHandler.js");

let convertHandler = new ConvertHandler();

suite("Unit Tests", function () {
  test("Test#1 read a whole number input", function () {
    assert.equal(
      3,
      convertHandler.getNum("3mi"),
      "convertHandler should correctly read a whole number input."
    );
  });
  test("Test#2 read a decimal number input", function () {
    assert.equal(
      3.2,
      convertHandler.getNum("3.2mi"),
      "convertHandler should correctly read a decimal number input."
    );
  });
  test("Test#3 read a fractional input", function () {
    assert.equal(
      0.5,
      convertHandler.getNum("1/2mi"),
      "convertHandler should correctly read a fractional input."
    );
  });
  test("Test#4 read a fractional input with a decimal", function () {
    assert.equal(
      2,
      convertHandler.getNum("3.2/1.6mi"),
      "convertHandler should correctly read a fractional input with a decimal."
    );
  });
  test("Test#5 correctly return an error on a double-fraction (i.e. 3/2/3)", function () {
    assert.isFalse(
      convertHandler.getNum("3/2/3mi"),
      "convertHandler should correctly return an error on a double-fraction (i.e. 3/2/3)."
    );
  });
  test("Test#6 correctly default to a numerical input of 1 when no numerical input is provided", function () {
    assert.equal(
      1,
      convertHandler.getNum("mi"),
      "convertHandler should correctly default to a numerical input of 1 when no numerical input is provided."
    );
  });
  test("Test#7 correctly read each valid input unit", function () {
    assert.equal(
      "mi",
      convertHandler.getUnit("1mi"),
      "convertHandler should correctly read each valid input unit."
    );
  });
  test("Test#8 correctly return an error for an invalid input unit", function () {
    assert.isFalse(
      convertHandler.getUnit("1mix"),
      "convertHandler should correctly return an error for an invalid input unit."
    );
  });
  test("Test#9 return the correct return unit for each valid input unit", function () {
    assert.equal(
      "km",
      convertHandler.getReturnUnit("mi"),
      "convertHandler should return the correct return unit for each valid input unit."
    );
  });
  test("Test#10 correctly return the spelled-out string unit for each valid input unit", function () {
    assert.equal(
      "kilometers",
      convertHandler.spellOutUnit("km"),
      "convertHandler should correctly return the spelled-out string unit for each valid input unit."
    );
  });
  test("Test#11 correctly convert gal to L.", function () {
    assert.equal(
      "L",
      convertHandler.getReturnUnit("gal"),
      "convertHandler should correctly convert gal to L."
    );
  });
  test("Test#12 correctly convert L to gal.", function () {
    assert.equal(
      "gal",
      convertHandler.getReturnUnit("L"),
      "convertHandler should correctly convert L to gal."
    );
  });
  test("Test#13 correctly convert mi to km.", function () {
    assert.equal(
      "km",
      convertHandler.getReturnUnit("mi"),
      "convertHandler should correctly convert mi to km."
    );
  });
  test("Test#14 correctly convert km to mi.", function () {
    assert.equal(
      "mi",
      convertHandler.getReturnUnit("km"),
      "convertHandler should correctly convert km to mi."
    );
  });
  test("Test#15 correctly convert kg to lbs.", function () {
    assert.equal(
      "lbs",
      convertHandler.getReturnUnit("kg"),
      "convertHandler should correctly convert kg to lbs."
    );
  });
  test("Test#16 correctly convert lbs to kg.", function () {
    assert.equal(
      "kg",
      convertHandler.getReturnUnit("lbs"),
      "convertHandler should correctly convert lbs to kg."
    );
  });
});
