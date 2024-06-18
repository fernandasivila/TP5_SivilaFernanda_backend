const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file);
        const pathFile = path.resolve(__dirname,'../../public/images');
        cb(null, pathFile)
    },
    filename: (req,file,cb) => {
        const filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
        cb(null,filename);
    }
})
const validationImage = (req,file,cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos JPG o PNG'));
    }
}

const upload = multer({storage: storage, validation: validationImage});

module.exports = upload;