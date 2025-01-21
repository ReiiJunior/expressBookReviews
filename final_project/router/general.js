const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Nome de usuário e senha são obrigatórios." });
    }

    if (users[username]) {
        return res.status(400).json({ success: false, message: "Nome de usuário já existe. Escolha outro." });
    }

    users[username] = { password }; // Armazena o usuário
    res.json({ success: true, message: "Usuário registrado com sucesso!" });
});

// Get the book list available in the shop
public_users.get('/books',function (req, res) {
  //Write your code here
  const express = require('express');
  const public_users = express.Router(); 
  const books = require('./booksdb'); 



  res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here



  const express = require('express');
  const public_users = express.Router();
  const books = require('./booksdb'); 

  // Rota para obter detalhes do livro pelo ISBN
  const isbn = req.params.isbn;
      const book = books[isbn];
      
      if (book) {
          res.json({ success: true, book: { isbn, ...book } });
      } else {
          res.status(404).json({ success: false, message: "Livro não encontrado" });
      }

  module.exports = public_users;

 });
  
// Get book details based on author

public_users.get('/author/:author', function (req, res) {
  const authorQuery = req.params.author.toLowerCase();
  const matchingBooks = Object.values(books).filter(book => book.author.toLowerCase().includes(authorQuery) // Permite buscas parciais
  );
  
  if (matchingBooks.length > 0) {
      res.json({ success: true, books: matchingBooks });
  } else {
      res.status(404).json({ success: false, message: `Nenhum livro encontrado para o autor ${req.params.author}` });
  }
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  
  const titleQuery = req.params.title.toLowerCase();
  const matchingBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(titleQuery) // Permite buscas parciais
  );
  
  if (matchingBooks.length > 0) {
      res.json({ success: true, books: matchingBooks });
  } else {
      res.status(404).json({ success: false, message: `Nenhum livro encontrado com o título ${req.params.title}` });
  }
});

//  Get book review

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
      res.json({ success: true, reviews: book.reviews });
  } else {
      res.status(404).json({ success: false, message: `Nenhum livro encontrado com o ISBN ${isbn}` });
  }
});

module.exports.general = public_users;
