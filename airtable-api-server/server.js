const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
const app = express();
const port = 4000;

// Retrieve environment variables
const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;
// Set up middleware to allow CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Define a route to fetch data from Airtable
app.get('/airtable-data', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.airtable.com/v0/${baseId}/Table 1`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from Airtable:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
