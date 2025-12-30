const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  challengeId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['quiz', 'riddle', 'logic', 'word', 'number'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String
  }],
  answer: {
    type: String,
    required: true
  },
  hint: {
    type: String,
    default: ''
  },
  points: {
    type: Number,
    default: 50
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  }
});

module.exports = mongoose.model('Challenge', challengeSchema);

