let mongoose = require('mongoose');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let Schema = mongoose.Schema;

const matiereSchema = new Schema({
    idmatiere : Number,
    matiere: String,
    coeff: Number,
    prof : String,
    matiereimg: String,
});

module.exports = mongoose.model("Matiere", matiereSchema);
