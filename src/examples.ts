/// <reference lib="dom" />

import Randomia, {
  pick,
  pickMultiple,
  shuffle,
  weightedPick,
  randomRange,
  randomFloat,
  probability,
  sampleWithoutReplacement,
  randomBytesUtil,
  randomHex,
  randomToken,
  WeightedItem,
} from '../src/Randomia';

function example1_basicSelection() {
  const fruits = ['apple', 'banana', 'orange', 'grape', 'strawberry'];
  const randomFruit = pick(fruits);
  console.log('Random fruit:', randomFruit);

  const anotherFruit = Randomia.pick(fruits);
  console.log('Another random fruit:', anotherFruit);

  const multipleFruits = pickMultiple(fruits, 3);
  console.log('Three random fruits:', multipleFruits);
}

function example2_shuffling() {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const shuffled = shuffle(numbers);

  console.log('Original:', numbers);
  console.log('Shuffled:', shuffled);
  console.log('Original unchanged:', numbers);
}

function example3_randomNumbers() {
  const diceRoll = randomRange(1, 7);
  console.log('Dice roll (1-6):', diceRoll);

  const percentage = randomRange(0, 101);
  console.log('Percentage (0-100):', percentage);

  const floatNumber = randomFloat(0, 1);
  console.log('Random float (0-1):', floatNumber);
}

function example4_weightedSelection() {
  interface Loot {
    name: string;
    rarity: string;
  }

  const lootTable: WeightedItem<Loot>[] = [
    { item: { name: 'Iron Sword', rarity: 'Common' }, weight: 50 },
    { item: { name: 'Steel Sword', rarity: 'Uncommon' }, weight: 30 },
    { item: { name: 'Gold Sword', rarity: 'Rare' }, weight: 15 },
    { item: { name: 'Legendary Sword', rarity: 'Mythic' }, weight: 5 },
  ];

  console.log('Generating 10 random loots:');
  for (let i = 0; i < 10; i++) {
    const loot = weightedPick(lootTable);
    console.log(`  ${i + 1}. ${loot.name} (${loot.rarity})`);
  }
}

function example5_probability() {
  const battleSimulation = () => {
    let damage = 10;

    if (probability(30)) {
      damage *= 2;
      console.log('CRITICAL HIT!');
    } else {
      console.log('Normal hit');
    }

    if (probability(15)) {
      console.log('Enemy dodged!');
      damage = 0;
    }

    return damage;
  };

  console.log('Simulating 5 attacks:');
  for (let i = 0; i < 5; i++) {
    const damage = battleSimulation();
    console.log(`  Attack ${i + 1} damage: ${damage}\n`);
  }
}

function example6_samplingWithoutReplacement() {
  const players = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];

  const selectedPlayers = sampleWithoutReplacement(players, 3);
  console.log('Players selected for quiz:', selectedPlayers.join(', '));

  const uniqueCount = new Set(selectedPlayers).size;
  console.log('All unique:', uniqueCount === selectedPlayers.length);
}

function example7_objectOperations() {
  const config = {
    backgroundColor: '#FF5733',
    fontSize: '16px',
    fontFamily: 'Arial',
    borderRadius: '5px',
  };

  const randomKey = Randomia.pickObjectKey(config);
  const randomValue = Randomia.pickObjectValue(config);

  console.log('Random config key:', randomKey);
  console.log('Random config value:', randomValue);
}

function example8_weightedSamplingWithoutReplacement() {
  interface Card {
    name: string;
    type: string;
  }

  const cardDeck: WeightedItem<Card>[] = [
    { item: { name: 'Fireball', type: 'Spell' }, weight: 3 },
    { item: { name: 'Heal', type: 'Spell' }, weight: 2 },
    { item: { name: 'Sword', type: 'Weapon' }, weight: 4 },
    { item: { name: 'Shield', type: 'Armor' }, weight: 2 },
  ];

  const selectedCards = Randomia.weightedSampleWithoutReplacement(cardDeck, 3);
  selectedCards.forEach((card, index) => {
    console.log(`  ${index + 1}. ${card.name} (${card.type})`);
  });
}

function example9_tokenGeneration() {
  const sessionToken = Randomia.randomToken();
  console.log('Session Token:', sessionToken);

  const apiKey = Randomia.randomHex(32);
  console.log('API Key:', apiKey);

  const bytes = randomBytesUtil(16);
  console.log('Random bytes:', bytes.toString('hex'));
}

function example10_fairLottery() {
  interface Prize {
    name: string;
    value: number;
  }

  const prizes: WeightedItem<Prize>[] = [
    { item: { name: 'Consolation', value: 10 }, weight: 60 },
    { item: { name: 'Silver', value: 500 }, weight: 30 },
    { item: { name: 'Gold', value: 5000 }, weight: 10 },
  ];

  console.log('Drawing 5 lottery winners:');
  for (let i = 0; i < 5; i++) {
    const prize = Randomia.weightedPick(prizes);
    console.log(`  Winner ${i + 1}: ${prize.name} - $${prize.value}`);
  }
}

function runAllExamples() {
  example1_basicSelection();
  example2_shuffling();
  example3_randomNumbers();
  example4_weightedSelection();
  example5_probability();
  example6_samplingWithoutReplacement();
  example7_objectOperations();
  example8_weightedSamplingWithoutReplacement();
  example9_tokenGeneration();
  example10_fairLottery();
}

export {
  example1_basicSelection,
  example2_shuffling,
  example3_randomNumbers,
  example4_weightedSelection,
  example5_probability,
  example6_samplingWithoutReplacement,
  example7_objectOperations,
  example8_weightedSamplingWithoutReplacement,
  example9_tokenGeneration,
  example10_fairLottery,
  runAllExamples,
};
