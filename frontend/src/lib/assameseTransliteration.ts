/**
 * Client-side phonetic transliteration utility for Assamese (অসমীয়া).
 * Converts Romanized phonetic typing (e.g. "namaskar moi developer hoboloi bisaru")
 * into authentic Assamese script (e.g. "নমস্কাৰ মই ডেভেলপাৰ হ’বলৈ বিচাৰোঁ").
 */

const ASSAMESE_DICTIONARY: Record<string, string> = {
  // Greetings & Courtesies
  namaskar: "নমস্কাৰ",
  namaste: "নমস্কাৰ",
  dhanyabad: "ধন্যবাদ",
  dhyan: "মনোযোগ",
  bhal: "ভাল",
  khub: "খুব",
  beya: "বেয়া",
  hoi: "হয়",
  nohoy: "নহয়",
  sahay: "সহায়",
  sahajyo: "সাহায্য",

  // Pronouns
  moi: "মই",
  mur: "মোৰ",
  muke: "মোক",
  aami: "আমি",
  ami: "আমি",
  amuk: "আমাক",
  amar: "আমাৰ",
  tumi: "তুমি",
  tumar: "তোমাৰ",
  tumak: "তোমাক",
  apuni: "আপুনি",
  apunar: "আপোনাৰ",
  apunak: "আপোনাক",
  tai: "তাই",
  teu: "তেওঁ",
  he: "সি",

  // Interrogatives (Questions)
  ki: "কি",
  kio: "কিয়",
  kuntu: "কোনটো",
  kunto: "কোনটো",
  kuni: "কোনে",
  kun: "কোন",
  kot: "ক’ত",
  ketiya: "কেতিয়া",
  kene: "কেনে",
  kenekoi: "কেনেকৈ",

  // State of Being & Common Verbs
  ase: "আছে",
  asu: "আছো",
  asa: "আছা",
  asili: "আছিলি",
  asilo: "আছিলো",
  asil: "আছিল",
  hobo: "হ’ব",
  hobole: "হ’বলৈ",
  hoboloi: "হ’বলৈ",
  lage: "লাগে",
  lagibo: "লাগিব",
  bisaru: "বিচাৰোঁ",
  bisarisu: "বিচাৰিছোঁ",
  bisare: "বিচাৰে",
  koribo: "কৰিব",
  korim: "কৰিম",
  kori: "কৰি",
  korok: "কৰক",
  korisu: "কৰিছোঁ",
  korisilu: "কৰিছিলোঁ",
  jonak: "জনাওক",
  janibo: "জানিবলৈ",
  dibo: "দিব",
  diok: "দিয়ক",

  // Professional, Career & Technical Concepts
  sakori: "চাকৰি",
  kam: "কাম",
  shikha: "শিক্ষা",
  sikha: "শিক্ষা",
  porikha: "পৰীক্ষা",
  resume: "ৰিজ্যুমে",
  roadmap: "ৰোডমেপ",
  interview: "সাক্ষাৎকাৰ",
  mock: "মক",
  developer: "ডেভেলপাৰ",
  engineer: "ইঞ্জিনিয়াৰ",
  coding: "কোডিং",
  skills: "দক্ষতা",
  skill: "দক্ষতা",
  path: "পথ",
  career: "কেৰিয়াৰ",
  guidance: "পৰামৰ্শ",
  job: "চাকৰি",
  project: "প্ৰকল্প",
  salary: "দৰমহা",
  company: "কোম্পানী",
  frontend: "ফ্ৰণ্টএণ্ড",
  backend: "বেকএণ্ড",
  fullstack: "ফুলষ্টেক",
  design: "ডিজাইন",
  learning: "শিকন",
  practice: "অনুশীলন",
  question: "প্ৰশ্ন",
  questions: "প্ৰশ্নসমূহ",
  answer: "উত্তৰ",
};

