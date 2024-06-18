const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MongoDB =require("../db/db")

// Define the schema for the student assessment
const StudentAssessmentSchema = new Schema({
  studentName: { type: String, required: true },
  unit: { type: String, required: true },
  period: { type: String, required: true },
  items: {
    punctuality: {
      rating: { type: String, required: true },
      comment: { type: String }
    },
    appearance: {
      rating: { type: String, required: true },
      comment: { type: String }
    },
    attitude: {
      rating: { type: String, required: true },
      comment: { type: String }
    },
    attendance: {
      rating: { type: String, required: true },
      comment: { type: String }
    },
    relationship: {
      rating: { type: String, required: true },
      comment: { type: String }
    },
    communication: {
      rating: { type: String, required: true },
      comment: { type: String }
    },
    competences: {
      rating: { type: String, required: true },
      comment: { type: String }
    },
    professionalism: {
      rating: { type: String, required: true },
      comment: { type: String }
    }
  },
  areasToImprove: { type: String, required: true },
  comment: { type: String, required: true },
  inCharge: { type: String, required: true },
  rank: { type: String, required: true },
  contactNumber: { type: String, required: true },
  date: { type: Date, required: true }
});

// Create the model from the schema
const StudentAssessment = MongoDB.model('StudentAssessment', StudentAssessmentSchema);

module.exports = StudentAssessment;
