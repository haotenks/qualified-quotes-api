const cheerio = require("cheerio");
const { fetchHtml } = require('./fetch');

const scrapAuthors = async (url) => {  
  const html = await fetchHtml(url);
  const selector = cheerio.load(html);
  const searchAuthor = selector('body').find(".quote");
  const authors = searchAuthor.map((idx, q) => {
    const qSelector = selector(q);
    return extractAuthorUrl(qSelector, selector);
  }).get();
  return authors;
}

const extractAuthorUrl = (qSelector, selector) => {
	const name = qSelector.find(".author").text().trim();
  const parent = qSelector.find(".author").parent();	
  const parentSelector = selector(parent);  
	const url = parentSelector.find("a").attr("href").trim();	
  return {
		name, url
	};
}

const scrapAuthor = async (url) => {  
  const html = await fetchHtml(url);
  const selector = cheerio.load(html);
  const searchAuthor = selector('body').find(".author-details");
  const authors = searchAuthor.map((idx, q) => {
    const qSelector = selector(q);
    return extractAuthor(qSelector);
  }).get();
  return authors;
}

const extractAuthor = (qSelector) => {
  const name = qSelector.find(".author-title").text().trim().slice(0, 50);
	const birthdate = qSelector.find(".author-born-date").text().trim().slice(0, 50);
	const location = qSelector.find(".author-born-location").text().trim().slice(0, 50);
	const biography = qSelector.find(".author-description").text().trim().slice(0, 50);
	
  return {
    name,
    biography,
		birthdate,
		location,
  }
}

async function getAuthors(filter) {  
	let authors = [];	

	for (let i = 1; i <= 10; i++) {
		let list = await scrapAuthors(`http://quotes.toscrape.com/page/${i}`);
		if (filter.name !== undefined) {
			const f = list.find(a => a.name === filter.name);
			if (f !== undefined) {
				authors.push(f);
				break;
			}
			continue;
		}
		authors.push(...list);
	};

	let authorsDetails = [];
	for (let a of authors) {
		const alreadyScrapped = authorsDetails.find(as => as.name === a.name);
		if (alreadyScrapped !== undefined) continue;
		let aList = await scrapAuthor(`http://quotes.toscrape.com${a.url}`);
		authorsDetails.push(...aList);
	}
  return authorsDetails;
};

module.exports = { getAuthors }