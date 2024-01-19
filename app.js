const express = require('express');
const morgan = require('morgan')
const bodyParser = require('body-parser')

const app = express();

const bookRouter = require('./routes/books')
const authorsRouter = require('./routes/authors')
const genresRouter = require('./routes/genres')

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());

app.use((req, res, next) => {
    console.log('Hello from middleware');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});


app.use('/api/v1/books', bookRouter)
app.use('/api/v1/authors', authorsRouter)
app.use('/api/v1/genres', genresRouter)

const port = 3300;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});