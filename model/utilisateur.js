const mongoose = require('mongoose');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Schema = mongoose.Schema;
const Roles = require("./roles");

const UtilisateurSchema = Schema({
    idutilisateur : Number,
    nomuutilisateur: String,
    prenomutilisateur: String,
    password: String,
    role: {
        enum: Object.values(Roles),
        type: String,
    },
    utilisateurimg: String
});

UtilisateurSchema.plugin(aggregatePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Utilisateur', UtilisateurSchema);
