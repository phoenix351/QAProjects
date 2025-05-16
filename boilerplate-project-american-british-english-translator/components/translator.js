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

function preserveCase(original, replacement) {
  if (original[0] === original[0].toUpperCase()) {
    return replacement[0].toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

// function replaceSafely(input, from, to, onChange, isTitle = false) {
//   const parts = input.split(/(<span class="highlight">.*?<\/span>)/);

//   // Escape special regex characters in `from`
//   const escapedFrom = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
//   const regex = isTitle
//     ? new RegExp(`${escapedFrom}`, "gi")
//     : new RegExp(`\\b${escapedFrom}\\b`, "gi");

//   return parts
//     .map((part) => {
//       if (part.startsWith('<span class="highlight">')) return part;

//       return part.replace(regex, (match) => {
//         onChange(); // Notify that a change occurred
//         return `<span class="highlight">${preserveCase(match, to)}</span>`;
//       });
//     })
//     .join("");
// }
function replaceSafely(input, from, to, onChange, isTitle = false) {
  const parts = input.split(/(<span class="highlight">.*?<\/span>)/);

  // Escape regex special characters in `from`
  const escapedFrom = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const regex = isTitle
    ? new RegExp(`(?<!\\w)${escapedFrom}(?!\\w)`, "gi")  // match full token, not partial word
    : new RegExp(`\\b${escapedFrom}\\b`, "gi");

  return parts
    .map((part) => {
      if (part.startsWith('<span class="highlight">')) return part;

      return part.replace(regex, (match) => {
        onChange();
        return `<span class="highlight">${preserveCase(match, to)}</span>`;
      });
    })
    .join("");
}


class Translator {
  translate(text, locale) {
    if (!text) return "";

    let translation = text;
    let changed = false;

    // Titles
    const titleMap =
      locale === "american-to-british"
        ? americanToBritishTitles
        : britishToAmericanTitles;

    for (let [from, to] of Object.entries(titleMap)) {
      translation = replaceSafely(
        translation,
        from,
        to,
        () => {
          changed = true;
        },
        true
      ); // `true` to enable title mode (no word boundaries)
    }

    // Dictionary words
    const dicts =
      locale === "american-to-british"
        ? [americanOnly, americanToBritishSpelling]
        : [britishOnly, britishToAmericanSpelling];

    for (let dict of dicts) {
      const sortedEntries = Object.entries(dict).sort(
        (a, b) => b[0].length - a[0].length
      );

      for (let [from, to] of sortedEntries) {
        translation = replaceSafely(translation, from, to, () => {
          changed = true;
        });
      }
    }

    // Time format
    translation = translation.replace(timeRegex[locale], (match, p1, p2) => {
      changed = true;
      const replacement =
        locale === "american-to-british" ? `${p1}.${p2}` : `${p1}:${p2}`;
      return `<span class="highlight">${replacement}</span>`;
    });

    return changed ? translation : "Everything looks good to me!";
  }
}

module.exports = Translator;
