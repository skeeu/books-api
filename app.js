const express = require('express');
const morgan = require('morgan')
const bookController = require('./controllers/bookController')
const bookModel = require('./models/bookModels')
const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
    console.log('Hello from middleware');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});


app.route('/api/books').get(bookController.getAllBooks).post(bookController.setNewBook);
app.route('/api/books/byName/:name').get(bookController.getBookByName);
app.route('/api/books/byPrice/:price').get(bookController.getBookByPrice);
app.route('/api/books/:id').put(bookController.updateBook).delete(bookController.deleteBook);
app.route("/api/authors").get(bookController.getAuthors);
app.route('/api/genres').get(bookController.getGenres);

const port = 3300;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});