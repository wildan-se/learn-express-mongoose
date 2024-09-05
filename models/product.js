const mongoose = require("mongoose"); // Mengimpor modul Mongoose untuk berinteraksi dengan MongoDB

// Definisikan skema untuk koleksi produk
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["baju", "celana", "aksesoris", "jaket"],
  },
});

// Membuat model Mongoose berdasarkan skema
const Product = mongoose.model("Product", productSchema); // "Product" adalah nama model dan productSchema adalah skema yang digunakan

// Mengekspor model Product untuk digunakan di bagian lain aplikasi
module.exports = Product;
