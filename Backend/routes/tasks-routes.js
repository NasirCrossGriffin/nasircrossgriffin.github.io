const express = require('express');

//STEP 1: import express validator 
//we need object destructoring to import the CHECK method
//CHECK method is actually a fucntion we can execute
//it will actually return a new middleware configured for our validation requirements
const { check } = require('express-validator');

const tasksControllers = require('../controllers/tasks-controllers');

const router = express.Router();

router.get('/:taskId', tasksControllers.getTaskById);
router.get('/user/:uid',  tasksControllers.getTaskByUserID);
router.delete('/delete/:taskId',  tasksControllers.deleteTaskByID);

//STEP 1: note that we can register multiple (chained) middle ware on same Method + Path combination 
//Example: we want to ensure "title" is not empty
router.post('/', //expect an image key on incoming request; this is how you use the MULTER middelware[
[ 
    check('title').notEmpty(),
    check('description').isLength({min: 5}),
    check('dayOfWeek').notEmpty(),
    check('time').notEmpty()
], tasksControllers.createTask);

module.exports = router;

