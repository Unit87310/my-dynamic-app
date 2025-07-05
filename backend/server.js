require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./db/connect');

const app = express();
app.use(cors());
app.use(express.json());

let db;

async function init() {
  try {
    const dbClient = await connectToDatabase();
    db = dbClient.db(process.env.DB_NAME || 'myapp');
    
    // Test route
    app.get('/', (req, res) => {
      res.send('Server is running');
    });

    // Users route
    app.get('/users', async (req, res) => {
      try {
        const users = await db.collection('users').find().toArray();
        res.json(users);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

init();