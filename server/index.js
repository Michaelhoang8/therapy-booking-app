require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database', err);
  } else {
    console.log('Database connected successfully:', res.rows[0]);
  }
});

// Basic route
app.get('/', (req, res) => {
  res.send('Therapy Booking API');
});

// API Routes would go here
// Example: app.use('/api/users', require('./routes/users'));
app.use('/api/appointments', require('./routes/appointments'));

app.use('/api/auth', require('./routes/auth'));

app.use('/api/users', require('./routes/users'));

app.use('/api/therapists', require('./routes/therapists'));

app.use('/api/availability', require('./routes/availability'));

app.use('/api/bookings', require('./routes/bookings'));

app.use('/api/session-types', require('./routes/sessionTypes'));

app.use('/api/appointmentcancel', require('./routes/appointmentcancel'));

app.use('/api/reschedule', require('./routes/reschedule'));

app.use('/api/appointmentsall', require('./routes/appointmentsall'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});