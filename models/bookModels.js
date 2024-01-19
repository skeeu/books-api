const reader = require("xlsx");
let books = []
let authors = []
let genres = []

try{
    const file = reader.readFile(`./data/books.xlsx`);
    const sheetNames = file.SheetNames

    for (let i = 0; i < sheetNames.length; i++) {
        const arr = reader.utils.sheet_to_json(file.Sheets[sheetNames[i]])
        arr.forEach((res) => {
            books.push(res)
            authors.push(`${res.Author} (${res.Name})`)
            genres.push(`${res.Name} (${res.Genres})`)
        })
    }
}catch (err){
    console.log(err);
}

module.exports = {
    books,
    authors,
    genres,
};