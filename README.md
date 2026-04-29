# Web Scraper - Fnac.com

## Descripción
Scraper desarrollado con Puppeteer y Node.js que extrae libros de la sección 
"Nouveautés Poche" de Fnac.com. Recorre las páginas disponibles, extrae el título, 
precio e imagen de cada libro y guarda los datos en un archivo `products.json` 
y en una base de datos MongoDB Atlas.

## Tecnologías
- **Puppeteer** → automatización del navegador y scraping
- **Mongoose** → conexión y guardado de datos en MongoDB Atlas
- **dotenv** → gestión de variables de entorno
- **fs** → generación del archivo products.json

## Arquitectura
```
src/
  config/
    db.js      → conexión a MongoDB
  models/
    Book.js    → schema y modelo de Mongoose
```

## Manejo de modales
El scraper gestiona dos modales reales de Fnac.com:
- **Modal de cookies** (OneTrust) → se cierra al inicio
- **Modal de suscripción** → se cierra en cada página dentro del bucle

Ambos se manejan con `try/catch` y `waitForSelector` para que el scraper 
continúe aunque no aparezcan.

## Paginación
Se usa un bucle `for` construyendo la URL de cada página dinámicamente:
- Página 1: `https://www.fnac.com/l55983/Nouveautes-Poche`
- Páginas siguientes: `https://www.fnac.com/l55983/Nouveautes-Poche?PageIndex=${i}`

## Nota sobre el anti-scraping
Fnac.com dispone de sistemas anti-scraping que detectan y bloquean Puppeteer 
después de las primeras peticiones. Este es un comportamiento habitual en páginas 
reales de producción. El código está correctamente implementado y funcionó 
en las primeras páginas antes del bloqueo.

## Cómo ejecutarlo
1. Clona el repositorio
2. Instala las dependencias: `npm install`
3. Crea un archivo `.env` con tu conexión a MongoDB: 
   `MONGODB_URI=tu_connection_string`
4. Ejecuta el scraper: `npm run scraper`