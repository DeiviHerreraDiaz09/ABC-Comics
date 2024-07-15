import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export async function fetchComics() {
    try {
        const response = await axios.get(`${API_BASE_URL}/comics`);
        return response.data;
    } catch (error) {
        console.error('Error fetching comics:', error);
        throw error;
    }
}

export async function fetchFavoriteComics() {
    try {
        const response = await axios.get(`${API_BASE_URL}/favComics`);
        return response.data.map(comic => comic.id.toString());
    } catch (error) {
        console.error('Error fetching favorite comics:', error);
        throw error;
    }
}

export async function fetchComicDetails(comicId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/comics/${comicId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching comic details:', error);
        throw error;
    }
}

export async function markComicAsFavorite(comicId) {
    try {
        await axios.post(`${API_BASE_URL}/favComics/mark/${comicId}`);
    } catch (error) {
        console.error('Error marking comic as favorite:', error);
        throw error;
    }
}

export function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', options);
}

export function redirectUrl(url) {
    if (url === "website") {
        window.location.href = "https://comicvine.gamespot.com/api";
    } else if (url === "gitHub") {
        window.location.href = "https://github.com/DeiviHerreraDiaz09";
    } else {
        console.log("Error en el redireccionamiento de vínculos");
    }
};