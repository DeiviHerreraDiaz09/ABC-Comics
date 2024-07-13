import cheerio from 'cheerio';

export function cleanHtml(html) {
    if (!html) return 'Descripción no disponible.';
    const $ = cheerio.load(html);
    return $.text();
}
