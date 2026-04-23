import Randomia, {
  pick,
  pickMultiple,
  shuffle,
  weightedPick,
  randomRange,
  randomFloat,
  probability,
  sampleWithoutReplacement,
  weightedPickMultiple,
  weightedSampleWithoutReplacement,
  pickObjectKey,
  pickObjectValue,
  randomBytesUtil,
  randomHex,
  randomToken,
} from '../src/Randomia';

describe('Randomia - Cryptographically Secure Random Numbers', () => {
  describe('randomRange', () => {
    it('should return a number within the specified range', () => {
      for (let i = 0; i < 50; i++) {
        const result = Randomia.randomRange(0, 10);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(10);
      }
    });

    it('should throw error for non-integer values', () => {
      expect(() => Randomia.randomRange(0.5, 10)).toThrow();
    });

    it('should throw error when min >= max', () => {
      expect(() => Randomia.randomRange(10, 10)).toThrow();
      expect(() => Randomia.randomRange(10, 5)).toThrow();
    });
  });

  describe('randomFloat', () => {
    it('should return a float within the specified range', () => {
      for (let i = 0; i < 50; i++) {
        const result = Randomia.randomFloat(0, 1);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(1);
      }
    });

    it('should work with custom ranges', () => {
      const result = Randomia.randomFloat(5.5, 10.5);
      expect(result).toBeGreaterThanOrEqual(5.5);
      expect(result).toBeLessThan(10.5);
    });
  });
});

describe('Randomia - Basic Selection', () => {
  describe('pick', () => {
    it('should return an element from the array', () => {
      const array = [1, 2, 3, 4, 5];
      for (let i = 0; i < 20; i++) {
        const result = Randomia.pick(array);
        expect(array).toContain(result);
      }
    });

    it('should throw error for empty array', () => {
      expect(() => Randomia.pick([])).toThrow();
    });

    it('should return the only element if array has one element', () => {
      expect(Randomia.pick([42])).toBe(42);
    });
  });

  describe('pickMultiple', () => {
    it('should return specified number of elements', () => {
      const array = ['a', 'b', 'c', 'd', 'e'];
      const result = Randomia.pickMultiple(array, 10);
      expect(result).toHaveLength(10);
    });

    it('should only return elements from the array', () => {
      const array = [1, 2, 3, 4, 5];
      const result = Randomia.pickMultiple(array, 50);
      result.forEach((item) => {
        expect(array).toContain(item);
      });
    });

    it('should return empty array when count is 0', () => {
      const result = Randomia.pickMultiple([1, 2, 3], 0);
      expect(result).toHaveLength(0);
    });

    it('should throw error for negative count', () => {
      expect(() => Randomia.pickMultiple([1, 2, 3], -1)).toThrow();
    });
  });

  describe('shuffle', () => {
    it('should return an array with same elements', () => {
      const array = [1, 2, 3, 4, 5];
      const shuffled = Randomia.shuffle(array);
      expect(shuffled).toHaveLength(array.length);
      expect(shuffled.sort((a, b) => a - b)).toEqual(array);
    });

    it('should not modify the original array', () => {
      const array = [1, 2, 3, 4, 5];
      const original = [...array];
      Randomia.shuffle(array);
      expect(array).toEqual(original);
    });

    it('should work with single element', () => {
      const result = Randomia.shuffle([42]);
      expect(result).toEqual([42]);
    });

    it('should work with empty array', () => {
      const result = Randomia.shuffle([]);
      expect(result).toEqual([]);
    });
  });

  describe('sampleWithoutReplacement', () => {
    it('should return unique elements', () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const result = Randomia.sampleWithoutReplacement(array, 5);
      expect(result).toHaveLength(5);
      expect(new Set(result).size).toBe(5);
    });

    it('should only contain elements from the array', () => {
      const array = ['a', 'b', 'c', 'd', 'e'];
      const result = Randomia.sampleWithoutReplacement(array, 3);
      result.forEach((item) => {
        expect(array).toContain(item);
      });
    });

    it('should throw error when count > array length', () => {
      expect(() => Randomia.sampleWithoutReplacement([1, 2, 3], 5)).toThrow();
    });

    it('should return entire array when count equals length', () => {
      const array = [1, 2, 3, 4, 5];
      const result = Randomia.sampleWithoutReplacement(array, 5);
      expect(result).toHaveLength(5);
      expect(new Set(result).size).toBe(5);
    });
  });
});

