function ConvertHandler() {
  this.conversionTable = {
    mi: { convertTo: "km", spellOut: "miles", coeff: 1.60934 },
    km: { convertTo: "mi", spellOut: "kilometres", coeff: 1 / 1.60934 },
    kg: { convertTo: "lbs", spellOut: "kilograms", coeff: 1 / 0.453592 },
    gal: { convertTo: "L", spellOut: "gallons", coeff: 3.78541 },
    l: { convertTo: "gal", spellOut: "liters", coeff: 1 / 3.78541 },
    lbs: { convertTo: "kg", spellOut: "pounds", coeff: 0.453592 },
  };
  this.getNum = function (input) {
    const unitMatch = input.toLowerCase().match(/[a-z]+$/);
    let result;
    if (!unitMatch) {
      result = input;
    } else {
      result = input.slice(0, unitMatch["index"]);
    }
    if (result.length < 1) return 1;

    if (result.includes("/")) {
      let fractions = result.split("/");
      if (fractions.length > 2) {
        return false;
      }
      let firstFraction = fractions[0];
      let secondFraction = fractions[1];
      try {
        firstFraction = Number(firstFraction);
        secondFraction = Number(secondFraction);
        return Number((firstFraction / secondFraction).toFixed(5));
      } catch (error) {
        return false;
      }
    } else {
      try {
        
        result = Number(Number(result).toFixed(5));
        
      } catch (error) {
        return false;
      }
    }
    return result;
  };

  this.getUnit = function (input) {
    const unitMatch = input.toLowerCase().match(/[a-z]+$/);
    if (!unitMatch) {
      return false;
    }
    let result = unitMatch[0];
    const validUnit = this.conversionTable.hasOwnProperty(result);
    if (validUnit) {
      if (result === "l") return "L";
      return result;
    }
    return false;
  };

  this.getReturnNum = function (initNum) {
    // if valid

    let result = this.conversionTable[this.getUnit()].coeff * initNum;
    // if invalid
    return result.toFixed(5);
  };

  this.getReturnUnit = function (initUnit) {
    if (!initUnit) return false;
    const units = {
      mi: "km",
      km: "mi",
      kg: "lbs",
      gal: "L",
      l: "gal",
      lbs: "kg",
    };
    let result = units[initUnit.toLowerCase()];

    return result;
  };

  this.spellOutUnit = function (unit) {
    const units = {
      mi: "miles",
      km: "kilometers",
      kg: "kilograms",
      gal: "gallons",
      l: "liters",
      lbs: "pounds",
    };
    let result = units[unit.toLowerCase()];

    return result;
  };

  this.convert = function (initNum, initUnit) {
    if (!initUnit) return false;
    if (!initNum) {
      initNum = 1;
    }
    initUnit = initUnit.toLowerCase();
    if (this.conversionTable.hasOwnProperty(initUnit)) {
      let result = this.conversionTable[initUnit].coeff * initNum;

      return Number(result.toFixed(5));
    }
    return false;
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    const unitInvalidMessage = "Invalid unit";

    if (!initUnit && !initNum) return "invalid number and unit";
    if (!initNum) return "invalid number";
    if (!initUnit) return "invalid unit";
    let result = `${initNum} ${this.spellOutUnit(
      initUnit
    )} converts to ${Number(returnNum).toFixed(5)} ${this.spellOutUnit(
      returnUnit
    )}`;

    return result;
  };
}

module.exports = ConvertHandler;
