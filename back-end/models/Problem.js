const mongoose = require('mongoose');

const testcaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  output: {
    type: String,
    required: true,
  }
});

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true, // Titles should be unique
    trim: true
  },
  statement: {
    type: String,
    required: true
  },
  constraints: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'], // restrict to known values
    required: true
  },
  testcases: {
    type: [testcaseSchema],
    default: []
  }
});

module.exports = mongoose.model('Problem', problemSchema);
