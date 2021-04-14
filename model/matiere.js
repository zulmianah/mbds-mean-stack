let mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let Schema = mongoose.Schema;

const matiereSchema = new Schema({
  nommatiere: { type: String, unique: true },
  coeffmatiere: Number,
  matiereimg: String,
  profmatiere: { type: Schema.Types.ObjectId, ref: "Utilisateur" },
});

module.exports = mongoose.model("Matiere", matiereSchema);
