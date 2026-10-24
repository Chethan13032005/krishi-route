// Crop Labels Unit Tests
const { getCropLabel, CROP_DICTIONARY } = require('../src/locales/cropLabels');

describe('Multilingual Crop Labels', () => {
  test('returns Kannada label for ragi', () => {
    const label = getCropLabel('ragi', 'kn');
    expect(label).toContain('ರಾಗಿ');
  });

  test('falls back to English when language missing', () => {
    const label = getCropLabel('cotton', 'fr');
    expect(label).toBe('Cotton');
  });

  test('has transliterations for all core Karnataka commodities', () => {
    for (const [key, val] of Object.entries(CROP_DICTIONARY)) {
      expect(val.transliteration).toBeTruthy();
    }
  });
});
