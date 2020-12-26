const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  validationResult
} = require("express-validator");

/* ---------- Creation user -----------------*/
exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }
  bcrypt
    .hash(
      req.body.password,
      10
    ) /*hasher le mdp, 10 => nbr de tour de l'algorithme(peut prendre du tps, f° asynchrone)*/
    .then((hash) => {
      // sauvegarder le nv mdp hashé dans un nvl utilisateur
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save() // Méthode save pour enregisrer dans la BDD (asynchrone aussi donc promise)
        .then(() =>
          res.status(201).json({
            message: "Utilisateur créé !",
          })
        )
        .catch((error) =>
          res.status(400).json({
            error,
          })
        );
    })
    .catch((error) =>
      res.status(500).json({
        error,
      })
    );
}; // Erreur 500 : erreur serveur

/*-------------------- Connexion user -------------*/
exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  User.findOne({
      email: req.body.email,
    })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          error: "Utilisateur non trouvé !",
        });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              error: "Mot de passe incorrect !",
            });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({
                userId: user._id,
              },
              "2700549958242410746f88bdb4c763cfa60045fd", {
                expiresIn: "24h",
              }
            ),
          });
        })
        .catch((error) =>
          res.status(500).json({
            error,
          })
        );
    })
    .catch((error) =>
      res.status(500).json({
        error,
      })
    );
};