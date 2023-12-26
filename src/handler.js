// Importing the 'nanoid' function from the 'nanoid' module
const { nanoid } = require("nanoid");

// Importing the 'books' array from a local module file
const books = require("./books");

// Handler function for adding books
const addBooksHandler = (request, h) => {
  // Destructuring properties from the request payload
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Server responds with an error if 'name' is not provided in the request body
  if (name === undefined) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;

    // Server responds with an error if 'readPage' is greater than 'pageCount'
  } else if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  } else {
    // Generate a unique ID using nanoid
    const id = nanoid(16);
    // Get the current timestamp for 'insertedAt' and 'updatedAt'
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    // Determine if the book is finished based on 'pageCount' and 'readPage'
    const finished = pageCount === readPage;

    // Create a new book object
    const newBooks = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };

    // Add the new book to the 'books' array
    books.push(newBooks);

    // Check if the book was successfully added
    const isSuccess = books.filter((note) => note.id === id).length > 0;

    // Server responds with success if the book was successfully added
    if (isSuccess) {
      const response = h.response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
  }

  // Server responds with an error if the book failed to be added
  const response = h.response({
    status: "error",
    message: "Catatan gagal ditambahkan",
  });
  response.code(500);
  return response;
};

// Handler function for retrieving all books
const getAllBooksHandler = (request, h) => {
  // Destructuring properties from the request query
  const { name } = request.query;

  // Display books containing the specified name in the query
  if (name !== undefined) {
    const BookshelfName = books.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
    const response = h.response({
      status: "success",
      data: {
        books: BookshelfName.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

  // Display all books if no name is specified in the query
  const response = h.response({
    status: "success",
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

// Handler function for retrieving a book by ID
const getBooksByIdHandler = (request, h) => {
  // Destructuring properties from the request parameters
  const { id } = request.params;
  // Find the book in the 'books' array based on the provided ID
  const book = books.filter((b) => b.id === id)[0];

  // Server responds with book data if the book and ID are found
  if (book !== undefined) {
    return {
      status: "success",
      data: {
        book,
      },
    };
  }

  // Server responds with an error if the book and ID are not found
  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

// Handler function for editing a book by ID
const editBooksByIdHandler = (request, h) => {
  // Destructuring properties from the request parameters and payload
  const { id } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Get the current timestamp for 'updatedAt'
  const updatedAt = new Date().toISOString();
  // Find the index of the book in the 'books' array based on the provided ID
  const index = books.findIndex((book) => book.id === id);

  // Server responds with an error if 'name' is not provided
  if (name === undefined) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;

    // Server responds with an error if 'readPage' is greater than 'pageCount'
  } else if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;

    // Server responds with success if the book is successfully updated
  } else if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;

    // Server responds with an error if the provided ID is not found
  } else {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }
};

// Handler function for deleting a book by ID
const deleteBooksByIdHandler = (request, h) => {
  // Destructuring properties from the request parameters
  const { id } = request.params;
  // Find the index of the book in the 'books' array based on the provided ID
  const index = books.findIndex((book) => book.id === id);

  // Server responds with success if the book is successfully deleted
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  // Server responds with an error if the provided ID is not found
  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

// Exporting all handler functions as an object
module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBooksByIdHandler,
  editBooksByIdHandler,
  deleteBooksByIdHandler,
};
