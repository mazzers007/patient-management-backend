const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authenticateUser = require('../middleware/authMiddleware');
const authorizeUser = require('../middleware/authorizeMiddleware');

// Routes that need authentication
router.post('/createAppointment', authenticateUser, authorizeUser(['doctor', 'admin', 'assistant']), appointmentController.createAppointment);
router.put('/updateAppointment/:id', authenticateUser, authorizeUser(['doctor', 'admin', 'assistant']), appointmentController.updateAppointment);
router.put('/cancelAppointment/:id', authenticateUser, authorizeUser(['doctor', 'admin', 'assistant']), appointmentController.cancelAppointment);
router.get('/getAllAppointments', authenticateUser, authorizeUser(['doctor', 'admin', 'assistant']), appointmentController.getAllAppointments);

// Routes that do not need authentication
router.get('/getAppointmentsByPatient/:patientId', appointmentController.getAppointmentsByPatient);

module.exports = router;
