
const { validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const task = require('../models/task');

//STEP 1: 
//NOTE: use a capital 'P' as this is a constructor function
const Task = require('../models/task');


//STEP 4 - lets use our Task model
const getTaskById = async (req, res, next) => {

    const taskId = req.params.taskId; // {TaskId: 'p1'}

    let task;
    try {
        task = await Task.findById(taskId);
    }
    catch (err) {
        return res.status(500).json( { message: 'Something went wrong, could not find a task.'  });
    }


    if(!task) {
        const error = new Error('Coult not find a Task for the provided ID');
        error.code = 404; 
        throw error; 
    }

    res.json({task: task.toObject( {getters: true})});
};



const getTaskByUserID = async (req, res, next) => {

    const userId = req.params.uid;

    //STEP 7 - lets use our TaskS model 
    // const Task = DUMMY_TaskS.find(p => {
    //     return p.creator === userId;
    // });

    //FIND is similiar to FindByID that it doesn ot return a promise
    //but FIND allows us to use Async Await
    //NOTE: using FIND would return ALL Tasks so need to add "userid" as argument
    //NOTE: FIND is available in both MongoDB and Mongoose
    //  In MongoDB it returns a Cursor and iterate through the results
    //  In Mongoose it returns a Array (can use Cursor property on Find() if want to return Curosor)
    let tasks;
    try {
        tasks = await Task.find({ creator: userId });
    } 
    catch (err) {
        return res.status(500).json( { message: 'Fetching tasks has failed, please try again later'  });
    }


    if(!tasks) {
  
        //return res.status(404).json({message: 'Could not find a Task for given user ID'});
        const error = new Error('Could not find a task for the provided ID');
        error.code = 404; 

        return next(error); //this will triggler ERROR handling middleware
    }

    
    //return the response with the Task that matches UserID

    //STEP 7 - need to add a method to our Tasks 
    //res.json({Task});
    res.json( {tasks: tasks.map(task => task.toObject({getters: true }))});

};



const createTask = async (req, res, next) => {

    //pass the request to this 
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        //lets output errors to see more detail errors
        console.log(errors);
        return res.status(422).json( { message: 'Invalid inputs, please check post data'  });
    }

    const { title, description, dayOfWeek, time, creator } = req.body;

    //STEP 2: lets use our new Task model 
    // const createdTask = {
    //     id: uuidv4(),
    //     title,
    //     description,
    //     location: coordinates,
    //     adress,
    //     creator
    // };

    //Make sre the properties are the same as they are in our Schema
    const createdTask = new Task({
        //lets add data to our model 
        //notice that what we need is already defined by our Schema
        title,
        description,
        dayOfWeek,
        time: time,
        creator
    })


    //DUMMY_TaskS.push(createdTask);
    //STEP 3 lets SAVE the Task
    //this will create the new Tasks ID  
    //this is an asyncronous task 
    try {
        await createdTask.save();
    } catch(err) {
        return res.status(500).json( { message: 'Creating Task failed, please try again'  });
    }


    res.status(201).json({Task: createdTask});

}

const deleteTaskByID = async (req, res, next) => {
        // Validate request data
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(422).json({ message: 'Invalid inputs, please check post data' });
        }
    
        const taskId = req.params.taskId;
        console.log(taskId);
    
        let task;
        try {
            task = await Task.findById(taskId);
        }
        catch (err) {
            return res.status(500).json( { message: 'Something went wrong, could not find a task for deletion.'  });
        }


    if(!task) {
        //return res.status(404).json({message: 'Could not find a Task for given ID'});
        const error = new Error('Coult not find a Task for the provided ID');
        error.code = 404; 
        throw error; //this will triggler ERROR handling middleware
    }

     
        if (!task) {
            const error = new Error('Could not find a task for the provided ID');
            error.code = 404;
            return next(error); // This will trigger the error handling middleware
        }
    
        try {
            await task.deleteOne(); // Use deleteOne() or remove()
        } catch (err) {
            return res.status(500).json({ message: 'Deleting task failed, please try again' });
        }
    
        res.status(200).json({ message: 'Deleted task.' });   
}

//Need to add this to our exports bundle
exports.createTask = createTask;
exports.getTaskById = getTaskById;
exports.getTaskByUserID = getTaskByUserID;
exports.deleteTaskByID = deleteTaskByID;
