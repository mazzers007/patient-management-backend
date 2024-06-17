const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authenticateUser = require('../middleware/authMiddleware');
const authorizeUser = require('../middleware/authorizeMiddleware');

// Routes that need authentication
router.get('/getAllPatients', authenticateUser, authorizeUser(['doctor', 'admin', 'assistant']), patientController.getAllPatients);
router.post('/createPatient', authenticateUser, authorizeUser(['doctor', 'admin', 'assistant']), patientController.createPatient);
router.put('/updateById/:id', authenticateUser, authorizeUser(['doctor', 'admin', 'assistant']), patientController.updatePatientById);
router.delete('/deleteById/:id', authenticateUser, authorizeUser(['doctor', 'admin', 'assistant']), patientController.deletePatientById);
router.put('/updateMedicalHistory/:id', authenticateUser, authorizeUser(['doctor', 'admin']), patientController.updateMedicalHistory);
router.put('/updatePrescribedMedicine/:id', authenticateUser, authorizeUser(['doctor', 'admin']), patientController.updatePrescribedMedicine);

// Routes that do not need authentication
router.get('/getPatientsByLastName/:lastName', patientController.getPatientsByLastName);
router.get('/getPatientsByFullName/:lastName/:firstName', patientController.getPatientsByFullName);
router.get('/findById/:id', patientController.findPatientById);

module.exports = router;
