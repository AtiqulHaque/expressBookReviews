const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  return userswithsamename.length > 0;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  // Return true if any valid user is found, otherwise false
  return validusers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign(
      {
        user: username,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    // Store access token and username in session
    req.session.authorization = { accessToken, username };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  if (books?.[req.params.isbn]) {
    let bookWithReview = books[req.params.isbn];
    if (bookWithReview?.["reviews"]) {
      bookWithReview["reviews"][req.user.user] = req.body.review;
    }
    books[req.params.isbn] = bookWithReview;
    return res.send(books[req.params.isbn]);
  } else {
    return res.status(400).json({ message: "No such book for this isbn" });
  }
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here

  if (books?.[req.params.isbn]) {
    let bookWithReview = books[req.params.isbn];
    if (bookWithReview?.["reviews"]) {
      delete bookWithReview["reviews"][req.user.user];
    }
    books[req.params.isbn] = bookWithReview;
    return res.send(books[req.params.isbn]);
  } else {
    return res.status(400).json({ message: "No such book for this isbn" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
