const express = require('express');
const app = express();
const PORT = 3000;

// Impor router buku
const bookRoutes = require('./routes/bookRoutes');

// Middleware Logger Kustom 
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toLocaleString();
    // Gunakan req.originalUrl untuk mendapatkan URL lengkap
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next(); // Melanjutkan ke middleware/handler berikutnya
};

// Terapkan Middleware Logger Kustom (Application-level)
app.use(requestLogger);

// Terapkan Middleware Built-in: express.json()
app.use(express.json());

// Built-in: express.static (untuk menyajikan file statis dari folder 'public')
app.use(express.static('public'));

// Untuk semua rute yang diawali dengan /books, gunakan bookRoutes
app.use('/books', bookRoutes);

// Rute default (homepage)
app.get('/', (req, res) => {
  res.send('Selamat datang di API Toko Buku!');
});

// Middleware Error Handling (4 ARGUMEN)
app.use((err, req, res, next) => {
    // Mencatat error ke konsol server
    console.error('--- TERJADI ERROR ---');
    console.error(err.stack);

    // Mengirim respons error 500 (Internal Server Error) ke klien
    res.status(500).json({
        message: 'Terjadi kesalahan di server',
        error: err.message
    });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});