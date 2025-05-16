// components/translator.js
const americanOnly = require("./american-only");
const britishOnly = require("./british-only");
const americanToBritishSpelling = require("./american-to-british-spelling");
const britishToAmericanSpelling = Object.fromEntries(
  Object.entries(americanToBritishSpelling).map(([k, v]) => [v, k])
);
const americanToBritishTitles = require("./american-to-british-titles");
const britishToAmericanTitles = Object.fromEntries(
  Object.entries(americanToBritishTitles).map(([k, v]) => [v, k])
);

const timeRegex = {
  "american-to-british": /(\d{1,2}):(\d{2})/g,
  "british-to-american": /(\d{1,2})\.(\d{2})/g,
};

class Translator {
  translate(text, locale) {
    if (!text) return "";
    let translation = text;
    let replacements = [];

    const translateTitle = (wordList, text) => {
      for (let [from, to] of Object.entries(wordList)) {
        const regex = new RegExp(`\\b${from}`, "gi");
        if (regex.test(text)) {
          replacements.push({
            from: regex,
            to: `<span class="highlight">${to}</span>`,
          });
        }
      }
    };

    const addReplacements = (dict) => {
      for (let [from, to] of Object.entries(dict)) {
        const regex = new RegExp(`\\b${from}\\b`, "gi");
        if (regex.test(translation)) {
          replacements.push({
            from: regex,
            to: `<span class="highlight">${to}</span>`,
          });
        }
      }
    };

    // Title replacement
    if (locale === "american-to-british")
      translateTitle(americanToBritishTitles, translation);
    if (locale === "british-to-american")
      translateTitle(britishToAmericanTitles, translation);

    // Dictionary replacement
    if (locale === "american-to-british") {
      addReplacements(americanOnly);
      addReplacements(americanToBritishSpelling);
    } else if (locale === "british-to-american") {
      addReplacements(britishOnly);
      addReplacements(britishToAmericanSpelling);
    }

    // Time replacement
    const timeMatch = translation.match(timeRegex[locale]);
    if (timeMatch) {
      timeMatch.forEach((t) => {
        const replacement =
          locale === "american-to-british"
            ? t.replace(":", ".")
            : t.replace(".", ":");
        translation = translation.replace(
          t,
          `<span class="highlight">${replacement}</span>`
        );
      });
    }

    // Apply dictionary & title replacements
    replacements.forEach(({ from, to }) => {
      translation = translation.replace(from, to);
    });

    // Return result
    return translation === text ? "Everything looks good to me!" : translation;
  }
}

module.exports = Translator;