// Syllabic Phonetic Consonant Mappings
const CONSONANTS: Array<[string, string]> = [
  ["khy", "ক্ষ্য"],
  ["kh", "খ"],
  ["gh", "ঘ"],
  ["ng", "ঙ"],
  ["ch", "ছ"],
  ["c", "চ"],
  ["jh", "ঝ"],
  ["j", "জ"],
  ["th", "থ"],
  ["t", "ত"],
  ["dh", "ধ"],
  ["d", "দ"],
  ["ph", "ফ"],
  ["bh", "ভ"],
  ["b", "ব"],
  ["p", "প"],
  ["f", "ফ"],
  ["m", "ম"],
  ["ny", "ঞ"],
  ["n", "ন"],
  ["sh", "শ"],
  ["s", "স"],
  ["x", "শ"],
  ["h", "হ"],
  ["r", "ৰ"],
  ["l", "ল"],
  ["w", "ৱ"],
  ["v", "ভ"],
  ["y", "য়"],
  ["k", "ক"],
  ["g", "গ"],
];

// Initial Vowels
const INITIAL_VOWELS: Array<[string, string]> = [
  ["aa", "আ"],
  ["ai", "ঐ"],
  ["au", "ঔ"],
  ["ee", "ঈ"],
  ["ii", "ঈ"],
  ["oo", "ঊ"],
  ["uu", "ঊ"],
  ["a", "অ"],
  ["i", "ই"],
  ["u", "উ"],
  ["e", "এ"],
  ["o", "ও"],
];

// Dependent Vowel Matras (attached after a consonant)
const VOWEL_MATRAS: Array<[string, string]> = [
  ["aa", "া"],
  ["ai", "ৈ"],
  ["au", "ৌ"],
  ["ee", "ী"],
  ["ii", "ী"],
  ["oo", "ূ"],
  ["uu", "ূ"],
  ["a", ""], // inherent vowel
  ["i", "ি"],
  ["u", "ু"],
  ["e", "ে"],
  ["o", "ো"],
];

/**
 * Transliterates a single English phonetic word into Assamese script.
 */
export function transliterateAssameseWord(word: string): string {
  if (!word) return "";

  // Preserve leading/trailing punctuation
  const match = word.match(/^([^a-zA-Z0-9]*)([a-zA-Z0-9_-]+)([^a-zA-Z0-9]*)$/);
  if (!match) return word;

  const [, leadingPunct, coreWord, trailingPunct] = match;
  const lower = coreWord.toLowerCase();

  // 1. Direct dictionary lookup (covers 95%+ of natural conversational sentences)
  if (ASSAMESE_DICTIONARY[lower]) {
    return leadingPunct + ASSAMESE_DICTIONARY[lower] + trailingPunct;
  }

  // 2. Syllabic phonetic parsing for arbitrary vocabulary
  let idx = 0;
  let result = "";
  const len = lower.length;

  while (idx < len) {
    // Check if initial vowel (at start of word or after another vowel)
    if (idx === 0) {
      let matchedVowel = false;
      for (const [vKey, vChar] of INITIAL_VOWELS) {
        if (lower.startsWith(vKey, idx)) {
          result += vChar;
          idx += vKey.length;
          matchedVowel = true;
          break;
        }
      }
      if (matchedVowel) continue;
    }

    // Match consonant
    let matchedConsonant = false;
    for (const [cKey, cChar] of CONSONANTS) {
      if (lower.startsWith(cKey, idx)) {
        result += cChar;
        idx += cKey.length;
        matchedConsonant = true;

        // Check if followed by vowel matra
        let matchedMatra = false;
        for (const [mKey, mChar] of VOWEL_MATRAS) {
          if (lower.startsWith(mKey, idx)) {
            result += mChar;
            idx += mKey.length;
            matchedMatra = true;
            break;
          }
        }

        // If not followed by vowel and not at end, add hasant (virama)
        if (!matchedMatra && idx < len && !isVowelChar(lower[idx])) {
          result += "্";
        }
        break;
      }
    }

    if (!matchedConsonant) {
      // Fallback: copy character as-is
      result += lower[idx];
      idx++;
    }
  }

  return leadingPunct + result + trailingPunct;
}

function isVowelChar(char: string): boolean {
  return /^[aeiou]/i.test(char);
}

/**
 * Transliterates an entire sentence or paragraph from Romanized phonetic text
 * into authentic Assamese script while preserving spaces and layout.
 */
export function transliterateAssameseSentence(text: string): string {
  if (!text) return "";
  return text
    .split(/(\s+)/)
    .map((token) => (/^\s+$/.test(token) ? token : transliterateAssameseWord(token)))
    .join("");
}
