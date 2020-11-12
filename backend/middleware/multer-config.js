
const multer= require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
  }; // dico avec les types de fichiers que l'on peut rencontrer

const storage= multer.diskStorage({
    destination: (req, file, callback) =>{
        callback(null,'images') // null pour dire qu'il n'y a pas eu d'erreurs, le 2e argument est le nom du dossier de stockage
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join( '_'); // split pour que les espaces dans le nom originale du fichier soit récupérés et join pour qu'ils soient remplacés par des underscore
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage: storage}).single('image');