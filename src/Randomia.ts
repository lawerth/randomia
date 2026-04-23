import { randomInt, randomBytes } from 'crypto';

/**
 * Options for weighted random selection
 */
export interface WeightedItem<T> {
  item: T;
  weight: number;
}

/**
 * Cryptographically secure random selection utility class
 * Uses Node.js crypto module for unpredictable randomness
 * All operations are cryptographically secure and suitable for security-critical applications
 */
export class Randomia {
  /**
   * Generate a cryptographically secure random integer between min (inclusive) and max (exclusive)
   */
  static randomRange(min: number, max: number): number {
    if (min >= max) {
      throw new Error('min must be less than max');
    }
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      throw new Error('min and max must be integers');
    }

    return randomInt(min, max);
  }

  /**
   * Generate a cryptographically secure random float between min (inclusive) and max (exclusive)
   */
  static randomFloat(min: number, max: number): number {
    if (min >= max) {
      throw new Error('min must be less than max');
    }

    const bytes = randomBytes(4);
    const value = bytes.readUInt32BE(0);
    const random = value / 0xffffffff;
    return random * (max - min) + min;
  }

  /**
   * Pick a cryptographically secure random element from an array
   */
  static pick<T>(array: T[]): T {
    if (array.length === 0) {
      throw new Error('Cannot pick from an empty array');
    }
    const index = this.randomRange(0, array.length);
    return array[index];
  }

  /**
   * Pick multiple cryptographically secure random elements from an array (with replacement)
   */
  static pickMultiple<T>(array: T[], count: number): T[] {
    if (array.length === 0) {
      throw new Error('Cannot pick from an empty array');
    }
    if (count < 0) {
      throw new Error('count must be non-negative');
    }

    const result: T[] = [];
    for (let i = 0; i < count; i++) {
      result.push(this.pick(array));
    }
    return result;
  }

  /**
   * Cryptographically secure sample without replacement
   */
  static sampleWithoutReplacement<T>(array: T[], count: number): T[] {
    if (array.length === 0) {
      throw new Error('Cannot sample from an empty array');
    }
    if (count < 0) {
      throw new Error('count must be non-negative');
    }
    if (count > array.length) {
      throw new Error('count cannot be greater than array length');
    }

    const shuffled = this.shuffle([...array]);
    return shuffled.slice(0, count);
  }

  /**
   * Cryptographically secure shuffle using Fisher-Yates algorithm
   */
  static shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.randomRange(0, i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Pick a cryptographically secure random element based on weights
   */
  static weightedPick<T>(items: WeightedItem<T>[]): T {
    if (items.length === 0) {
      throw new Error('Cannot pick from an empty array');
    }

    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    if (totalWeight <= 0) {
      throw new Error('Total weight must be greater than 0');
    }

    const random = this.randomFloat(0, totalWeight);
    let accumulated = 0;

    for (const item of items) {
      accumulated += item.weight;
      if (random <= accumulated) {
        return item.item;
      }
    }

    return items[items.length - 1].item;
  }

  /**
   * Pick multiple cryptographically secure weighted random elements (with replacement)
   */
  static weightedPickMultiple<T>(items: WeightedItem<T>[], count: number): T[] {
    if (count < 0) {
      throw new Error('count must be non-negative');
    }

    const result: T[] = [];
    for (let i = 0; i < count; i++) {
      result.push(this.weightedPick(items));
    }
    return result;
  }

  /**
   * Cryptographically secure weighted sample without replacement
   */
  static weightedSampleWithoutReplacement<T>(items: WeightedItem<T>[], count: number): T[] {
    if (items.length === 0) {
      throw new Error('Cannot sample from an empty array');
    }
    if (count < 0) {
      throw new Error('count must be non-negative');
    }
    if (count > items.length) {
      throw new Error('count cannot be greater than items length');
    }

    const remaining = [...items];
    const result: T[] = [];

    for (let i = 0; i < count; i++) {
      const picked = this.weightedPick(remaining);
      result.push(picked);
      const pickedIndex = remaining.findIndex((item) => item.item === picked);
      remaining.splice(pickedIndex, 1);
    }

    return result;
  }

  /**
   * Cryptographically secure probability check
   */
  static probability(percentage: number): boolean {
    if (percentage < 0 || percentage > 100) {
      throw new Error('Percentage must be between 0 and 100');
    }
    return this.randomFloat(0, 100) < percentage;
  }

  /**
   * Cryptographically secure random object key selection
   */
  static pickObjectKey<T extends Record<string, any>>(obj: T): keyof T {
    const keys = Object.keys(obj) as (keyof T)[];
    if (keys.length === 0) {
      throw new Error('Cannot pick from an empty object');
    }
    return this.pick(keys);
  }

  /**
   * Cryptographically secure random object value selection
   */
  static pickObjectValue<T extends Record<string, any>>(obj: T): T[keyof T] {
    const key = this.pickObjectKey(obj);
    return obj[key];
  }

  /**
   * Generate cryptographically secure random bytes
   */
  static randomBytes(length: number): Buffer {
    if (length < 0) {
      throw new Error('length must be non-negative');
    }
    return randomBytes(length);
  }

  /**
   * Generate cryptographically secure random hex string
   */
  static randomHex(length: number): string {
    return this.randomBytes(length).toString('hex');
  }

  /**
   * Generate cryptographically secure random token
   */
  static randomToken(length: number = 32): string {
    return this.randomHex(length);
  }
}


