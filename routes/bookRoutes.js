const express = require('express');
const router = express.Router();

// Impor data dummy
const books = require('../data/books');

// Middleware Validasi (khusus untuk POST)
const validateBook = (req, res, next) => {
    const { title, author } = req.body;

    if (!title || !author) {
        // Jika validasi gagal, kirim respons 400 (Bad Request)
        return res.status(400).json({
            message: 'Validasi gagal: Judul (title) dan Penulis (author) wajib diisi.'
        });
    }

    // Jika validasi berhasil, lanjutkan ke handler rute
    next();
};

// Rute: GET /books
// Daftar semua buku 
router.get('/', (req, res) => {
    res.json(books); // Kirim data buku sebagai JSON
});

// Rute untuk sengaja membuat error (untuk pengujian)
router.get('/testerror', (req, res, next) => {
    // Memanggil next() dengan sebuah Error akan memicu error handler
    next(new Error('Ini adalah error yang disengaja untuk pengujian!'));
});

// Rute: GET /books/:id (by ID)
router.get('/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);

    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: 'Buku tidak ditemukan' });
    }
});

// Rute: POST /books (Membuat buku baru)
router.post('/', validateBook, (req, res) => {
    // Karena middleware validasi sudah lolos, kita yakin req.body punya title & author
    const { title, author, publishedYear } = req.body;

    // Buat objek buku baru
    const newBook = {
        id: books.length + 1,
        title: title,
        author: author,
        publishedYear: publishedYear || null // publishedYear opsional
    };

    // Tambahkan ke 'database' dummy kita
    books.push(newBook);

    // Kirim respons 201 (Created) beserta data buku baru
    res.status(201).json(newBook);
});

// Rute: PUT /books/:id (Update buku berdasarkan ID)
router.put('/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const { title, author, publishedYear } = req.body;

    // Sederhanakan: Cari indeks buku
    const bookIndex = books.findIndex(b => b.id === bookId);

    // Cek jika buku tidak ditemukan
    if (bookIndex === -1) {
        return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }

    // Validasi sederhana (sama seperti di middleware, tapi inline)
    if (!title || !author) {
         return res.status(400).json({
            message: 'Validasi gagal: Judul (title) dan Penulis (author) wajib diisi.'
        });
    }

    // Update data buku
    books[bookIndex] = {
        ...books[bookIndex], // Pertahankan ID asli
        title: title,
        author: author,
        publishedYear: publishedYear || books[bookIndex].publishedYear // Jaga data lama
    };

    // Kirim data buku yang sudah diupdate
    res.json(books[bookIndex]);
});

// Rute: DELETE /books/:id (Hapus buku berdasarkan ID)
router.delete('/:id', (req, res) => {
    const bookId = parseInt(req.params.id);

    // Cari indeks buku
    const bookIndex = books.findIndex(b => b.id === bookId);

    // Cek jika buku tidak ditemukan
    if (bookIndex === -1) {
        return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }

    // Hapus buku dari array menggunakan splice
    const deletedBook = books.splice(bookIndex, 1)[0]; 

    // Kirim konfirmasi (atau data buku yang dihapus)
    res.json({ message: 'Buku berhasil dihapus', book: deletedBook });
});

module.exports = router;