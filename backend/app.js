const express = require("express");
const app = express("./app");
const helmet = require("helmet");
var session = require("cookie-session");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const path = require("path");

const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");

mongoose
  .connect(
    "mongodb+srv://Ouacila:Shuichi1@cluster0.e9qif.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
/* Ces headers permettent :
d'accéder à notre API depuis n'importe quelle origine ( '*' ) ;
d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) ;
d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).*/

var expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 heure
app.use(
  session({
    name: "session",
    keys: ["key1", "key2"],
    cookie: {
      secure: true,
      httpOnly: true,
      expires: 24,
    },
  })
);

app.use(bodyParser.json());
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", saucesRoutes);
app.use(express.json());

app.use(helmet());

module.exports = app; // ici on exporte l'app
