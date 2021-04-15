let express = require("express");
let app = express();
let bodyParser = require("body-parser");
const dotenv = require("dotenv");
const multer = require("multer");
var path = require("path");

// import routes
let assignment = require("./routes/assignments");
let matiere = require("./routes/matieres");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const verifyToken = require("./routes/validate-token");

dotenv.config();

let mongoose = require("mongoose");
mongoose.Promise = global.Promise;
//mongoose.set('debug', true);

// remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud s
//const uri = 'mongodb+srv://mb:P7zM3VePm0caWA1L@cluster0.zqtee.mongodb.net/assignments?retryWrites=true&w=majority';
const uri = process.env.DB_CONNECT;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

mongoose.connect(uri, options).then(
  () => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
    console.log("at URI = " + uri);
    console.log(
      "vérifiez with http://localhost:8010/api/assignments que cela fonctionne"
    );
  },
  (err) => {
    console.log("Erreur de connexion: ", err);
  }
);

// Pour accepter les connexions cross-domain (CORS)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Pour les formulaires
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = process.env.PORT || 8010;

// les routes
const prefix = "/api";

app
  .route(prefix + "/assignments")
  .get(assignment.getAssignments)
  .post(assignment.postAssignment)
  .put(assignment.updateAssignment);

app.route(prefix + "/matieres").post(matiere.postMatiere);

app
  .route(prefix + "/assignments/:id")
  .get(assignment.getAssignment)
  .delete(assignment.deleteAssignment);

// middlewares
app.use(express.json()); // for body parser

// route middlewares
app.use(prefix + "/user", authRoutes);

// this route is protected with token
app.use("/api/dashboard", verifyToken, dashboardRoutes);

// upload img
//multer options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },

  filename: function (req, file, cb) {
    var myPathImages = Date.now() + path.extname(file.originalname);
    cb(null, myPathImages);
    this.path = myPathImages;
  },
});

var upload = multer({ storage: storage });
app.post(
  prefix + "/upload",
  upload.single("upload"),
  (req, res) => {
    res.json(upload);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
// fin upload img

// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log("Serveur démarré  sur http://localhost:" + port);

module.exports = app;
