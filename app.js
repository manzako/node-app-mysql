const express = require("express");
const ejs = require("ejs");
const mysql = require("mysql");

//Configuration de la base de données
const connection = mysql.createConnection({
  host: "localhost",
  user: "manzako",
  database: "kda_test",
  password: "mangombe"
});

//Connexion à la base de données
connection.connect(erreur => {
  if (erreur) {
    throw erreur;
  }
  console.log("La connexion à la base de données est établie");
});

//Initialisation du serveur express
const server = express();

//Dire à express de mettre les données venants du formulaire dans BODY
server.use(express.urlencoded({ extended: false }));

//Dire à express où aller trouver les vues(Nos pages web que le user sait voir)
server.set("views");

//Dire à express d'utiliser EJS comme moteur de template
server.set("view engine", "ejs");

server.get("/apprenants", (req, res) => {
  connection.query("select * from students", (erreur, resultat) => {
    if (erreur) throw erreur;
    return res.render("apprenants/index", { apprenants: resultat });
  });
});

server.post("/apprenants", (req, res) => {
  connection.query(
    `insert into students(nom,prenom) values('${req.body.nom}','${req.body.prenom}')`,
    (erreur, resultat) => {
      if (erreur) throw erreur;
      return res.redirect("/apprenants");
    }
  );
});

server.get("/apprenants/:id", (req, res) => {
  connection.query(
    `select * from students where id=${req.params.id}`,
    (erreur, resultat) => {
      if (erreur) throw erreur;
      return res.render("apprenants/show", { apprenant: resultat[0] });
    }
  );
});


server.get("/new", (req, res) => {
  return res.render("apprenants/new");
});

//debut pour modification des données existantes
server.get("/modify/:id", (req, res) => {
  connection.query(
    `select * from students where id=${req.params.id}`,
    (erreur, resultat) => {
      res.render("apprenants/modify", { apprenant: resultat[0] });
      console.log(resultat[0]);
    }
  );
});
//et puis fin modificattion avec le post ci-dessous
server.post("/modify/:id", (req, res) => {
  connection.query(
    "UPDATE students SET nom = ?, prenom = ? WHERE id = ?",
    [req.body.nom, req.body.prenom, req.params.id],
    function (error, results, fields) {
      if (error) throw error;
      return res.redirect("/apprenants");
      console.log(results);
    }
  );
});


//suppression d'un apprennant
server.get("/delete/:id", (req, res) => {
  connection.query(
    "DELETE FROM students WHERE id = " + req.params.id,
    function (error, results, fields) {
      if (error) throw error;
      console.log("deleted " + results.affectedRows + " rows");
      return res.redirect("/apprenants");
    }
  );
});

//Définition du port
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Le serveur écoute sur le port ${PORT}`);
});
