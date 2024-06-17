const Appointment = require('../models/appointmentModel');
const Patient = require('../models/patientModel');
const { logAction } = require('../middleware/auditMiddleware');

// Controller methods
exports.createAppointment = async (req, res) => {
  try {
    const { patientId, dateTime, reason } = req.body;

    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if an appointment already exists for the specified dateTime
    const existingAppointment = await Appointment.findOne({ dateTime });
    if (existingAppointment) {
        return res.status(400).json({ message: 'An appointment already exists for the specified date and time' });
    }

    // Create new appointment
    const appointment = new Appointment({
      patient: patientId,
      dateTime,
      reason
    });

    // Save appointment
    const newAppointment = await appointment.save();

    // Audit
    const action = 'Created Appointment';
    const patientName = patient.otherNames
      ? `${patient.firstName} ${patient.otherNames} ${patient.lastName}`
      : `${patient.firstName} ${patient.lastName}`;
    const details = 'Created Appointment for ' + patientName + ' scheduled at ' + dateTime + ' and reason: ' + reason;

    await logAction(req, action, details);

    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
      const appointments = await Appointment.find();
      res.json(appointments);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

exports.getAppointmentsByPatient = async (req, res) => {
    try {
      const { patientId } = req.params;

      // Check if patient exists
       const patient = await Patient.findById(patientId);
       if (!patient) {
           return res.status(404).json({ message: 'Patient not found' });
       }
  
      // Retrieve appointments for the patient
      const appointments = await Appointment.find({ patient: patientId })
        .populate('patient', 'firstName lastName'); // Populate patient's first and last names
  
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const originalAppointment = await Appointment.findById(id);
    const patient = await Patient.findById(originalAppointment.patient);

    if (!originalAppointment) {
      return res.status(404).json({ message: 'Original Appointment not found' });
    }

    // Update appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(id, update, { new: true });

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment Update failed' });
    }

    // Determine the changed fields
    const changes = {};
    for (const key in req.body) {
      if (req.body[key] !== originalAppointment[key]) {
        changes[key] = {
          before: originalAppointment[key],
          after: req.body[key]
        };
      }
    }

    // Audit
    const action = 'Updated Appointment';
    const patientName = patient.otherNames
      ? `${patient.firstName} ${patient.otherNames} ${patient.lastName}`
      : `${patient.firstName} ${patient.lastName}`;
    const details = 'Updated Appointment for ' + patientName + ' that was scheduled at ' + originalAppointment.dateTime + ' and changes: ' + JSON.stringify(changes);

    await logAction(req, action, details);

    res.json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const originalAppointment = await Appointment.findById(id);
    const patient = await Patient.findById(originalAppointment.patient);

    if (!originalAppointment) {
      return res.status(404).json({ message: 'Original Appointment not found' });
    }

    // Update appointment status to "Canceled"
    const canceledAppointment = await Appointment.findByIdAndUpdate(id, { status: 'Cancelled' }, { new: true });

    if (!canceledAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Audit
    const action = 'Cancelled Appointment';
    const patientName = patient.otherNames
      ? `${patient.firstName} ${patient.otherNames} ${patient.lastName}`
      : `${patient.firstName} ${patient.lastName}`;
    const details = 'Cancelled Appointment for ' + patientName + ' that was scheduled at ' + originalAppointment.dateTime;

    await logAction(req, action, details);
    
    res.json(canceledAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
