const path = require("path"); // Mengimpor module path bawaan Node.js untuk memanipulasi dan menyelesaikan path file
const express = require("express"); // Mengimpor framework Express untuk membuat aplikasi web
const methodOverride = require("method-override"); // Mengimpor method-override untuk mengubah method HTTP POST menjadi PUT/DELETE
const mongoose = require("mongoose"); // Mengimpor mongoose untuk berinteraksi dengan MongoDB sebagai database
const app = express(); // Inisialisasi aplikasi Express
const errorHandler = require("./errorHandler"); // Mengimpor middleware custom error handler dari file errorHandler.js

// Models
const Product = require("./models/product"); // Mengimpor model Product dari folder models untuk berinteraksi dengan database

// Connect to mongodb
mongoose
  .connect("mongodb://127.0.0.1/shop_db") // Menghubungkan aplikasi ke database MongoDB lokal bernama 'shop_db'
  .then((result) => {
    console.log("Connected to mongodb"); // Menampilkan pesan di console jika koneksi MongoDB berhasil
  })
  .catch((err) => {
    console.log(err); // Menampilkan pesan error jika koneksi MongoDB gagal
  });

// Konfigurasi views
app.set("views", path.join(__dirname, "views")); // Mengatur lokasi folder views untuk menyimpan template EJS
app.set("view engine", "ejs"); // Mengatur template engine EJS untuk rendering tampilan
app.use(express.urlencoded({ extended: true })); // Middleware untuk parsing request body dalam bentuk URL-encoded (misal dari form)
app.use(methodOverride("_method")); // Middleware yang memungkinkan penggunaan PUT/DELETE melalui parameter query string "_method"

// Fungsi pembungkus untuk menangani async error di route handlers
function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err)); // Jika ada error di handler, akan di-pass ke middleware error handling
  };
}

// Route untuk halaman utama
app.get("/", (req, res) => {
  res.send("Hello World"); // Mengirimkan teks "Hello World" saat mengakses URL root "/"
});

// Route untuk menampilkan daftar produk
app.get("/products", async (req, res) => {
  const { category } = req.query; // Mendapatkan parameter query category dari URL (opsional)
  if (category) {
    // Jika ada parameter category pada query string
    const products = await Product.find({ category }); // Mencari produk dengan kategori yang cocok dari database
    res.render("products/index", { products, category }); // Render halaman index.ejs dengan daftar produk yang cocok dan kategori yang dipilih
  } else {
    // Jika tidak ada parameter category pada query string
    const products = await Product.find({}); // Mengambil semua produk dari database
    res.render("products/index", { products, category: "All" }); // Render halaman index.ejs dengan semua produk dan label kategori "All"
  }
});

// Route untuk menampilkan form pembuatan produk baru
app.get("/products/create", (req, res) => {
  res.render("products/create"); // Render form untuk membuat produk baru
});

// Route untuk menambahkan produk baru ke database
app.post(
  "/products",
  wrapAsync(async (req, res) => {
    const product = new Product(req.body); // Membuat instance Product baru berdasarkan data yang dikirimkan di request body
    await product.save(); // Menyimpan produk baru ke database MongoDB
    res.redirect(`/products/${product._id}`); // Redirect ke halaman detail produk baru berdasarkan ID yang baru dibuat
  })
);

// Route untuk menampilkan detail produk berdasarkan ID
app.get(
  "/products/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params; // Mendapatkan parameter id dari URL
    const product = await Product.findById(id); // Mencari produk berdasarkan ID dari database
    res.render("products/show", { product }); // Render halaman show.ejs untuk menampilkan detail produk
  })
);

// Route untuk menampilkan form edit produk
app.get(
  "/products/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params; // Mendapatkan parameter id dari URL
    const product = await Product.findById(id); // Mencari produk berdasarkan ID dari database
    res.render("products/edit", { product }); // Render halaman edit.ejs dengan data produk yang akan diedit
  })
);

// Route untuk memperbarui produk berdasarkan ID
app.put(
  "/products/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params; // Mendapatkan parameter id dari URL
    const product = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true, // Menjalankan validasi berdasarkan skema Mongoose
    });
    res.redirect(`/products/${product._id}`); // Redirect ke halaman detail produk yang telah diperbarui
  })
);

// Route untuk menghapus produk berdasarkan ID
app.delete(
  "/products/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params; // Mendapatkan parameter id dari URL
    await Product.findByIdAndDelete(id); // Menghapus produk dari database berdasarkan ID
    res.redirect("/products"); // Redirect ke halaman daftar produk setelah penghapusan berhasil
  })
);

// Fungsi validatorHandler untuk menangani error validasi Mongoose
const validatorHandler = (err) => {
  err.status = 400; // Mengatur status error menjadi 400 (Bad Request)
  err.message = Object.values(err.errors).map((item) => item.message); // Mengambil pesan dari setiap error validasi dan memasukkannya ke dalam array
  return new errorHandler(err.message, err.status); // Mengembalikan errorHandler baru dengan pesan error dan status yang sudah diatur
};

// Middleware global untuk menangani error
app.use((err, req, res, next) => {
  console.log(err); // Mencetak error ke console untuk debugging
  if (err.name === "validationError") err = validatorHandler(err);
  // Jika nama error adalah "validationError", panggil validatorHandler untuk memproses error dan memberikan pesan validasi yang sesuai

  if (err.name === "castError") {
    // Jika nama error adalah "castError" (biasanya terjadi saat salah format ID MongoDB)
    err.status = 400; // Mengatur status error menjadi 400 (Bad Request)
    err.message = "Product ID not found"; // Mengatur pesan error menjadi "Product ID not found" untuk memberikan informasi yang lebih jelas
  }

  next(err); // Meneruskan error yang telah dimodifikasi ke middleware error handling berikutnya
});

// Middleware error handler untuk menangani error yang dilempar dari route
app.use((err, req, res, next) => {
  const { status = 500, message = "something went wrong" } = err; // Menangkap status dan pesan dari error
  res.status(status).send(message); // Mengirimkan response dengan status dan pesan error
});

// Menjalankan server di port 3000
app.listen(3000, () => {
  console.log("Shop App listening on port http://127.0.0.1:3000"); // Log saat server berhasil berjalan di port 3000
});
