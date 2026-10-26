/*
 * content.js — assembles the lesson parts into one LESSONS array and
 * converts the authoring shortcuts:  ¶ → `   and   $_{ → ${
 * (This lets lesson files contain backticks and ${} without escaping.)
 */
(function (root) {
  function convert(value) {
    if (typeof value === 'string') return value.replace(/¶/g, '`').replace(/\$_\{/g, '${');
    if (Array.isArray(value)) return value.map(convert);
    if (value && typeof value === 'object') {
      const out = {};
      for (const key of Object.keys(value)) out[key] = convert(value[key]);
      return out;
    }
    return value; // functions (tests), numbers, booleans
  }

  const LESSONS = convert(root.LESSON_PARTS || []);
  if (typeof module !== 'undefined' && module.exports) module.exports = LESSONS;
  else root.LESSONS = LESSONS;
})(typeof globalThis !== 'undefined' ? globalThis : this);
