const reader = require('xlsx');
let { books, genres, authors} = require('../models/bookModels');
const utils = require('../utils.js')


const getBooks = (req, res) => {
    if (books.length === 0){
        return res.status(404).json({
            status: 'Not Found',
            message: 'There is no books',
        })
    }

    const { name, price, offset } = req.query
    let filteredBooks = JSON.parse(JSON.stringify(books))

    if (name) {
        filteredBooks = filteredBooks.filter((el) => {
            if (typeof el.Name === 'string') {
                return el.Name.toLowerCase().includes(name.toLowerCase());
            }
            return false;
        });

        if (filteredBooks.length === 0) {
            return res.status(404).json({
                status: 'Not found',
                message: `No books with name: ${name}`,
            });
        }
    }

    if (price) {
        filteredBooks = filteredBooks.filter(el => parseFloat(el.Price) === parseFloat(price))

        if (filteredBooks.length === 0) {
            return res.status(404).json({
                status: 'Not found',
                message: `No books with price: ${price}`,
            });
        }
    }

    if (offset) {
        const numericOffset = parseInt(offset);
        filteredBooks = filteredBooks.slice(numericOffset);
    }

    res.status(200).json({
        status: 'success',
        results: filteredBooks.length,
        data: {
            filteredBooks,
        },
    });
}




const createBook = (req,res) => {
    const id = Number(books[books.length - 1].id) + 1;
    const { Name, Author, PublishYear, PageCount, Price } = req.body;

    const newBook = { id, Name, Author, PublishYear, PageCount, Price }
    const validationError = utils.validateFields(newBook, {
        Name: { min: 2, max: 30 },
        Author: { min: 2, max: 30 },
        PublishYear: { integer: true, minValue: 1900, maxValue: 2024 },
        PageCount: { integer: true, minValue: 3, maxValue: 1300 },
        Price: { minValue: 0, maxValue: 150000 }
    });
    console.log(validationError)

    if (validationError) {
        return res.status(400).json({
            status: 'error',
            message: 'Data Validation error'
        });
    }

    books.push(newBook);

    const file = reader.readFile(`./data/books.xlsx`);
    reader.utils.sheet_add_json(file.Sheets["Worksheet"], books)
    reader.writeFile(file, `./data/books.xlsx`)
    res.status(201).json({
        status: 'success',
        data: {
            book: newBook,
        },
    });
}

const updateBook = (req, res) => {
    const { bookId } = req.params
    const { Name, Author, PublishYear, PageCount, Price } = req.body;

    const newBook = { id: parseInt(bookId), Name, Author, PublishYear, PageCount, Price }
    const validationError = utils.validateFields(newBook, {
        Name: { min: 2, max: 30 },
        Author: { min: 2, max: 30 },
        PublishYear: { integer: true, minValue: 1900, maxValue: 2024 },
        PageCount: { integer: true, minValue: 3, maxValue: 1300 },
        Price: { minValue: 0, maxValue: 150000 }
    });
    console.log(validationError)

    if (validationError) {
        return res.status(400).json({
            status: 'error',
            message: 'Data Validation error'
        });
    }

    books = books.map(book => String(book.id) === bookId ? newBook : book)

    const file = reader.readFile(`./data/books.xlsx`);
    reader.utils.sheet_add_json(file.Sheets["Worksheet"], books)
    reader.writeFile(file, `./data/books.xlsx`)
    res.status(200).json({
        status: 'success',
        data: {
            book: newBook,
        },
    });
}
const deleteBook = (req, res) => {
    const { bookId } = req.params
    books = books.filter(book => String(book.id) !== bookId)

    const file = reader.readFile(`./data/books.xlsx`);
    reader.utils.sheet_add_json(file.Sheets["Worksheet"], books)
    reader.writeFile(file, `./data/books.xlsx`)
    res.status(200).json({
        status: 'deleted successfully',
        data: {
            books,
        },
    });
}

module.exports = {
    getBooks,
    createBook,
    updateBook,
    deleteBook,
};
