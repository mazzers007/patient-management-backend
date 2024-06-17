const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Confirmed', 'Cancelled', 'No Show', 'Completed'],
    default: 'Scheduled'
  }
}, { timestamps: true });

// Automatically populate patient's first and last names when querying appointments
appointmentSchema.virtual('patientFirstName', {
    ref: 'Patient',
    localField: 'patient',
    foreignField: 'firstName',
    justOne: true
  });
  
  appointmentSchema.virtual('patientLastName', {
    ref: 'Patient',
    localField: 'patient',
    foreignField: 'lastName',
    justOne: true
  });

module.exports = mongoose.model('Appointment', appointmentSchema);
