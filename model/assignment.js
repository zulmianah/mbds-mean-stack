let mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let Schema = mongoose.Schema;

let AssignmentSchema = Schema({
  id: Number,
  rendu: Boolean,
  dateDeRendu: Date,
  nom: String,
  note: Number,
  remarques: String,
  matiere: String,
  auteur: String,
  eleve: { type: Schema.Types.ObjectId, ref: "Utilisateur" },
  prof: { type: Schema.Types.ObjectId, ref: "Utilisateur" },
});

AssignmentSchema.plugin(aggregatePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model("Assignment", AssignmentSchema);
