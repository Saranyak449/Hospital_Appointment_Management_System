
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/hospital_management_db')
  .then(() => console.log('Successfully connected to MongoDB Localhost! ✅'))
  .catch((err) => console.error('MongoDB connection error ❌:', err));

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  phone: { type: String, required: true },
  doctorName: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, default: 'Confirmed' }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ _id: -1 }); // Newest first
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const { patientName, phone, doctorName, date, time } = req.body;
    const newAppointment = new Appointment({ patientName, phone, doctorName, date, time });
    await newAppointment.save();
    res.status(201).json({ message: 'Appointment booked successfully!', appointment: newAppointment });
  } catch (error) {
    res.status(500).json({ message: 'Error creating appointment', error });
  }
});

app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});