describe('Randomia - Weighted Functions', () => {
  describe('weightedPick', () => {
    it('should pick an item from the weighted list', () => {
      const items = [
        { item: 'a', weight: 1 },
        { item: 'b', weight: 2 },
        { item: 'c', weight: 3 },
      ];
      for (let i = 0; i < 20; i++) {
        const result = Randomia.weightedPick(items);
        expect(['a', 'b', 'c']).toContain(result);
      }
    });

    it('should respect weight distribution', () => {
      const items = [
        { item: 1, weight: 9 },
        { item: 2, weight: 1 },
      ];
      let count1 = 0;
      for (let i = 0; i < 1000; i++) {
        if (Randomia.weightedPick(items) === 1) {
          count1++;
        }
      }
      expect(count1).toBeGreaterThan(800);
      expect(count1).toBeLessThan(950);
    });

    it('should throw error for empty array', () => {
      expect(() => Randomia.weightedPick([])).toThrow();
    });

    it('should throw error when total weight is 0', () => {
      const items = [
        { item: 'a', weight: 0 },
        { item: 'b', weight: 0 },
      ];
      expect(() => Randomia.weightedPick(items)).toThrow();
    });
  });

  describe('weightedPickMultiple', () => {
    it('should return specified number of items', () => {
      const items = [
        { item: 'a', weight: 1 },
        { item: 'b', weight: 2 },
        { item: 'c', weight: 3 },
      ];
      const result = Randomia.weightedPickMultiple(items, 10);
      expect(result).toHaveLength(10);
    });

    it('should only contain valid items', () => {
      const items = [
        { item: 1, weight: 1 },
        { item: 2, weight: 2 },
      ];
      const result = Randomia.weightedPickMultiple(items, 50);
      result.forEach((item) => {
        expect([1, 2]).toContain(item);
      });
    });
  });

  describe('weightedSampleWithoutReplacement', () => {
    it('should return unique items', () => {
      const items = [
        { item: 'a', weight: 1 },
        { item: 'b', weight: 2 },
        { item: 'c', weight: 3 },
        { item: 'd', weight: 1 },
      ];
      const result = Randomia.weightedSampleWithoutReplacement(items, 3);
      expect(result).toHaveLength(3);
      expect(new Set(result).size).toBe(3);
    });

    it('should throw error when count > items length', () => {
      const items = [
        { item: 'a', weight: 1 },
        { item: 'b', weight: 2 },
      ];
      expect(() => Randomia.weightedSampleWithoutReplacement(items, 5)).toThrow();
    });
  });
});

describe('Randomia - Utility Functions', () => {
  describe('probability', () => {
    it('should return a boolean', () => {
      for (let i = 0; i < 20; i++) {
        const result = Randomia.probability(50);
        expect(typeof result).toBe('boolean');
      }
    });

    it('should throw error for invalid percentage', () => {
      expect(() => Randomia.probability(-1)).toThrow();
      expect(() => Randomia.probability(101)).toThrow();
    });

    it('should always return true for 100%', () => {
      for (let i = 0; i < 10; i++) {
        expect(Randomia.probability(100)).toBe(true);
      }
    });

    it('should always return false for 0%', () => {
      for (let i = 0; i < 10; i++) {
        expect(Randomia.probability(0)).toBe(false);
      }
    });

    it('should respect probability distribution', () => {
      let count = 0;
      for (let i = 0; i < 1000; i++) {
        if (Randomia.probability(75)) {
          count++;
        }
      }
      expect(count).toBeGreaterThan(650);
      expect(count).toBeLessThan(850);
    });
  });

  describe('pickObjectKey', () => {
    it('should return a valid key from object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      for (let i = 0; i < 20; i++) {
        const key = Randomia.pickObjectKey(obj);
        expect(Object.keys(obj)).toContain(key as string);
      }
    });

    it('should throw error for empty object', () => {
      expect(() => Randomia.pickObjectKey({})).toThrow();
    });
  });

  describe('pickObjectValue', () => {
    it('should return a valid value from object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      for (let i = 0; i < 20; i++) {
        const value = Randomia.pickObjectValue(obj);
        expect(Object.values(obj)).toContain(value);
      }
    });
  });
});

