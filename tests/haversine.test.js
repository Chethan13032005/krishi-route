// Haversine Unit Tests
const { haversineDistance } = require('../src/utils/haversine');

describe('Haversine Distance Calculator', () => {
  test('calculates known distance between Bengaluru and Mysuru accurately', () => {
    const dist = haversineDistance(12.9716, 77.5946, 12.2958, 76.6394);
    expect(dist).toBeGreaterThan(120);
    expect(dist).toBeLessThan(140);
  });

  test('returns 0 for identical origin and destination coordinates', () => {
    const dist = haversineDistance(14.4644, 75.9218, 14.4644, 75.9218);
    expect(dist).toBe(0);
  });
});
