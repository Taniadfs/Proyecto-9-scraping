const puppeteer = require('puppeteer')

const fs = require('fs')

const scrape = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://books.toscrape.com/index.html')
  try {
    await page.waitForSelector('.modal-button', { timeout: 3000 })
    await page.click('.modal-button')
  } catch (e) {
    console.log('No se encontró el botón de la modal')
  }

  const allBooks = []
  let nextButton = true

  while (nextButton) {
    const books = await page.evaluate(() => {
      const bookElements = document.querySelectorAll('article.product_pod')
      return Array.from(bookElements).map((book) => {
        const title = book.querySelector('h3 a').getAttribute('title')
        const price = book.querySelector('.price_color').textContent
        const image = book.querySelector('img').getAttribute('src')
        return { title, price, image }
      })
    })

    nextButton = await page.$('li.next a')
    if (nextButton) {
      await nextButton.click()
      await page.waitForNavigation()
    }

    allBooks.push(...books)
  }

  fs.writeFileSync('products.json', JSON.stringify(allBooks, null, 2))
  browser.close()
}

scrape()
