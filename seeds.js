const mongoose = require("mongoose"); // Mengimpor modul Mongoose untuk berinteraksi dengan MongoDB

// Models
const Product = require("./models/product"); // Mengimpor model Product dari file models/product.js

// Connect to mongodb
mongoose
  .connect("mongodb://127.0.0.1/shop_db") // Menghubungkan aplikasi ke database MongoDB lokal bernama "shop_db"
  .then((result) => {
    console.log("Connected to mongodb"); // Menampilkan pesan jika berhasil terhubung ke MongoDB
  })
  .catch((err) => {
    console.log(err); // Menampilkan pesan kesalahan jika terjadi masalah saat menghubungkan ke MongoDB
  });

// Data produk yang akan disemai ke dalam database
const seedProducts = [
  {
    name: "Kemeja Flanel",
    brand: "Hollister",
    price: 750000,
    color: "biru muda",
    category: "baju",
  },
  {
    name: "Celana Chino",
    brand: "Levi's",
    price: 900000,
    color: "krem",
    category: "celana",
  },
  {
    name: "Sweater",
    brand: "Gap",
    price: 650000,
    color: "merah muda",
    category: "jaket",
  },
  {
    name: "Kacamata Aviator",
    brand: "Ray-Ban",
    price: 2000000,
    color: "emas",
    category: "aksesoris",
  },
  {
    name: "Baju Renang",
    brand: "Speedo",
    price: 500000,
    color: "biru tua",
    category: "baju",
  },
  {
    name: "Topi Baseball",
    brand: "New Era",
    price: 350000,
    color: "hitam",
    category: "aksesoris",
  },
  {
    name: "Rompi",
    brand: "Zara",
    price: 850000,
    color: "abu-abu",
    category: "baju",
  },
  {
    name: "Jas",
    brand: "Hugo Boss",
    price: 4500000,
    color: "hitam",
    category: "baju",
  },
];

// Menyimpan data produk ke dalam database
Product.insertMany(seedProducts)
  .then((result) => {
    console.log(result); // Menampilkan hasil operasi penyimpanan
    console.log("Seed data added"); // Menampilkan pesan jika data berhasil disimpan
  })
  .catch((err) => {
    console.log(err); // Menampilkan pesan kesalahan jika terjadi masalah saat menyimpan data
  });
