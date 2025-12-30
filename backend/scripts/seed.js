const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Challenge = require('../models/Challenge');
const Location = require('../models/Location');

dotenv.config();

const challenges = [
  {
    challengeId: 'paris_quiz',
    type: 'quiz',
    question: 'What is the famous tower in Paris called?',
    options: ['Eiffel Tower', 'Leaning Tower', 'Big Ben', 'Colosseum'],
    answer: 'Eiffel Tower',
    hint: 'It was built for the 1889 World\'s Fair',
    points: 50,
    difficulty: 'easy'
  },
  {
    challengeId: 'tokyo_riddle',
    type: 'riddle',
    question: 'I am a city that never sleeps, where ancient meets modern. What am I?',
    options: [],
    answer: 'Tokyo',
    hint: 'The capital of Japan',
    points: 50,
    difficulty: 'medium'
  },
  {
    challengeId: 'newyork_logic',
    type: 'logic',
    question: 'If the Statue of Liberty was dedicated in 1886, and it is 2025 now, how many years has it been standing?',
    options: [],
    answer: '138',
    hint: 'Subtract 1886 from 2024',
    points: 50,
    difficulty: 'easy'
  },
  {
    challengeId: 'london_word',
    type: 'word',
    question: 'What is the name of the famous clock tower in London?',
    options: [],
    answer: 'Big Ben',
    hint: 'It\'s in the Palace of Westminster',
    points: 50,
    difficulty: 'easy'
  },
  {
    challengeId: 'sydney_quiz',
    type: 'quiz',
    question: 'What is the iconic opera house in Sydney called?',
    options: ['Sydney Opera House', 'Sydney Theatre', 'Sydney Concert Hall', 'Sydney Music Hall'],
    answer: 'Sydney Opera House',
    hint: 'It has distinctive shell-like structures',
    points: 50,
    difficulty: 'easy'
  },
  {
    challengeId: 'cairo_riddle',
    type: 'riddle',
    question: 'I am one of the Seven Wonders of the Ancient World, located in Egypt. What am I?',
    options: [],
    answer: 'Pyramids',
    hint: 'They are triangular structures',
    points: 75,
    difficulty: 'medium'
  },
  {
    challengeId: 'dubai_logic',
    type: 'logic',
    question: 'If the Burj Khalifa is 828 meters tall, and 1 meter = 3.28 feet, approximately how many feet tall is it? (Round to nearest hundred)',
    options: [],
    answer: '2700',
    hint: 'Multiply 828 by 3.28',
    points: 75,
    difficulty: 'medium'
  },
  {
    challengeId: 'rome_quiz',
    type: 'quiz',
    question: 'What ancient amphitheater in Rome is one of the most famous landmarks?',
    options: ['Colosseum', 'Pantheon', 'Forum', 'Circus Maximus'],
    answer: 'Colosseum',
    hint: 'It was used for gladiatorial contests',
    points: 50,
    difficulty: 'easy'
  }
];

const locations = [
  {
    locationId: 'paris',
    name: 'Paris',
    country: 'France',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    challengeId: null, // Will be set after challenges are created
    points: 50,
    badge: 'paris_explorer',
    locked: false,
    unlockRequirement: 0
  },
  {
    locationId: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    coordinates: { lat: 35.6762, lng: 139.6503 },
    challengeId: null,
    points: 50,
    badge: 'tokyo_explorer',
    locked: false,
    unlockRequirement: 0
  },
  {
    locationId: 'newyork',
    name: 'New York',
    country: 'USA',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    challengeId: null,
    points: 50,
    badge: 'newyork_explorer',
    locked: false,
    unlockRequirement: 0
  },
  {
    locationId: 'london',
    name: 'London',
    country: 'UK',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    challengeId: null,
    points: 50,
    badge: 'london_explorer',
    locked: false,
    unlockRequirement: 0
  },
  {
    locationId: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    coordinates: { lat: -33.8688, lng: 151.2093 },
    challengeId: null,
    points: 50,
    badge: 'sydney_explorer',
    locked: false,
    unlockRequirement: 0
  },
  {
    locationId: 'cairo',
    name: 'Cairo',
    country: 'Egypt',
    coordinates: { lat: 30.0444, lng: 31.2357 },
    challengeId: null,
    points: 75,
    badge: 'cairo_explorer',
    locked: false,
    unlockRequirement: 2
  },
  {
    locationId: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    coordinates: { lat: 25.2048, lng: 55.2708 },
    challengeId: null,
    points: 75,
    badge: 'dubai_explorer',
    locked: false,
    unlockRequirement: 3
  },
  {
    locationId: 'rome',
    name: 'Rome',
    country: 'Italy',
    coordinates: { lat: 41.9028, lng: 12.4964 },
    challengeId: null,
    points: 50,
    badge: 'rome_explorer',
    locked: false,
    unlockRequirement: 1
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/treasure-hunt');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Challenge.deleteMany({});
    await Location.deleteMany({});
    console.log('Cleared existing data');

    // Insert challenges
    const createdChallenges = await Challenge.insertMany(challenges);
    console.log(`Created ${createdChallenges.length} challenges`);

    // Map challenge IDs to locations
    const challengeMap = {
      'paris': 'paris_quiz',
      'tokyo': 'tokyo_riddle',
      'newyork': 'newyork_logic',
      'london': 'london_word',
      'sydney': 'sydney_quiz',
      'cairo': 'cairo_riddle',
      'dubai': 'dubai_logic',
      'rome': 'rome_quiz'
    };

    // Set challenge IDs for locations
    locations.forEach(location => {
      const challenge = createdChallenges.find(c => c.challengeId === challengeMap[location.locationId]);
      if (challenge) {
        location.challengeId = challenge._id;
      }
    });

    // Insert locations
    const createdLocations = await Location.insertMany(locations);
    console.log(`Created ${createdLocations.length} locations`);

    console.log('Seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();

