const express = require('express');
const path = require('path');
const fs = require('fs');
const multiparty = require('multiparty');
const handlebars = require('express-handlebars');

const app = express();
const port = process.env.PORT || 3000;

app.engine(
  'hbs',
  handlebars.engine({
    extname: 'hbs',
    defaultLayout: 'main',
  })
);

app.disable('x-powered-by');

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { pageTitle: 'Index Page' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
