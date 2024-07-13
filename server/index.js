const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 5000; 

const apiKey = '6a648be76d37a994daf4037a2c01b66a1334f793'; 
const apiUrl = 'https://comicvine.gamespot.com/api';

app.use(cors()); 

app.get('/api/comics', async (req, res) => {
  try {
    // const response = await axios.get(`${apiUrl}/issues`, {
    //   params: { api_key: apiKey }
    // });
    // res.json(response.data);

    res.json({
      "mensaje": "Como estas?"
    })


  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
