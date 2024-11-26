// to run this projecct run "npm start" in terminal

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express App
const app = express();
const PORT = 5000;
app.set('view engine', 'ejs')
 
// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("./public"))
    app.use(express.json({ limit: "30mb", extended: true }))
    app.use(express.urlencoded({ limit: "30mb", extended: true }))
// app.use(cors())
// MongoDB Connection
const dbURL = 'mongodb+srv://ankit123:Ankit1009@student-details.bmez7.mongodb.net/?retryWrites=true&w=majority&appName=student-details';
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

    
app.get('/', (req, res) => {
    res.render('form.ejs')
    })
// Define Mongoose Schema
const StudentEnrollmentSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    course: { type: String, enum: ['btech', 'bsc', 'bcom', 'ba'], required: true },
    enrollmentYear: { type: Number, required: true, min: 2000, max: 2100 },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    email: { type: String, required: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    phone: { type: String, required: true, match: /^[0-9]{10}$/ },
    address: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
});

const StudentEnrollment = mongoose.model('StudentEnrollment', StudentEnrollmentSchema);

// POST API for Student Enrollment
app.post('/api/enroll', async (req, res) => {
    try {
        const newStudent = new StudentEnrollment(req.body);
        const savedStudent = await newStudent.save();
        res.status(201).json({ message: 'Student enrolled successfully', student: savedStudent });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            res.status(400).json({ message: 'Duplicate email detected' });
        } else {
            res.status(500).json({ message: 'Error enrolling student', error });
        }
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
