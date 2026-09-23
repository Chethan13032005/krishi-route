// Haversine Unit Tests
const { haversineDistance } = require('../src/utils/haversine');

describe('Haversine Distance Calculator', () => {
  test('calculates known distance between Bengaluru and Mysuru accurately', () => {
    // Bengaluru: 12.9716, 77.5946 | Mysuru: 12.2958, 76.6394 (~128km)
    const dist = haversineDistance(12.9716, 77.5946, 12.2958, 76.6394);
    expect(dist).toBeGreaterThan(120);
    expect(dist).toBeLessThan(140);
  });
});
