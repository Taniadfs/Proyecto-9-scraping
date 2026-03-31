# Web Scraper - Books to Scrape

## Descripción

Scraper desarrollado con Puppeteer y Node.js que extrae 1000 libros de books.toscrape.com.
Recorre las 50 páginas de la web, extrae el título, precio e imagen de cada libro y guarda
los datos en un archivo `products.json` y en una base de datos MongoDB Atlas.

## Tecnologías

- **Puppeteer** → automatización del navegador y scraping
- **Mongoose** → conexión y guardado de datos en MongoDB Atlas
- **dotenv** → gestión de variables de entorno
- **fs** → generación del archivo products.json

## Cómo ejecutarlo

1. Clona el repositorio
2. Instala las dependencias: `npm install`
3. Crea un archivo `.env` con tu conexión a MongoDB: `MONGODB_URI=tu_connection_string`
4. Ejecuta el scraper: `npm run scraper`

## Manejo de modales

El código implementa un `try/catch` con `waitForSelector` preparado para cerrar modales
automáticamente si aparecen. Tras investigar, no encontré ninguna página de práctica legal
que combine paginación, productos y modales simultáneamente, por lo que se ha mantenido
books.toscrape.com como página objetivo al ser la más completa para practicar scraping.
