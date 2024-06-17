const mongoose = require('mongoose');
const Email = require('mongoose-type-email');

const patientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  otherNames: {
    type: String
  },
  lastName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  allergies: [String],
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  email: {
    type: Email,
    required: true
  },
  existingConditions: [String],
  medicalHistory: [{
    date: {
      type: Date,
      required: true
    },
    diagnosis: {
      type: String,
      required: true
    },
    consultationType: {
      type: String,
      enum: ['In Person', 'Phone'],
      required: true
    }
  }],
  prescribedMedicine: [{
    date: {
      type: Date,
      required: true
    },
    consultationType: {
      type: String,
      enum: ['In Person', 'Phone'],
      required: true
    },
    medicines: [{
      name: {
        type: String,
        required: true
      },
      dosage: {
        type: String,
        required: true
      },
      usage: {
        type: String
      }
    }]
  }]
});

// Virtual to calculate age based on date of birth
patientSchema.virtual('age').get(function() {
  const dob = this.dateOfBirth;
  const ageDifMs = Date.now() - dob.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
