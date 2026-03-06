const mongoose = require("mongoose");

const UserSearchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  term: String,
  city: { type: String, default: "" }, // ← NUEVO CAMPO
  collectionId: { type: mongoose.Schema.Types.ObjectId, ref: "SearchCollection" },
  searchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("UserSearch", UserSearchSchema);
