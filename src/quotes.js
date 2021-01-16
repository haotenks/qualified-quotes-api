const cheerio = require("cheerio");
const { fetchHtml } = require('./fetch');

const scrapQuotes = async (url) => {  
  const html = await fetchHtml(`${url}`);
  const selector = cheerio.load(html);
  const searchQuotes = selector('body').find(".quote");
  const quotes = searchQuotes.map((idx, q) => {
    const qSelector = selector(q);
    return extractQuote(qSelector, selector);
  }).get();
  return quotes;
}

const extractQuote = (qSelector, selector) => {
  const author = qSelector.find(".author").text().trim();
  const text = qSelector.find(".text").text().trim().slice(0, 50);  
  const tags = qSelector.find(".tag").map((idx, tag) => {
    return selector(tag).text();
  }).get();

  return {
    author,
    text,
    tags,
  }
}

async function getQuotes(filter) {
  const quoteTagUrl = 'http://quotes.toscrape.com/tag/world/page/1/';
  let quotes = [];
  for (let i = 1; i <= 10; i++) {
    let quotesList;
    if (filter.tag !== undefined) {
      quotesList = await scrapQuotes(`http://quotes.toscrape.com/tag/${filter.tag}/page/${i}/`); 
      quotes.push(...quotesList);
      continue;
    }
    
    quotesList = await scrapQuotes(`http://quotes.toscrape.com/page/${i}`);
    if (filter.author !== undefined) {
      quotes.push(...quotesList.filter(q => q.author === filter.author));
      continue;
    }
    quotes.push(...quotesList);
  };
  return quotes;
};

module.exports = { getQuotes }