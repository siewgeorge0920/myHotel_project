const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the backend boss!' });
});

// MongoDB connection
const uri = process.env.MONGO_URI;
if (uri) {
  mongoose.connect(uri)
    .then(() => console.log('MongoDB connection established successfully'))
    .catch(err => console.log('MongoDB connection error:', err));
} else {
  console.log('No MONGO_URI found, skipping database connection.');
}

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

module.exports = app;
