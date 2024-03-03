const multer = require('multer');
const {v4 : uuidv4} = require('uuid');
const path = require("path");


// multer configuration for uploading apk file
// const apkstorage = multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null, './public/apkuploads') // destination folder for uploads
//     },
//     filename: function(req,file,cb){
//         const uniquefilename = uuidv4(); // generating unique filename using uuid
//         cb(null,uniquefilename +path.extname(file.originalname)); // use the unique filename for the uploaded file
//     }
// });

// [[[ THIS MULTER CONFIGURATION IS FOR SAVING FILES AT DIFFERENT LOCATION ]]]
const appStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Determine destination based on file type
        if (file.fieldname === 'apkFile') {
            cb(null, './public/APK_all/apkfile');
        } else if (file.fieldname === 'appDp') {
            cb(null, './public/APK_all/apkdp');
        } else if (file.fieldname === 'appImage') {
            cb(null, './public/APK_all/apkimage');
        } else {
            cb(new Error('Invalid fieldname'));
        }
    },
    filename: function(req, file, cb) {
        // cb(null, Date.now() + '-' + file.originalname);
        const uniquefilename = uuidv4(); // generating unique filename using uuid
        cb(null,uniquefilename +path.extname(file.originalname)); // use the unique filename for th
    }
});


// {{{ THIS MULTER CONFIGURATION IS FOR SINGLE DESTINATION}}}
// const appStorage = multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null, './public/dpuploads') // destination folder for uploads
//         },
//         filename: function(req,file,cb){
//             const uniquefilename = uuidv4(); // generating unique filename using uuid
//             cb(null,uniquefilename +path.extname(file.originalname)); // use the unique filename for the uploaded file
//         }
//   });

// Multer configuration for user DPs
const dpStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/dpuploads');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const uploadApp = multer({ storage: appStorage });
const uploadDP = multer({ storage: dpStorage });

module.exports = { uploadApp, uploadDP };