describe('Randomia - Byte/Token Generation', () => {
  describe('randomBytes', () => {
    it('should return a Buffer of specified length', () => {
      const result = Randomia.randomBytes(16);
      expect(Buffer.isBuffer(result)).toBe(true);
      expect(result).toHaveLength(16);
    });

    it('should return different bytes on each call', () => {
      const result1 = Randomia.randomBytes(16);
      const result2 = Randomia.randomBytes(16);
      expect(result1).not.toEqual(result2);
    });

    it('should throw error for negative length', () => {
      expect(() => Randomia.randomBytes(-1)).toThrow();
    });
  });

  describe('randomHex', () => {
    it('should return a hex string of specified length', () => {
      const result = Randomia.randomHex(8);
      expect(typeof result).toBe('string');
      expect(result).toHaveLength(16);
      expect(/^[0-9a-f]+$/.test(result)).toBe(true);
    });

    it('should return different strings on each call', () => {
      const result1 = Randomia.randomHex(16);
      const result2 = Randomia.randomHex(16);
      expect(result1).not.toEqual(result2);
    });
  });

  describe('randomToken', () => {
    it('should return a random token string', () => {
      const result = Randomia.randomToken();
      expect(typeof result).toBe('string');
      expect(result).toHaveLength(64);
      expect(/^[0-9a-f]+$/.test(result)).toBe(true);
    });

    it('should return different tokens on each call', () => {
      const result1 = Randomia.randomToken();
      const result2 = Randomia.randomToken();
      expect(result1).not.toEqual(result2);
    });

    it('should support custom length', () => {
      const result = Randomia.randomToken(8);
      expect(result).toHaveLength(16);
    });
  });
});

describe('Functional API', () => {
  it('should have working functional pick', () => {
    const result = pick([1, 2, 3]);
    expect([1, 2, 3]).toContain(result);
  });

  it('should have working functional pickMultiple', () => {
    const result = pickMultiple([1, 2, 3], 5);
    expect(result).toHaveLength(5);
  });

  it('should have working functional shuffle', () => {
    const result = shuffle([1, 2, 3, 4, 5]);
    expect(result).toHaveLength(5);
  });

  it('should have working functional weightedPick', () => {
    const result = weightedPick([
      { item: 'a', weight: 1 },
      { item: 'b', weight: 2 },
    ]);
    expect(['a', 'b']).toContain(result);
  });

  it('should have working functional randomRange', () => {
    const result = randomRange(0, 10);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(10);
  });

  it('should have working functional randomFloat', () => {
    const result = randomFloat(0, 1);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(1);
  });

  it('should have working functional probability', () => {
    const result = probability(50);
    expect(typeof result).toBe('boolean');
  });

  it('should have working functional sampleWithoutReplacement', () => {
    const result = sampleWithoutReplacement([1, 2, 3, 4, 5], 3);
    expect(result).toHaveLength(3);
    expect(new Set(result).size).toBe(3);
  });

  it('should have working functional weightedPickMultiple', () => {
    const items = [
      { item: 'a', weight: 1 },
      { item: 'b', weight: 2 },
      { item: 'c', weight: 3 },
    ];
    const result = weightedPickMultiple(items, 10);
    expect(result).toHaveLength(10);
  });

  it('should have working functional weightedSampleWithoutReplacement', () => {
    const items = [
      { item: 'a', weight: 1 },
      { item: 'b', weight: 2 },
      { item: 'c', weight: 3 },
    ];
    const result = weightedSampleWithoutReplacement(items, 2);
    expect(result).toHaveLength(2);
    expect(new Set(result).size).toBe(2);
  });

  it('should have working functional pickObjectKey', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const key = pickObjectKey(obj);
    expect(Object.keys(obj)).toContain(key as string);
  });

  it('should have working functional pickObjectValue', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const value = pickObjectValue(obj);
    expect(Object.values(obj)).toContain(value);
  });

  it('should have working randomBytesUtil', () => {
    const result = randomBytesUtil(16);
    expect(Buffer.isBuffer(result)).toBe(true);
    expect(result).toHaveLength(16);
  });

  it('should have working randomHex', () => {
    const result = randomHex(8);
    expect(typeof result).toBe('string');
    expect(/^[0-9a-f]+$/.test(result)).toBe(true);
  });

  it('should have working randomToken', () => {
    const result = randomToken();
    expect(typeof result).toBe('string');
    expect(/^[0-9a-f]+$/.test(result)).toBe(true);
  });
});
