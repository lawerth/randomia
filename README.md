# Randomia

Cryptographically secure random selection library for JavaScript/TypeScript.

## Features

- 🔒 **Cryptographically Secure**: All operations use `crypto.randomInt` and `crypto.randomBytes`
- 🎲 **Random Selection**: Pick random elements from arrays
- ⚖️ **Weighted Selection**: Pick elements based on custom weights
- 🔀 **Shuffle**: Secure Fisher-Yates shuffle algorithm
- 📊 **Sampling**: Sample with and without replacement
- 🎯 **Probability**: Check if random events occur
- 🔢 **Random Numbers**: Generate random integers and floats
- 🔑 **Token Generation**: Generate secure tokens, hex strings, and random bytes
- 🎭 **Hybrid API**: Both class-based and functional approaches
- 📝 **TypeScript**: Full TypeScript support with type definitions

## Installation

```bash
npm install randomia
```

## Quick Start

### Using Functional API

```typescript
import { pick, shuffle, randomRange, probability } from "randomia";

// Pick a random element (cryptographically secure)
const selected = pick(["apple", "banana", "orange"]);

// Shuffle an array
const shuffled = shuffle([1, 2, 3, 4, 5]);

// Generate random number between 1 and 100
const num = randomRange(1, 100);

// Check if something happens (50% chance)
if (probability(50)) {
  console.log("Lucky!");
}
```

### Using Class-Based API

```typescript
import Randomia from "randomia";

// Pick a random element
const selected = Randomia.pick(["apple", "banana", "orange"]);

// Shuffle an array
const shuffled = Randomia.shuffle([1, 2, 3, 4, 5]);

// Generate random number
const num = Randomia.randomRange(1, 100);

// Generate a secure token
const token = Randomia.randomToken();
```

## API Reference

### Random Numbers

#### `randomRange(min: number, max: number): number`

Generate a cryptographically secure random integer between min (inclusive) and max (exclusive).

```typescript
randomRange(1, 100); // Returns a number between 1 and 99
```

#### `randomFloat(min: number, max: number): number`

Generate a cryptographically secure random float between min (inclusive) and max (exclusive).

```typescript
randomFloat(0, 1); // Returns a decimal between 0 and 0.999...
```

### Basic Selection

#### `pick<T>(array: T[]): T`

Pick a single random element from an array.

```typescript
pick([1, 2, 3, 4, 5]); // Returns one random element
```

#### `pickMultiple<T>(array: T[], count: number): T[]`

Pick multiple random elements with replacement.

```typescript
pickMultiple(["a", "b", "c"], 5); // Returns 5 elements (may have duplicates)
```

#### `sampleWithoutReplacement<T>(array: T[], count: number): T[]`

Pick multiple unique random elements without replacement.

```typescript
sampleWithoutReplacement([1, 2, 3, 4, 5], 3); // Returns 3 unique elements
```

### Shuffling

#### `shuffle<T>(array: T[]): T[]`

Shuffle an array using cryptographically secure Fisher-Yates algorithm (non-destructive).

```typescript
shuffle([1, 2, 3, 4, 5]); // Returns shuffled array, original unchanged
```

### Weighted Selection

Use weighted selection to pick items based on probability weights.

#### `weightedPick<T>(items: WeightedItem<T>[]): T`

Pick one element based on weights.

```typescript
const items = [
  { item: "common", weight: 70 },
  { item: "rare", weight: 20 },
  { item: "legendary", weight: 10 },
];

weightedPick(items); // More likely to pick 'common'
```

#### `weightedPickMultiple<T>(items: WeightedItem<T>[], count: number): T[]`

Pick multiple elements with replacement based on weights.

```typescript
const items = [
  { item: "heads", weight: 50 },
  { item: "tails", weight: 50 },
];

weightedPickMultiple(items, 10); // Simulate 10 coin flips
```

#### `weightedSampleWithoutReplacement<T>(items: WeightedItem<T>[], count: number): T[]`

Pick multiple unique elements without replacement based on weights.

```typescript
const items = [
  { item: "item1", weight: 1 },
  { item: "item2", weight: 2 },
  { item: "item3", weight: 3 },
];

weightedSampleWithoutReplacement(items, 2); // Returns 2 unique items
```

### Probability

#### `probability(percentage: number): boolean`

Check if a random event occurs with the given probability (0-100).

```typescript
if (probability(25)) {
  console.log("25% chance occurred!");
}

// Simulate critical hit with 15% chance
if (probability(15)) {
  damage *= 2;
}
```

### Object Operations

