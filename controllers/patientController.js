const Patient = require('../models/patientModel');
const { logAction } = require('../middleware/auditMiddleware');

// Controller functions
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller method to find patient by ID
exports.findPatientById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const patient = await Patient.findById(id);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      res.json(patient);
    } catch (err) {
      next(err);
    }
};

// Function to update patient's medical history
exports.updateMedicalHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { diagnosis, consultationType } = req.body;

    // Find the patient by ID
    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Push new entry to medical history array
    patient.medicalHistory.push({ date: Date.now(), diagnosis: diagnosis, consultationType: consultationType });

    // Save patient document
    await patient.save();

    // Audit
    const action = 'Updated Medical History';
    const patientName = patient.otherNames
      ? `${patient.firstName} ${patient.otherNames} ${patient.lastName}`
      : `${patient.firstName} ${patient.lastName}`;
    const info = 'Diagnosis: ' + diagnosis + ' and consultation type: ' + consultationType;
    const details = 'Updated Medical History of patient ' + patientName + ' with -> ' + info;

    await logAction(req, action, details);

    res.json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updatePrescribedMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { medicines, consultationType } = req.body;

    // Find the patient by ID
    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Push new entry to medical history array
    patient.prescribedMedicine.push({ date: Date.now(), consultationType: consultationType, medicines: medicines });

    // Save patient document
    await patient.save();

    // Audit
    const action = 'Prescribed Medicine';
    const patientName = patient.otherNames
      ? `${patient.firstName} ${patient.otherNames} ${patient.lastName}`
      : `${patient.firstName} ${patient.lastName}`;
    const info = 'Medicines: ' + medicines + ' and consultation type: ' + consultationType;
    const details = 'Prescribed medicines to patient ' + patientName + ' with -> ' + info;

    await logAction(req, action, details);

    res.json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createPatient = async (req, res) => {
  const { firstName, otherNames, lastName, dateOfBirth, gender, contactNumber, email, existingConditions } = req.body;
  const patient = new Patient({
    firstName,
    otherNames,
    lastName,
    dateOfBirth,
    gender,
    contactNumber,
    email,
    existingConditions
  });

  try {
    const newPatient = await patient.save();

    // Audit
    const action = 'Created Patient';
    const patientName = newPatient.otherNames
      ? `${newPatient.firstName} ${newPatient.otherNames} ${newPatient.lastName}`
      : `${newPatient.firstName} ${newPatient.lastName}`;
    const details = 'Created Patient ' + patientName;

    await logAction(req, action, details);

    res.status(201).json(newPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller method to update patient by ID
exports.updatePatientById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const originalPatient = await Patient.findById(id); // Fetch original data

      if (!originalPatient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      const updatedPatient = await Patient.findByIdAndUpdate(id, req.body, { new: true });

      // Determine the changed fields
      const changes = {};
      for (const key in req.body) {
        if (req.body[key] !== originalPatient[key]) {
          changes[key] = {
            before: originalPatient[key],
            after: req.body[key]
          };
        }
      }

      // Audit
      const patientName = originalPatient.otherNames
      ? `${originalPatient.firstName} ${originalPatient.otherNames} ${originalPatient.lastName}`
      : `${originalPatient.firstName} ${originalPatient.lastName}`;

      const action = 'Updated Patient Details';

      const details = 'Updated Patient Details for patient ' + patientName + ' and changes: ' + JSON.stringify(changes);

      await logAction(req, action, details);

      res.json(updatedPatient);
    } catch (err) {
      next(err);
    }
  };

// Controller method to delete patient by ID
exports.deletePatientById = async (req, res, next) => {
    try {
      const { id } = req.params;
      // Find the patient by ID
      const patient = await Patient.findById(id);

      // Audit
      const action = 'Deleted Patient';
      const patientName = patient.otherNames
        ? `${patient.firstName} ${patient.otherNames} ${patient.lastName}`
        : `${patient.firstName} ${patient.lastName}`;
      const details = 'Deleted Patient ' + patientName;

      await logAction(req, action, details);

      await Patient.findByIdAndDelete(id);
      res.sendStatus(204); // No Content
    } catch (err) {
      next(err);
    }
  };

// Controller method to get patients by last name
exports.getPatientsByLastName = async (req, res, next) => {
    try {
      const { lastName } = req.params; // Extract last name from request parameters
      const patients = await Patient.find({ lastName }); // Query database for patients with matching last name
      res.json(patients); // Return list of patients with matching last names
    } catch (err) {
      next(err); // Pass any errors to the error handling middleware
    }
  };

  // Controller method to get patients by full name
exports.getPatientsByFullName = async (req, res, next) => {
    try {
      const { lastName, firstName } = req.params; // Extract last name and first name from request parameters
      const patients = await Patient.find({ lastName, firstName }); // Query database for patients with matching last name and first name
      res.json(patients); // Return list of patients with matching last names and first names
    } catch (err) {
      next(err); // Pass any errors to the error handling middleware
    }
  };