const express = require('express');
const UserManagement = require('../../controllers/UserManagement/userManagement.controller');
let router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../Frontend/public/Profile');
    }, 
    filename: function(req, file, cb) {   
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
let upload = multer({ storage, fileFilter });


router.post('/add',upload.single('Profile'),UserManagement.AddUser);

router.get('/display',UserManagement.DisplayUser);

router.get('/display/:id' ,UserManagement.getOneUser);
    
router.put('/updates/:id', UserManagement.UpdateUser);


router.post('/delete/:id',UserManagement.DeleteUser);

router.get('/:id', UserManagement.ContactUser); 


module.exports = router;