#### `pickObjectKey<T>(obj: T): keyof T`

Pick a random key from an object.

```typescript
const obj = { a: 1, b: 2, c: 3 };
pickObjectKey(obj); // Returns 'a', 'b', or 'c'
```

#### `pickObjectValue<T>(obj: T): T[keyof T]`

Pick a random value from an object.

```typescript
const obj = { name: "John", age: 30, city: "NYC" };
pickObjectValue(obj); // Returns 'John', 30, or 'NYC'
```

### Token & Byte Generation

#### `Randomia.randomBytes(length: number): Buffer`

Generate cryptographically secure random bytes.

```typescript
const bytes = Randomia.randomBytes(32); // 32 random bytes
```

#### `Randomia.randomHex(length: number): string`

Generate a hex-encoded random string.

```typescript
const hex = Randomia.randomHex(16); // 32-char hex string
```

#### `Randomia.randomToken(length?: number): string`

Generate a secure token (default 32 bytes = 64 hex characters).

```typescript
const token = Randomia.randomToken(); // 64-char hex token
const shortToken = Randomia.randomToken(8); // 16-char hex token
```

## WeightedItem Interface

```typescript
interface WeightedItem<T> {
  item: T;
  weight: number;
}
```

The `weight` value determines the relative probability of selection. Weights are normalized internally, so you can use any positive numbers:

- Weights: [1, 1, 1] → Each has 33.3% probability
- Weights: [1, 2, 3] → Probabilities: 16.7%, 33.3%, 50%
- Weights: [10, 5, 5] → Probabilities: 50%, 25%, 25%

## Examples

### Dice Roll Simulator

```typescript
import { randomRange } from "randomia";

function rollDice(sides = 6): number {
  return randomRange(1, sides + 1);
}

console.log(rollDice()); // 1-6
console.log(rollDice(20)); // 1-20
```

### Fair Lottery System

```typescript
import { weightedPick } from "randomia";

const prizes = [
  { item: { name: "Consolation", value: 10 }, weight: 70 },
  { item: { name: "Silver", value: 100 }, weight: 25 },
  { item: { name: "Gold", value: 1000 }, weight: 5 },
];

const prize = weightedPick(prizes);
console.log(`You won: ${prize.name} (${prize.value} points)`);
```

### Team Selection

```typescript
import { sampleWithoutReplacement } from "randomia";

const players = ["Alice", "Bob", "Charlie", "Diana", "Eve"];
const team1 = sampleWithoutReplacement(players, 2);
const team2 = sampleWithoutReplacement(players, 2);

console.log(`Team 1: ${team1.join(", ")}`);
console.log(`Team 2: ${team2.join(", ")}`);
```

### Secure Token Generator

```typescript
import Randomia from "randomia";

function generateSessionToken(): string {
  return Randomia.randomHex(32); // 64-char hex token
}

function generateSecureID(prefix: string): string {
  const random = Randomia.randomToken();
  return `${prefix}-${random}`;
}

const sessionId = generateSessionToken();
const userId = generateSecureID("user");

console.log(sessionId); // e.g., "a3f5d2e1b8c4f9a7e2d5c1b8a3f5d2e1..."
console.log(userId); // e.g., "user-f9a7e2d5c1b8a3f5d2e1a3f5d2e1b8c..."
```

## Error Handling

The library throws descriptive errors for invalid inputs:

```typescript
try {
  pick([]); // Throws: "Cannot pick from an empty array"
} catch (error) {
  console.error(error.message);
}

try {
  randomRange(10, 5); // Throws: "min must be less than max"
} catch (error) {
  console.error(error.message);
}

try {
  probability(150); // Throws: "Percentage must be between 0 and 100"
} catch (error) {
  console.error(error.message);
}
```

## TypeScript Support

All functions have full TypeScript support with proper type inference:

```typescript
interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

const randomUser = pick(users); // Type: User
const selected = pickMultiple(users, 3); // Type: User[]

const weighted = [
  { item: users[0], weight: 70 },
  { item: users[1], weight: 30 },
];

const weightedUser = weightedPick(weighted); // Type: User
```

## Security

All random operations in this library use the Node.js `crypto` module:

- `crypto.randomInt()` for integer generation
- `crypto.randomBytes()` for byte/float generation

This ensures that all selections are **cryptographically secure** and **completely unpredictable**. Suitable for:

- 🔐 Security tokens and session IDs
- 💳 Cryptographic operations
- 🎲 Fair gaming systems with real stakes
- 🏆 Lottery systems that must be unpredictable
- 🔑 Key generation

## License

MIT

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
