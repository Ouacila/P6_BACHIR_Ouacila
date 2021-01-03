const Sauce = require('../models/sauces')

const fs = require('fs'); // file system: gestionnaire de fichiers 
/*------------- Creation sauce +enregistrement BDD ----------*/
exports.createSauces = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce) //Le format de la req a été obligatoirement changé (multer) pour pvr envoyer un fichier avec la req.
  delete sauceObject._id
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    /* Le front end ne connaît pas l'url de l'image car c'est le middleware multer qui a générer ce fichier.*/
    // req.protocol:http(s), host : host du serveur/images/nom du fichier.
    likes: 0,
    dislikes: 0,
    usersLiked: [req.body.usersLiked],
    usersDisliked: [req.body.usersDisliked],
  });
  sauce.save()
    .then(() => res.status(201).json({
      message: 'Sauce enregistrée !'
    }))
    .catch(error => res.status(400).json({
      error
    }));
};
/*------------------ Update sauce -------------*/
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? // regarde si req.file existe ou non
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
      ...req.body
    };
  Sauce.updateOne({
      _id: req.params.id
    }, {
      ...sauceObject,
      _id: req.params.id
    })
    .then(() => res.status(200).json({
      message: 'Sauce modifiée !'
    }))
    .catch(error => res.status(400).json({
      error
    }));
};
/*-------------------- Delete sauce --------------*/
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({
      _id: req.params.id
    }) // Trouver l'objet à supprimer, que l'id de celui ci corresponde à l'id de celui de la requête
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images')[1]; //on ne veut pas récupérer seulement l'URL mais le nom précis du fichier.
      fs.unlink(`images/${filename}`, () => { //unlink fonction du package fs pour supprimer un fichier
        Sauce.deleteOne({
            _id: req.params.id
          })
          .then(() => res.status(200).json({
            message: 'Sauce supprimée !'
          }))
          .catch(error => res.status(400).json({
            error
          }));
      })
    })
    .catch(error => res.status(500).json({
      error
    }))

};
/*-------------- Recupération d'un sauce -----------*/
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
      _id: req.params.id
    })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({
      error
    }));
};
/*---------------- Récupérations de toutes les sauces ------------*/
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({
      error
    }));
}
/*-------------- Likes & Dislikes ------------*/
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({
      _id: req.params.id
    })
    .then(sauce => {

      if (req.body.like == 1 && sauce.usersLiked.indexOf(req.body.userId) < 0) {
        res.status(200).json({
          message: 'Vous aimez cette sauce'
        })
        sauce.usersLiked.push(req.body.userId);
        sauce.likes += 1
        sauce.save()
          .then(() => res.status(201).json({
            message: 'Sauce aimée'
          }))
          .catch(error => res.status(400).json({
            error
          }));
        console.log('Aime');
      } else if (req.body.like == -1 && sauce.usersDisliked.indexOf(req.body.userId) < 0) {
        res.status(200).json({
          message: 'Vous détestez cette sauce'
        })
        sauce.usersDisliked.push(req.body.userId)
        sauce.dislikes += 1
        sauce.save()
          .then(() => res.status(201).json({
            message: 'Sauce détestée !'
          }))
          .catch(error => res.status(400).json({
            error
          }));
        console.log('Déteste');
      } else {
        sauce.usersLiked.forEach(element => {
          if (element == req.body.userId) {
            sauce.likes -= 1
            sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId), 1);
          }
        });
        sauce.usersDisliked.forEach(element => {
          if (element == req.body.userId) {
            sauce.dislikes -= 1
            sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(req.body.userId), 1);
          }
        });
        res.status(200).json({
          message: 'Pas de préférence'
        })
        sauce.save()
          .then(() => res.status(201).json({
            message: 'Sauce détestée !'
          }))
          .catch(error => res.status(400).json({
            error
          }));
        console.log('Neutre');
      }
    })

    .catch(error => res.status(404).json({
      message: "Vous ne pouvez pas saisir votre choix"
    }));
}