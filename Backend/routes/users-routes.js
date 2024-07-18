const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');

const router = express.Router();

//STEP 1: import our file uplaod middleware
const fileUpload = require('../middleware/file-upload');

router.get('/', usersController.getUsers);

//STEP 2: modify the signup to include MULTER
router.post(
  '/signup',
  fileUpload.single('image'), //expect an image key on incoming request; this is how you use the MULTER middelware
  [
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 6 })
  ],
  usersController.signup
);

router.post('/login', usersController.login);

module.exports = router;
