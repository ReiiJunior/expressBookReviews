const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Tarefa 10: Obter a lista de livros usando Promises
public_users.get('/books', (req, res) => {
    return new Promise((resolve) => {
        resolve(books);
    }).then(data => res.json(data))
    .catch(err => res.status(500).json({ message: "Erro ao obter a lista de livros." }));
});

// Tarefa 11: Obter detalhes do livro pelo ISBN usando Promises
public_users.get('/isbn/:isbn', (req, res) => {
    return new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        const book = books[isbn];
        if (book) resolve(book);
        else reject("Livro não encontrado.");
    }).then(data => res.json(data))
    .catch(err => res.status(404).json({ message: err }));
});

// Tarefa 12: Obter detalhes do livro pelo Autor usando Promises
public_users.get('/author/:author', (req, res) => {
    return new Promise((resolve, reject) => {
        const author = req.params.author.toLowerCase();
        const matchingBooks = Object.values(books).filter(book => book.author.toLowerCase().includes(author));
        if (matchingBooks.length > 0) resolve(matchingBooks);
        else reject("Nenhum livro encontrado para esse autor.");
    }).then(data => res.json(data))
    .catch(err => res.status(404).json({ message: err }));
});

// Tarefa 13: Obter detalhes do livro pelo Título usando Promises
public_users.get('/title/:title', (req, res) => {
    return new Promise((resolve, reject) => {
        const title = req.params.title.toLowerCase();
        const matchingBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title));
        if (matchingBooks.length > 0) resolve(matchingBooks);
        else reject("Nenhum livro encontrado com esse título.");
    }).then(data => res.json(data))
    .catch(err => res.status(404).json({ message: err }));
});

module.exports.general = public_users;
