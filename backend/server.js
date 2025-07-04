const express = require('express');
const { connectToDatabase } = require('./db/connect');
const app = express();

// Initialize connection before starting server
let dbClient;
let db;

async function init() {
  try {
    dbClient = await connectToDatabase();
    db = dbClient.db("Unit87"); // Replace with your DB name

    app.get('/users', async (req, res) => {
  try {
    const users = await db.collection('users').find().toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
    
    app.get('/data', async (req, res) => {
      try {
        const collection = db.collection('your_collection');
        const data = await collection.findOne({});
        res.json(data || { message: "No data found" });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize application:", error);
    process.exit(1);
  }
}

init();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  if (dbClient) {
    await dbClient.close();
    console.log("MongoDB connection closed");
  }
  process.exit(0);
});

const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('your-mongodb-connection-string');

// Define a simple model
const Data = mongoose.model('Data', { message: String });

// Update endpoint
app.get('/data', async (req, res) => {
  let data = await Data.findOne();
  if (!data) {
    data = await Data.create({ message: 'Hello from database!' });
  }
  res.json(data);
});