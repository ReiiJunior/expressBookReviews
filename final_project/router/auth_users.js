const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = {};

// Função para verificar se um nome de usuário já está registrado
const isValid = (username) => {
    return Object.prototype.hasOwnProperty.call(users, username);
};

// Função para autenticar um usuário
const authenticatedUser = (username, password) => {
    return isValid(username) && users[username].password === password;
};

// Endpoint para registro de usuário
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Nome de usuário e senha são obrigatórios." });
    }

    if (isValid(username)) {
        return res.status(400).json({ message: "Nome de usuário já existe. Escolha outro." });
    }

    users[username] = { password }; // Registra o usuário
    res.json({ message: "Usuário registrado com sucesso!" });
});

// Endpoint para login de usuário com JWT
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Nome de usuário e senha são obrigatórios." });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const token = jwt.sign({ username }, "secretkey", { expiresIn: "1h" });
    res.json({ message: "Login bem-sucedido!", token });
});

// Middleware para autenticação


// Endpoint para adicionar ou modificar uma resenha de livro
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;
    const username = req.user.username;

    console.log("🔹 Tentativa de adicionar resenha por:", username);

    if (!books[isbn]) {
        return res.status(404).json({ message: "Livro não encontrado." });
    }

    if (!review) {
        return res.status(400).json({ message: "A resenha não pode estar vazia." });
    }

    books[isbn].reviews = books[isbn].reviews || {};
    books[isbn].reviews[username] = review;

    console.log("✅ Resenha adicionada/modificada por", username);
    return res.json({ message: "Resenha adicionada/modificada com sucesso!", reviews: books[isbn].reviews });
});


// Endpoint para excluir uma resenha de livro
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;

    if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Nenhuma resenha encontrada para excluir." });
    }

    delete books[isbn].reviews[username];
    res.json({ message: "Resenha excluída com sucesso!", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;