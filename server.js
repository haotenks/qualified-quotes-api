const express = require("express");

const { getQuotes } = require('./src/quotes');
const { getAuthors } = require('./src/authors');

const createService = () => {
  const app = express();
  
  /* go ahead and code! */
  app.get('/quotes', async (req, res) => {
    const filter = {
      author: req.query.author,
      tag: req.query.tag,
    }
    const quotes = await getQuotes(filter);
    res.send({data: quotes });
  });
  
  app.get('/authors', async (req, res) => {        
    const filter = {
      name: req.query.name,
    }
    const authors = await getAuthors(filter);
    res.send({ data: authors });
  });
 
  return app;
};


module.exports = { createService }; 