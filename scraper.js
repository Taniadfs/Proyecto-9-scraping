const puppeteer = require('puppeteer')
require('dotenv').config()
const { connectDB } = require('./src/config/db')
const mongoose= require ('mongoose')
const fs = require('fs')
const Book = require('./src/models/Book')

const scrape = async () => {
  let browser
  try {
    await connectDB()
    console.log('Conectado a MongoDB')

    browser = await puppeteer.launch({ headless: false })

    const page = await browser.newPage()
    await page.goto ('https://www.fnac.com/l55983/Nouveautes-Poche')
    console.log('Página cargada')

    try {
      await page.waitForSelector('#onetrust-accept-btn-handler', { timeout: 5000 })
      await page.click('#onetrust-accept-btn-handler')
      console.log('Modal de cookies cerrado')
    } catch (e) {
      console.log('No se encontró el modal de cookies')
    }
    

    const allBooks = []

    for (let i= 1; i <= 25; i++) {

      const url = i === 1
    ? 'https://www.fnac.com/l55983/Nouveautes-Poche'
    : `https://www.fnac.com/l55983/Nouveautes-Poche?PageIndex=${i}`


  await page.goto(url)
  console.log(`Scrapeando página ${i}`)

      try {
        await page.waitForSelector(' #batchsdk-ui-alert__buttons_negative', { timeout: 5000 })
        await page.click('#batchsdk-ui-alert__buttons_negative')
        console.log('Modal de abonarse cerrado')
      } catch (e) {
        console.log('No se encontró el modal de abonarse')}
    
        await page.waitForSelector('article.Article-itemGroup', { timeout: 10000 })
        const books = await page.evaluate(() => {
          const bookElements = document.querySelectorAll('article.Article-itemGroup')
          return Array.from(bookElements).map((book) => {
            const img = book.querySelector('img.Article-itemVisualImg')
            if (!img) return null  // si no hay imagen, ignora este producto
            
            const title = img.getAttribute('alt')
            const price = book.querySelector('div.Article-price')?.textContent.trim()
            const image = img.getAttribute('src')
            return { title, price, image }
          }).filter(Boolean) 
        })

    
        await new Promise(resolve => setTimeout(resolve, 3000))
      allBooks.push(...books)
    }

    fs.writeFileSync('products.json', JSON.stringify(allBooks, null, 2))
    await Book.insertMany(allBooks)
  } catch (e) {
    console.log(e)
  } finally {
    if (browser) {
      await browser.close()
    }
    await mongoose.disconnect()
  }
}


scrape()
