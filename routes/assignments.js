// Assignment est le "modèle mongoose", il est connecté à la base de données
let Assignment = require("../model/assignment");

const { postAssignmentValidation } = require("../services/validation");

/* Version sans pagination */
// Récupérer tous les assignments (GET)
/*
function getAssignments(req, res){
    Assignment.find((err, assignments) => {
        if(err){
            res.send(err)
        }

        res.send(assignments);
    });
}
*/

// Récupérer tous les assignments (GET), AVEC PAGINATION
function getAssignments(req, res) {
  var aggregateQuery = null;
  if (req.body.rendu) {
    aggregateQuery = Assignment.aggregate([
      { $match: { rendu: req.body.rendu } },
    ]).pop;
  } else {
    aggregateQuery = Assignment.aggregate([
      {
        $lookup: {
          from: "matieres",
          localField: "matiere",
          foreignField: "_id",
          as: "matiere",
        },
      },
      {
        $lookup: {
          from: "utilisateurs",
          localField: "eleve",
          foreignField: "_id",
          as: "eleve",
        },
      },
    ]);
  }
  Assignment.aggregatePaginate(
    aggregateQuery,
    {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    },
    (err, assignments) => {
      if (err) {
        res.send(err);
      }
      res.send(assignments);
    }
  );
}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res) {
  let assignmentId = req.params.id;

  Assignment.findOne({ id: assignmentId }, (err, assignment) => {
    if (err) {
      res.send(err);
    }
    res.json(assignment);
  });
}

// Ajout d'un assignment (POST)
function postAssignment(req, res) {
  const { error } = postAssignmentValidation(req.body);

  if (error) return res.status(400).json({ error: error.details[0].message });

  let assignment = new Assignment();
  assignment.rendu = req.body.rendu;
  assignment.dateDeRendu = req.body.dateDeRendu;
  assignment.renduLe = req.body.renduLe;
  assignment.note = req.body.note;
  assignment.remarque = req.body.remarque;
  assignment.matiere = req.body.matiere;
  assignment.eleve = req.body.eleve;
  assignment.prof = req.body.prof;

  assignment.save((err) => {
    if (err) {
      res.send("cant post assignment ", err);
    }
    res.json({ message: `${assignment._id} saved!` });
  });
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
  console.log("UPDATE recu assignment : ");
  console.log(req.body);
  Assignment.findByIdAndUpdate(
    req.body._id,
    req.body,
    { new: true },
    (err, assignment) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.json({ message: "updated" });
      }

      // console.log('updated ', assignment)
    }
  );
}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {
  Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
    if (err) {
      res.send(err);
    }
    res.json({ message: `${assignment.nom} deleted` });
  });
}

module.exports = {
  getAssignments,
  postAssignment,
  getAssignment,
  updateAssignment,
  deleteAssignment,
};
