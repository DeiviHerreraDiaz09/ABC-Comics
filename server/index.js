import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { cleanHtml } from "./services/comicService.js"


const app = express();
const port = 5000;
const apiKey = '6a648be76d37a994daf4037a2c01b66a1334f793';
const apiUrl = 'https://comicvine.gamespot.com/api';

app.use(cors());

app.get('/api/comics', async (req, res) => {
  try {
    const response = await axios.get(`${apiUrl}/issues`, {
      params: {
        api_key: apiKey,
        format: 'json',
      }
    });
    const comics = response.data.results.map(comic => ({
      id: comic.id,
      name: comic.name || comic.volume.name || 'Unknown Title',
      image: comic.image.original_url,
      description: cleanHtml(comic.description) || 'Descripción no disponible.',
      cover_date: comic.cover_date
    }));
    res.json(comics);
  } catch (error) {
    console.error("Error fetching comics:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/comics/:id", async (req, res) => {
  try {
    const comicId = req.params.id;
    const response = await axios.get(`${apiUrl}/issue/4000-${comicId}/`, {
      params: {
        api_key: apiKey,
        format: 'json'
      }
    });

    if (response.data.results) {
      const comic = response.data.results;

      console.log(comic);

      const comicDetails = {
        id: comic.id,
        name: comic.name || comic.volume.name || 'Unknown Title',
        image: comic.image.original_url,
        description: cleanHtml(comic.description) || 'Descripción no disponible.',
        cover_date: comic.cover_date,
        issue_number: comic.issue_number,
        volume: comic.volume.name,
      };
      res.json(comicDetails);
    } else {
      res.status(404).json({ error: 'Comic not found' });
    }
  } catch (error) {
    console.error("Error fetching comic details:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
