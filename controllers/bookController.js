const { books, genres, authors} = require('../models/bookModels');
const reader = require('xlsx');
const bookModel = require("../models/bookModels");
// GET
const getAllBooks = (req, res) => {
    if (books.length === 0){
        return res.status(404).json({
            status: 'Not Found',
            message: 'There is no books',
        })
    }

    res.status(200).json({
        status: 'success',
        results: books.length,
        data: {
            books,
        },
    });
}

const getBookByName = (req, res) => {
    console.log(req.params);

    const book = books.find((el) => el.Name === req.params.name);

    if (!book) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            book,
        },
    });
}

const getBookByPrice = (req, res) => {
    const data = []
    console.log(req.params);

    books.forEach((book) => {
        if(book.Price === Number(req.params.price)){
            data.push(book)
        }
    })

    if (data.length == 0) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            data,
        },
    });
}

const validateFields = (data, fieldRules) => {
    for (const [field, rules] of Object.entries(fieldRules)) {
        const value = data[field];

        if (value === undefined) {
            return `${field} is required.`;
        }

        if (rules.min && value.length < rules.min) {
            return `${field} should be at least ${rules.min} characters long.`;
        }

        if (rules.max && value.length > rules.max) {
            return `${field} should be at most ${rules.max} characters long.`;
        }

        if (rules.integer && !Number.isInteger(value)) {
            return `${field} should be an integer.`;
        }

        if (rules.minValue && value < rules.minValue) {
            return `${field} should be greater than or equal to ${rules.minValue}.`;
        }

        if (rules.maxValue && value > rules.maxValue) {
            return `${field} should be less than or equal to ${rules.maxValue}.`;
        }
    }

    return null; // No validation errors
};

// POST
const setNewBook = (req,res) => {
    const NewID = Number(books[books.length - 1].id) + 1;
    const newBook = Object.assign({ id: NewID }, req.body);
    const validationError = validateFields(newBook, {
        Name: { min: 2, max: 30 },
        Author: { min: 2, max: 30 },
        PublishYear: { integer: true, minValue: 1900, maxValue: 2024 },
        PageCount: { integer: true, minValue: 3, maxValue: 1300 },
        Price: { minValue: 0, maxValue: 150000 }
    });

    if (validationError) {
        return res.status(404).json({
            status: 'fail',
            message: 'Data Validation error'
        });
    }

    books.push(newBook);

    const file = reader.readFile(`./data/books.xlsx`);
    const sheets = file.Sheets
    reader.utils.sheet_add_json(file.Sheets["Worksheet"], books)
    reader.writeFile(file, `./data/books.xlsx`)
    res.status(201).json({
        status: 'success',
        data: {
            book: newBook,
        },
    });
}

// PUT
const updateBook = (req,res) => {
    const id = req.params.id;
    const newBook = Object.assign({ id: id }, req.body);

    const validationError = validateFields(newBook, {
        Name: { min: 2, max: 30 },
        Author: { min: 2, max: 30 },
        PublishYear: { integer: true, minValue: 1900, maxValue: 2024 },
        PageCount: { integer: true, minValue: 3, maxValue: 1300 },
        Price: { minValue: 0, maxValue: 150000 }
    });

    if(validationError) {
        return res.status(404).json({
            status: 'fail',
            message: 'Data Validation error'
        });
    }

    books[id-1] = newBook;

    const file = reader.readFile(`./data/books.xlsx`);
    const sheets = file.Sheets
    reader.utils.sheet_add_json(file.Sheets["Worksheet"], books)
    reader.writeFile(file, `./data/books.xlsx`)
    res.status(204).json({
        status: 'success',
        data: {
            book: newBook,
        },
    });
}
// DELETE
const deleteBook = (req, res) => {
    const id = req.params.id
    books.splice(id-1, 1)
    for (let i = id-1; i < books.length; i++) {
        if(i < books.length) {
            books[i].id -= 1;
        }
    }
    const ws = reader.utils.json_to_sheet(books)
    const wb = reader.utils.book_new();
    reader.utils.book_append_sheet(wb, ws, 'Worksheet');
    reader.writeFile(wb, `./data/books.xlsx`)
    res.status(200).json({
        status: 'deleted successfully',
        data: {
            books,
        },
    });
}
const getAuthors = (req, res) => {
    res.send(authors)
}

const getGenres = (req, res) => {
    res.send(genres)
}


module.exports = {
    getAllBooks,
    getBookByName,
    getBookByPrice,
    setNewBook,
    updateBook,
    deleteBook,
    getAuthors,
    getGenres
};
