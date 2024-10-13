const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const allbooks = await axios.get("http://localhost:5100/books");
    res.send(allbooks.data);
  } catch (error) {
    console.log(error);
    res.statusCode(500).send("Something went wrong");
  }
});

// Get the book list available in the shop
public_users.get("/books", function (req, res) {
  res.send(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    const book = await axios.get(
      "http://localhost:5100/book-details/" + req.params.isbn
    );
    res.send(book.data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});

public_users.get("/book-details/:isbn", function (req, res) {
  if (books?.[req.params.isbn]) {
    return res.send(books[req.params.isbn]);
  } else {
    return res.status(400).json({ message: "No such book for this isbn" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  try {
    const book = await axios.get(
      "http://localhost:5100/getby-author/" + req.params.author
    );
    res.send(book.data);
  } catch (error) {
    console.log(error);
    res.statusCode(500).send("Something went wrong");
  }
});

// Get book details based on author
public_users.get("/getby-author/:author", function (req, res) {
  let foundBook = [];
  for (const key in books) {
    if (books[key].author === req.params.author) {
      foundBook.push(books[key]);
    }
  }
  return res.send(foundBook);
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  try {
    const book = await axios.get(
      "http://localhost:5100/getby-title/" + req.params.title
    );
    res.send(book.data);
  } catch (error) {
    console.log(error);
    res.statusCode(500).send("Something went wrong");
  }
});

// Get all books based on title
public_users.get("/getby-title/:title", function (req, res) {
  let foundBook = [];
  for (const key in books) {
    if (books[key].title === req.params.title) {
      foundBook.push(books[key]);
    }
  }
  return res.send(foundBook);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let foundBook = [];
  for (const key in books) {
    if (books[key].review.isbn === req.params.isbn) {
      foundBook.push(books[key]);
    }
  }

  console.log(books);
  return res.send(foundBook);
});

module.exports.general = public_users;
