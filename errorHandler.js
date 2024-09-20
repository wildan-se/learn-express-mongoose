class errorHandler extends Error {
  constructor(message, status) {
    super();
    // Memanggil konstruktor kelas induk (Error) tanpa argumen.
    // Ini wajib dilakukan untuk memastikan kelas turunan menginisialisasi bagian dari kelas induknya.

    this.message = message;
    // Menetapkan properti message dari objek errorHandler dengan nilai message yang diberikan sebagai argumen.

    this.status = status;
    // Menetapkan properti status dengan nilai status yang diterima sebagai argumen.
  }
}

module.exports = errorHandler;
