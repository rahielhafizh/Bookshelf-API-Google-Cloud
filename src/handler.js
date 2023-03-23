const { nanoid } = require('nanoid')
const books = require('./routes');

const addBooksHandler = (request, h) => {
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

    //Server merespons error jika Client tidak melampirkan name pada request body
    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;

        //Server merespons error jika properti readPage lebih besar dari nilai pageCount
    } else if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message:
                'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;

    } else {
        const id = nanoid(16); //Membuat Id unik
        const insertedAt = new Date().toISOString(); //Menampung tanggal dimasukkannya buku
        const updatedAt = insertedAt; //Menampung tanggal diperbarui buku
        const finished = pageCount === readPage;  //Menjelaskan apakah buku telah selesai dibaca

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

        books.push(newBooks);

        const isSuccess = books.filter((note) => note.id === id).length > 0;

        //Server mengembalikan respons sukses bila buku berhasil dimasukkan
        if (isSuccess) {
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id,
                },
            });
            response.code(201);
            return response;
        }
    }

    //Server merespons error bila buku gagal dimasukkan
    const response = h.response({
        status: 'error',
        message: 'Catatan gagal ditambahkan',
    });
    response.code(500);
    return response;
};

//Menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
    const { name } = request.query;
    //Menampilkan buku yang mengandung nama berdasarkan nilai yang diberikan pada query
    if (name !== undefined) {
        const BookshelfName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
        const response = h
            .response({
                status: 'success',
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
    };
};

    //Menampilkan detail buku yang disimpan
    const getBooksByIdHandler = (request, h) => {
        const {id} = request.params;
        const book = books.filter((b) => b.id === id)[0];
        
        //Server mengembalikan respons berupa data bila buku dan id yang dilampirkan ditemukan
        if (book !== undefined) {
            return {
                status: 'success',
                data: {
                    book,
                },
            };
        }

        //Server merespons error bila buku dan id yang dilampirkan tidak ditemukan
        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        });
        response.code(404);
        return response;
    };

    //Mengubah data buku berdasarkan id
    const editBooksByIdHandler = (request, h) => {
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

        const updatedAt = new Date().toISOString();
        const index = books.findIndex((book) => book.id === id);

        //Server merespons error bila client tidak melampirkan properti name
        if (name === undefined) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            });
            response.code(400);
            return response;

        //Server merespons error bila nilai readPage lebih besar dari nilai pageCount
        } else if (readPage > pageCount) {
            const response = h.response({
                status: 'fail',
                message:
                    'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);
            return response;

        //Server mengembalikan respons success bila buku berhasil diperbarui
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
                status: 'success',
                message: 'Buku berhasil diperbarui',
            });
            response.code(200);
            return response;

        //Server merespons error bila id yang dilampirkan tidak ditemukan oleh server
        } else {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Id tidak ditemukan',
            });
            response.code(404);
            return response;
        }
    };

    //Menghapus buku
    const deleteBooksByIdHandler = (request, h) => {
        const { id } = request.params;
        const index = books.findIndex((book) => book.id === id);

        if (index !== -1) {
            books.splice(index, 1);
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil dihapus',
            });
            response.code(200);
            return response;
        }

        const response = h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    };

    module.exports = {
        addBooksHandler,
        getAllBooksHandler,
        getBooksByIdHandler,
        editBooksByIdHandler,
        deleteBooksByIdHandler,
    };