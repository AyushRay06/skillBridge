/**
 * Language detection helper for Career Guide.
 * Checks Unicode script ranges as well as high-confidence Romanized tokens
 * (phonetic Assamese / Hinglish) to determine the user's intended language.
 */

const ROMANIZED_ASSAMESE_KEYWORDS = new Set([
  "moi", "mur", "muke", "amuk", "amar", "aami", "ami",
  "apuni", "apunar", "apunak", "tumi", "tumar", "tumak",
  "kene", "ase", "asu", "asa", "kio", "kuntu", "kunto", "kuni", "kun", "kot", "ketiya",
  "koribo", "korim", "kori", "korok", "korisilu", "korisu", "bisaru", "bisarisu", "bisarisilu",
  "lagibo", "lage", "hobo", "hoboloi", "hoi", "nohoy",
  "bhal", "khub", "beya", "sahay", "sahajyo", "sakori", "kam",
  "dhoronor", "porikha", "axomiya", "asomiya", "upai", "pora", "dhanyabad",
  "hobole", "bisare", "bisarisuk", "jonak", "janibo", "uliyai", "dibo", "diok"
]);

const HINGLISH_KEYWORDS = new Set([
  "mera", "meri", "mere", "mujhe", "mujhko", "hum", "humara", "hamara",
  "aapka", "aapki", "aapke", "tumhara", "tumhari", "kaise", "kare", "karna", "karein",
  "kijiye", "bataiye", "batao", "chahiye", "madad", "naukri", "shukriya", "dhanyawad",
  "kya", "kyu", "kyun", "kaha", "kahan", "kab", "kaun", "hoga", "hogi", "hote"
]);

/**
 * Detects the language of a given text string.
 * @param {string} text — the text to analyse
 * @returns {"as"|"hi"|"en"} language code
 */
export function detectLanguage(text) {
  if (!text || typeof text !== "string") return "en";

  let assameseCount = 0;
  let devanagariCount = 0;

  for (let i = 0; i < text.length; i++) {
    const cp = text.codePointAt(i);
    // Assamese / Bengali script: U+0980–U+09FF
    if (cp >= 0x0980 && cp <= 0x09ff) assameseCount++;
    // Devanagari: U+0900–U+097F
    else if (cp >= 0x0900 && cp <= 0x097f) devanagariCount++;
  }

  // Require at least 2 script characters to trigger native script detection
  if (assameseCount >= 2) return "as";
  if (devanagariCount >= 2) return "hi";

  // If mostly Latin alphabet, check for Romanized Assamese or Hinglish keywords
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  let asKeywordMatches = 0;
  let hiKeywordMatches = 0;

  for (const word of words) {
    if (ROMANIZED_ASSAMESE_KEYWORDS.has(word)) asKeywordMatches++;
    if (HINGLISH_KEYWORDS.has(word)) hiKeywordMatches++;
  }

  if (asKeywordMatches >= 2 || (asKeywordMatches >= 1 && words.length <= 4 && asKeywordMatches / words.length >= 0.25)) {
    return "as";
  }

  if (hiKeywordMatches >= 2 || (hiKeywordMatches >= 1 && words.length <= 4 && hiKeywordMatches / words.length >= 0.25)) {
    return "hi";
  }

  return "en";
}

/**
 * Returns the display language label for a language code.
 * @param {"as"|"hi"|"en"|"auto"} lang
 * @returns {string}
 */
export function getLanguageLabel(lang) {
  const labels = { en: "English", as: "Assamese", hi: "Hindi", auto: "auto" };
  return labels[lang] || "English";
}
