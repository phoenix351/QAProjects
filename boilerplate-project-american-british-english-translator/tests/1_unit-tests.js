const chai = require("chai");
const assert = chai.assert;
const Translator = require("../components/translator.js");
const translator = new Translator();

suite("Unit Tests", () => {
  test("Translate Mangoes are my favorite fruit.", () => {
    const result = translator.translate(
      "Mangoes are my favorite fruit.",
      "american-to-british"
    );
    assert.equal(
      result,
      'Mangoes are my <span class="highlight">favourite</span> fruit.'
    );
  });

  test("Translate We watched the footie match for a while.", () => {
    const result = translator.translate(
      "We watched the footie match for a while.",
      "british-to-american"
    );
    assert.equal(
      result,
      'We watched the <span class="highlight">soccer</span> match for a while.'
    );
  });
});
