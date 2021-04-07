const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const devoirSchema = new Schema({
  note: Number,
  remarque: String,
  aRendreLe: Date,
  renduLe: Date,
  rendu: Boolean,
  authorId: String,
  matiereId: String,
});

module.exports = mongoose.model("Devoir", devoirSchema);
