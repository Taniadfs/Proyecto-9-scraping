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

    browser = await puppeteer.launch()
    console.log('Navegador abierto')

    const page = await browser.newPage()
    await page.goto('https://www.fnac.com/')
    console.log('Página cargada')

    try {
      await page.waitForSelector('#onetrust-accept-btn-handler', { timeout: 5000 })
      await page.click('#onetrust-accept-btn-handler')
      console.log('Modal de cookies cerrado')
    } catch (e) {
      console.log('No se encontró el modal de cookies')
    }
    

    const allBooks = []
    let nextButton = true

    while (nextButton) {

      try {
        await page.waitForSelector(' #batchsdk-ui-alert__buttons_negative', { timeout: 5000 })
        await page.click('#batchsdk-ui-alert__buttons_negative')
        console.log('Modal de abonarse cerrado')
      } catch (e) {
        console.log('No se encontró el modal de abonarse')}
      const books = await page.evaluate(() => {
        const bookElements = document.querySelectorAll('article.product_pod')
        return Array.from(bookElements).map((book) => {
          const title = book.querySelector('h3 a').getAttribute('title')
          const price = book.querySelector('.price_color').textContent
          const image =
            'https://books.toscrape.com/' +
            book.querySelector('img').getAttribute('src')
          return { title, price, image }
        })
      })

      nextButton = await page.$('li.next a')
      if (nextButton) {
      await Promise.all([
       nextButton.click(),
     page.waitForNavigation()
      ])
      }

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
