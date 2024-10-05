const mongoose = require("mongoose");
const Product = require("./product");

const garmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nama Tidak Boleh Kosong"],
  },
  location: {
    type: String,
  },
  contact: {
    type: String,
    required: [true, "Kontak Tidak Boleh Kosong"],
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

garmentSchema.post("findOneAndDelete", async function (garment) {
  // Pengecekan apakah 'garment' tidak null dan memiliki produk yang terkait
  // 'garment' adalah dokumen garment yang dihapus, dan middleware post ini dijalankan setelah dokumen garment dihapus.
  // Karena post-middleware dijalankan setelah penghapusan, kita dapat memeriksa apakah garment ada.
  // Selain itu, kita juga memeriksa apakah garment memiliki produk terkait yang disimpan dalam array `products`.
  if (garment && garment.products.length) {
    try {
      // Jika ada produk terkait dalam garment, kita menghapus semua produk tersebut.
      // `Product.deleteMany` digunakan untuk menghapus semua dokumen dalam koleksi Product
      // yang memiliki _id yang cocok dengan id produk yang ada dalam array `garment.products`.
      const res = await Product.deleteMany({ _id: { $in: garment.products } });

      // Log untuk memberi tahu berapa banyak produk yang berhasil dihapus.
      console.log("Produk yang terkait berhasil dihapus:", res);
    } catch (error) {
      // Jika terjadi kesalahan selama penghapusan produk, log kesalahan ini ke konsol.
      // Ini untuk memastikan bahwa kesalahan ditangani dengan baik, dan proses tidak crash.
      console.error("Gagal menghapus produk terkait:", error);
    }
  }
});

const Garment = mongoose.model("Garment", garmentSchema);

module.exports = Garment;
