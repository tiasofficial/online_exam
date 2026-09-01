var mongoose = require('mongoose');

var questionBankSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true
  },
  bodyImage: {
    type: String,
    default: ''
  },
  options: [{
    type: String,
    required: true
  }],
  optionImages: [{
    type: String
  }],
  answer: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  subject: {
    type: String, // 'Physics', 'Chemistry', 'Mathematics', 'Biology'
    required: true
  },
  examType: {
    type: String, // 'JEE-Mains', 'NEET', 'BOTH'
    enum: ['JEE-Mains', 'NEET', 'BOTH'],
    default: 'BOTH'
  },
  topic: {
    type: String,
    default: 'General'
  },
  questionType: {
    type: String,
    enum: ['SINGLE', 'MULTIPLE', 'NUMERICAL'],
    default: 'SINGLE'
  },
  marks: {
    type: Number,
    default: 4
  },
  explanation: {
    type: String,
    default: ''
  },
  isPyq: {
    type: Boolean,
    default: false
  },
  pyqTag: {
    type: String, // e.g. 'JEE Main 2023', 'NEET 2022'
    default: ''
  },
  subtopic: {
    type: String,
    default: ''
  },
  micro_concept: {
    type: String,
    default: ''
  },
  exam_style: {
    type: String,
    enum: ['JEE-Mains', 'JEE-Advanced', 'NEET', 'BOTH'],
    default: 'BOTH'
  },
  concept_fingerprint: {
    type: String,
    default: ''
  },
  reasoning_path: {
    type: String,
    default: ''
  },
  formula_dependency: {
    type: String,
    default: ''
  },
  representation_type: {
    type: String,
    enum: ['CONCEPTUAL', 'NUMERICAL', 'GRAPHICAL', 'DIAGRAM', 'EXPERIMENTAL', 'STATEMENT', 'MATCH_COLUMN', 'ASSERTION_REASON', 'INTEGER'],
    default: 'CONCEPTUAL'
  },
  misconception_target: {
    type: String,
    default: ''
  },
  source_type: {
    type: String,
    enum: ['ORIGINAL', 'PYQ'],
    default: 'ORIGINAL'
  },
  source_exam: {
    type: String,
    default: ''
  },
  source_year: {
    type: Number,
    default: null
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = questionBankSchema;

