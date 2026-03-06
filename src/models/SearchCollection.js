const mongoose = require("mongoose");

const SearchCollectionSchema = new mongoose.Schema({
  term: { type: String, required: true },
  city: { type: String, default: "" }, // ← NUEVO CAMPO
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  businesses: { type: Array, default: [] },
  products: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});

// Para evitar duplicados por usuario + término + ciudad
SearchCollectionSchema.index({ term: 1, city: 1, createdBy: 1 }, { unique: true });

module.exports = mongoose.model("SearchCollection", SearchCollectionSchema);
