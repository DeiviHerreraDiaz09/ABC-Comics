import express from 'express';
import axios from 'axios';
import fs from 'fs/promises';
import cors from 'cors';
import { fileURLToPath } from 'url';  // Importa fileURLToPath
import path from 'path';  // Importa path
import { cleanHtml } from "./services/comicService.js"

const __filename = fileURLToPath(import.meta.url);  // Obtiene el nombre de archivo actual
const __dirname = path.dirname(__filename);  // Obtiene el directorio base del archivo actual

const app = express();
const port = 5000;
const apiKey = '6a648be76d37a994daf4037a2c01b66a1334f793';
const apiUrl = 'https://comicvine.gamespot.com/api';

app.use(cors());
app.use(express.json());

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
      cover_date: comic.cover_date,
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
      const comicDetails = {
        id: comic.id,
        name: comic.name || comic.volume.name || 'Unknown Title',
        image: comic.image.original_url,
        description: cleanHtml(comic.description) || 'Descripción no disponible.',
        cover_date: comic.cover_date,
        issue_number: comic.issue_number,
        volume: comic.volume.name,
        location_credits: comic.location_credits,
        person_credits: comic.person_credits
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

app.get('/api/favComics', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'data', 'favComics.json');
    const data = await fs.readFile(filePath);
    const favComics = JSON.parse(data);
    res.json(favComics);
  } catch (error) {
    console.error("Error fetching favorite comics:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/favComics/mark/:id', async (req, res) => {
  try {
    const comicId = req.params.id;
    const filePath = path.join(__dirname, 'data', 'favComics.json');

    let favComics = [];
    try {
      const data = await fs.readFile(filePath);
      favComics = JSON.parse(data);
    } catch (error) {
      console.log('Error leyendo el JSON');
    }

    const existingComicIndex = favComics.findIndex(comic => comic.id === comicId);

    if (existingComicIndex !== -1) {
      favComics = favComics.filter(comic => comic.id !== comicId);
    } else {
      favComics.push({ id: comicId });
    }

    await fs.writeFile(filePath, JSON.stringify(favComics, null, 2));

    res.json(favComics);
  } catch (error) {
    console.error("Error para marcar como favorito:", error);
    res.status(500).json({ error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
