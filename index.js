const path = require("path"); // Module untuk mengelola path file
const express = require("express"); // Framework untuk membangun aplikasi web
const methodOverride = require("method-override"); // Middleware untuk mengatasi method HTTP yang tidak standar seperti PUT dan DELETE
const mongoose = require("mongoose"); // Library untuk berinteraksi dengan MongoDB
const app = express(); // Inisialisasi aplikasi Express

// Models
const Product = require("./models/product"); // Mengimpor model Product dari file models/product.js

// Connect to mongodb
mongoose
  .connect("mongodb://127.0.0.1/shop_db") // Menghubungkan ke database MongoDB lokal
  .then((result) => {
    console.log("Connected to mongodb"); // Log jika berhasil terhubung
  })
  .catch((err) => {
    console.log(err); // Log jika terjadi error saat koneksi
  });

// Konfigurasi views
app.set("views", path.join(__dirname, "views")); // Mengatur lokasi folder views
app.set("view engine", "ejs"); // Mengatur template engine yang digunakan
app.use(express.urlencoded({ extended: true })); // Middleware untuk parsing body dari request POST
app.use(methodOverride("_method")); // Middleware untuk mendukung method HTTP PUT dan DELETE melalui parameter _method di query string

// Route untuk halaman utama
app.get("/", (req, res) => {
  res.send("Hello World"); // Mengirimkan teks "Hello World" sebagai response
});

// Route untuk menampilkan daftar produk
app.get("/products", async (req, res) => {
  const { category } = req.query; // Mendapatkan parameter category dari query string
  if (category) {
    // Jika ada parameter category
    const products = await Product.find({ category }); // Mencari produk berdasarkan kategori
    res.render("products/index", { products, category }); // Mengirimkan data ke view products/index.ejs
  } else {
    // Jika tidak ada parameter category
    const products = await Product.find({}); // Mengambil semua produk
    res.render("products/index", { products, category: "All" }); // Mengirimkan data ke view products/index.ejs dengan kategori "All"
  }
});

// Route untuk menampilkan form pembuatan produk
app.get("/products/create", (req, res) => {
  res.render("products/create"); // Mengirimkan data ke view products/create.ejs
});

// Route untuk menambahkan produk baru
app.post("/products", async (req, res) => {
  const product = new Product(req.body); // Membuat objek produk baru dengan data dari request body
  await product.save(); // Menyimpan produk ke database
  res.redirect(`/products/${product._id}`); // Redirect ke halaman detail produk yang baru dibuat
});

// Route untuk menampilkan detail produk
app.get("/products/:id", async (req, res) => {
  const { id } = req.params; // Mendapatkan id produk dari parameter URL
  const product = await Product.findById(id); // Mencari produk berdasarkan id
  res.render("products/show", { product }); // Mengirimkan data ke view products/show.ejs
});

// Route untuk menampilkan form edit produk
app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params; // Mendapatkan id produk dari parameter URL
  const product = await Product.findById(id); // Mencari produk berdasarkan id
  res.render("products/edit", { product }); // Mengirimkan data ke view products/edit.ejs
});

// Route untuk memperbarui produk
app.put("/products/:id", async (req, res) => {
  const { id } = req.params; // Mendapatkan id produk dari parameter URL
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true, // Menjalankan validasi schema Mongoose
  });
  res.redirect(`/products/${product._id}`); // Redirect ke halaman detail produk yang telah diperbarui
});

// Route untuk menghapus produk
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params; // Mendapatkan id produk dari parameter URL
  await Product.findByIdAndDelete(id); // Menghapus produk berdasarkan id
  res.redirect("/products"); // Redirect ke halaman daftar produk
});

// Menjalankan server pada port 3000
app.listen(3000, () => {
  console.log("Shop App listening on port http://127.0.0.1:3000"); // Log jika server berhasil dijalankan
});
