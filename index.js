const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// Initialize Express App
const app = express();
dotenv.config(); 
const PORT = process.env.PORT;
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("./public"))
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// MongoDB Connection
const dbURL = process.env.CONNECTION_URL;
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Render the form on the root route
app.get('/', (req, res) => {
    res.render('form.ejs')
})
app.get('/thank_you', (req, res) => {
  res.render('thank_you.ejs')
})
// Define Mongoose Schema
const StudentEnrollmentSchema = new mongoose.Schema({
  course: {
    type: String,
    required: [true, 'Course is required'],
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
  },
  academicSession: {
    type: String,
    required: [true, 'Academic session is required'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name should have at least 3 characters'],
  },
  fatherName: {
    type: String,
    required: [true, 'Father\'s name is required'],
    minlength: [3, 'Father\'s name should have at least 3 characters'],
  },
  motherName: {
    type: String,
    required: [true, 'Mother\'s name is required'],
    minlength: [3, 'Mother\'s name should have at least 3 characters'],
  },
  dob: {
    type: Date,
    required: [true, 'Date of Birth is required'],
    // validate: {
    //   validator: function(value) {
    //     return /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(value); // Date format YYYY-MM-DD
    //   },
    //   message: 'Invalid date format. Please use YYYY-MM-DD.',
    // },
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, 
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address'],
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    match: [/^\d{10}$/, 'Please provide a valid 10-digit mobile number'],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
  secondary: {
    rollNo: {
      type: String,
      required: [true, 'Secondary roll number is required'],
    },
    passingYear: {
      type: String,
      required: [true, 'Secondary roll number is required'],
    },
    schoolName: {
      type: String,
      required: [true, 'Secondary school name is required'],
    },
    boardName: {
      type: String,
      required: [true, 'Secondary board name is required'],
    },
    percentage: {
      type: Number,
      required: [true, 'Secondary percentage is required'],
      min: [0, 'Percentage cannot be less than 0'],
      max: [100, 'Percentage cannot be greater than 100'],
    },
  }, 
  higherSecondary: {
    rollNo: {
      type: String,
      required: [true, 'Higher secondary roll number is required'],
    },
    passingYear: {
      type: String,
      required: [true, 'Higher Secondary roll number is required'],
    },
    schoolName: {
      type: String,
      required: [true, 'Higher secondary school name is required'],
    },
    boardName: {
      type: String,
      required: [true, 'Higher secondary board name is required'],
    },
    percentage: {
      type: Number,
      required: [true, 'Higher secondary percentage is required'],
      min: [0, 'Percentage cannot be less than 0'],
      max: [100, 'Percentage cannot be greater than 100'],
    },
  }
});

// Create the model
const StudentEnrollment = mongoose.model('StudentEnrollment', StudentEnrollmentSchema);

// POST API for Student Enrollment
app.post('/api/enroll', async (req, res) => {
  const formData = req.body;

  try {
    // Create a new instance of the StudentEnrollment model
    const newForm = new StudentEnrollment(formData);

    // Validate the form data
    await newForm.validate();  // This triggers Mongoose validation

    // Save the form data to the database
    await newForm.save();
    res.status(200).json({ message: 'Form submitted successfully!' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });  // Send validation errors as response
    }
    console.error('Error saving form data:', error);
    res.status(500).json({ message: 'Error saving form data.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port:${PORT}`);
});
