const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

class Translator {
  constructor() {
    this.americanOnly = americanOnly;
    this.americanToBritishSpelling = americanToBritishSpelling;
    this.americanToBritishTitles = americanToBritishTitles;
    this.britishOnly = britishOnly;
  }
}

module.exports = Translator;
