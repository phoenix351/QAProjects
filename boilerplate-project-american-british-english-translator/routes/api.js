// routes/api.js
"use strict";
const Translator = require("../components/translator.js");
const translator = new Translator();

module.exports = function (app) {
  app.post("/api/translate", (req, res) => {
    const { text, locale } = req.body;

    if (text === undefined || locale === undefined) {
      return res.json({ error: "Required field(s) missing" });
    }

    if (text.trim() === "") {
      return res.json({ error: "No text to translate" });
    }

    if (!["american-to-british", "british-to-american"].includes(locale)) {
      return res.json({ error: "Invalid value for locale field" });
    }

    const translation = translator.translate(text, locale);
    res.json({ text, translation });
  });
};
