const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  locationId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  locked: {
    type: Boolean,
    default: false
  },
  unlockRequirement: {
    type: Number,
    default: 0 // Number of locations that must be completed before this unlocks
  },
  points: {
    type: Number,
    default: 50
  },
  badge: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Location', locationSchema);

