/*
 * content.js — assembles lesson parts into TRACKS and converts the authoring shortcuts:
 *   ¶ → `   and   $_{ → ${
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

  const TRACKS = [
    {
      id: 'js',
      title: 'JavaScript',
      icon: '🟨',
      tagline: 'The language of the web — and the foundation for everything else.',
      level: 'No experience needed',
      runtime: null,
      lessons: convert(root.LESSON_PARTS || []),
    },
    {
      id: 'react',
      title: 'React',
      icon: '⚛️',
      tagline: 'Build interactive websites out of reusable components.',
      level: 'Needs JavaScript basics',
      runtime: 'react',
      lessons: convert(root.REACT_PARTS || []),
    },
    {
      id: 'native',
      title: 'React Native',
      icon: '📱',
      tagline: 'Build real iPhone & Android apps with the skills from React.',
      level: 'Needs JavaScript + React basics',
      runtime: 'native',
      lessons: convert(root.NATIVE_PARTS || []),
    },
  ].filter((t) => t.lessons.length);

  if (typeof module !== 'undefined' && module.exports) module.exports = TRACKS;
  else root.TRACKS = TRACKS;
})(typeof globalThis !== 'undefined' ? globalThis : this);
