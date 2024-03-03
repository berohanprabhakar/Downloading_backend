const multer = require('multer');
const {v4 : uuidv4} = require('uuid');
const path = require("path");


// multer configuration for uploading apk file
const apkstorage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, './public/apkuploads') // destination folder for uploads
    },
    filename: function(req,file,cb){
        const uniquefilename = uuidv4(); // generating unique filename using uuid
        cb(null,uniquefilename +path.extname(file.originalname)); // use the unique filename for the uploaded file
    }
});

// multer for uploading the profile dp 
const profiledpstorage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, './public/dpuploads') // destination folder for uploads
    },
    filename: function(req,file,cb){
        const uniquefilename = uuidv4(); // generating unique filename using uuid
        cb(null,uniquefilename +path.extname(file.originalname)); // use the unique filename for the uploaded file
    }
});




const upload = multer({storage: apkstorage});

module.exports = upload;