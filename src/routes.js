// Importing the handler functions from the 'handler' module
const {
  addBooksHandler,
  getAllBooksHandler,
  getBooksByIdHandler,
  editBooksByIdHandler,
  deleteBooksByIdHandler,
} = require("./handler");

// Defining an array of route objects
const routes = [
  // Route for adding a book using the POST method
  {
    method: "POST",
    path: "/books",
    handler: addBooksHandler,
  },
  // Route for retrieving all books using the GET method
  {
    method: "GET",
    path: "/books",
    handler: getAllBooksHandler,
  },
  // Route for retrieving a specific book by ID using the GET method
  {
    method: "GET",
    path: "/books/{id}",
    handler: getBooksByIdHandler,
  },
  // Route for updating a book by ID using the PUT method
  {
    method: "PUT",
    path: "/books/{id}",
    handler: editBooksByIdHandler,
  },
  // Route for deleting a book by ID using the DELETE method
  {
    method: "DELETE",
    path: "/books/{id}",
    handler: deleteBooksByIdHandler,
  },
];

// Exporting the array of route objects
module.exports = routes;
