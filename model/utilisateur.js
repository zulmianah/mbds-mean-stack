const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;
const Roles = require("./roles");

const UtilisateurSchema = Schema({
  idutilisateur: Number,
  nomuutilisateur: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  prenomutilisateur: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  utilisateurimg: String,
  role: {
    enum: Object.values(Roles),
    type: String,
  },
});

UtilisateurSchema.plugin(aggregatePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model("Utilisateur", UtilisateurSchema);
