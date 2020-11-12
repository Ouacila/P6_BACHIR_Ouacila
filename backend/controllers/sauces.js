
const Sauce = require('../models/sauces')

const fs= require('fs'); // file system: gestionnaire de fichiers 

exports.createSauces= (req, res, next) =>{ 
    const sauceObject = JSON.parse(req.body.sauce) //Le format de la req a été obligatoirement changé (multer) pour pvr envoyer un fichier avec la req.
    delete sauceObject._id
    const sauce = new Sauce({
      ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, /* Le front end ne connaît pas l'url de l'image car c'est le middleware multer qui a générer ce fichier.*/
     // req.protocol:http(s), host : host du serveur/images/nom du fichier.
        likes: 0,
        dislikes: 0,
        usersLiked: [req.body.usersLiked],
        usersDisliked: [req.body.usersDisliked],
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
  };
  exports.modifySauce= (req, res, next) => {
    const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
  };

  exports.deleteSauce= (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) // Trouver l'objet à supprimer, que l'id de celui ci corresponde à l'if de celui de la requête
    .then(sauce =>{
        const filename= sauce.imageUrl.split('/images')[1];    //on ne veut pas récupérer seulement l'URL mais le nom précis du fichier.
        fs.unlink(`images/${filename}`, () => { //unlink fonction du package fs pour supprimer un fichier
             Sauce.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
      .catch(error => res.status(400).json({ error }));
        })
    })
    .catch(error => res.status(500).json({error}))
   
};
exports.getOneSauce= (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
  };

  exports.getAllSauce= (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
  }

  exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    /*.then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
  }*/
    .then(sauce => {

          if (req.body.like == 1 ) {
              
              res.status(200).json({ message: 'Vous aimez cette sauce'})
              sauce.usersLiked.push(req.body.userId);
              sauce.likes +=1
              console.log('Aime')
          }
          else if (req.body.like == -1 ) {
              
            res.status(200).json({ message: 'Vous détestez cette sauce'})
            sauce.usersLiked.push(req.body.userId)
            sauce.dislikes +=1
            console.log('Déteste')
          }
       else { 
        res.status(200).json({ message: 'Pas de préférence'})
        console.log('Neutre')
       }
      })

        .catch(error => res.status(404).json({ error }));
          }
    /*
      req.body.sauce= sauce,
      req.body.message= message,
      next();
      
      .catch (error => res.status(400).json({ error }));
      
      }

          
         
    /* .then(userId => 
            
            

    .catch(error => res.status(400).json({ error }));
            } */
    



    /* Sauce.findOne({ _id: req.params.id }) 
      .then(() => res.status(200).json({ message: 'Choix enregistré'})  
      .catch(error => res.status(400).json({ error })));  
  }
    
    /*if (like=1)
    {"J'aime"}
    else if (like=-1)
    {"N'aime pas"}
    else {"Sans avis"};
  }

  switch (like) {
  case '1':
    console.log("L'utilisateur aime cette sauce");
    break;
  case '0':
    console.log("Neutre");
    break;
  case '-1':
    console.log("L'utilisateur n'aime pas cette sauce");
    break;
    }
}
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
 } 

 sauce.usersLiked.array.forEach(element => {
  if (element==req.body.userId){
    sauce.like -= 1;
    sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId),1);
  }
  if (element==req.body.userId){
    sauce.disLike -= 1;
    sauce.usersdisLiked.splice(sauce.usersdisLiked.indexOf(req.body.userId),1);
  } */