/**
 * Pick a cryptographically secure random element from an array
 */
export function pick<T>(array: T[]): T {
  return Randomia.pick(array);
}

/**
 * Pick multiple cryptographically secure random elements from an array
 */
export function pickMultiple<T>(array: T[], count: number): T[] {
  return Randomia.pickMultiple(array, count);
}

/**
 * Cryptographically secure sample without replacement
 */
export function sampleWithoutReplacement<T>(array: T[], count: number): T[] {
  return Randomia.sampleWithoutReplacement(array, count);
}

/**
 * Cryptographically secure shuffle
 */
export function shuffle<T>(array: T[]): T[] {
  return Randomia.shuffle(array);
}

/**
 * Cryptographically secure weighted pick
 */
export function weightedPick<T>(items: WeightedItem<T>[]): T {
  return Randomia.weightedPick(items);
}

/**
 * Cryptographically secure weighted pick multiple
 */
export function weightedPickMultiple<T>(items: WeightedItem<T>[], count: number): T[] {
  return Randomia.weightedPickMultiple(items, count);
}

/**
 * Cryptographically secure weighted sample without replacement
 */
export function weightedSampleWithoutReplacement<T>(items: WeightedItem<T>[], count: number): T[] {
  return Randomia.weightedSampleWithoutReplacement(items, count);
}

/**
 * Cryptographically secure probability check
 */
export function probability(percentage: number): boolean {
  return Randomia.probability(percentage);
}

/**
 * Cryptographically secure random range (integer)
 */
export function randomRange(min: number, max: number): number {
  return Randomia.randomRange(min, max);
}

/**
 * Cryptographically secure random float
 */
export function randomFloat(min: number, max: number): number {
  return Randomia.randomFloat(min, max);
}

/**
 * Cryptographically secure random object key
 */
export function pickObjectKey<T extends Record<string, any>>(obj: T): keyof T {
  return Randomia.pickObjectKey(obj);
}

/**
 * Cryptographically secure random object value
 */
export function pickObjectValue<T extends Record<string, any>>(obj: T): T[keyof T] {
  return Randomia.pickObjectValue(obj);
}

/**
 * Cryptographically secure random bytes
 */
export function randomBytesUtil(length: number): Buffer {
  return Randomia.randomBytes(length);
}

/**
 * Cryptographically secure random hex string
 */
export function randomHex(length: number): string {
  return Randomia.randomHex(length);
}

/**
 * Cryptographically secure random token
 */
export function randomToken(length?: number): string {
  return Randomia.randomToken(length);
}

export default Randomia;
