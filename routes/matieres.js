let Matiere = require("../model/matiere");

const { postMatiereValidation } = require("../services/validation");

function postMatiere(req, res) {
  const { error } = postMatiereValidation(req.body);

  if (error) return res.status(400).json({ error: error.details[0].message });

  let matiere = new Matiere();
  matiere.nommatiere = req.body.nommatiere;
  matiere.coeffmatiere = req.body.coeffmatiere;
  matiere.profmatiere = req.body.profmatiere;
  matiere.matiereimg = req.body.matiereimg;

  matiere.save((err) => {
    if (err) {
      res.send("cant post matiere ", err);
    }
    res.json({ message: `${matiere.nommatiere} saved!` });
  });
}

module.exports = {
  postMatiere,
};
