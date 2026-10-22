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
});
