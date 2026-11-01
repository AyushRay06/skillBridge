/**
 * Parse a value from JSON string if needed.
 * Handles the DB inconsistency where JSON fields may be stored as strings.
 *
 * @param {*} value - The value to parse (string or already-parsed)
 * @returns {*} Parsed value
 */
export function parseJsonField(value) {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

/**
 * Parse multiple JSON fields on an object at once.
 * Returns a new object with the specified fields parsed.
 *
 * @param {Object} obj    - Source object
 * @param {string[]} fields - Field names to parse
 * @returns {Object} New object with parsed fields
 */
export function parseJsonFields(obj, fields) {
  const result = { ...obj };
  for (const field of fields) {
    if (field in result) {
      result[field] = parseJsonField(result[field]);
    }
  }
  return result;
}

/** The standard set of profile/resume JSON fields */
export const PROFILE_JSON_FIELDS = ["skills", "experience", "projects", "education", "achievements"];
