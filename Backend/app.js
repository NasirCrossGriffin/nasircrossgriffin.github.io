const express = require('express');
const bodyParser = require('body-parser');

//STEP 1 import Mongoose 
const Mongoose = require('mongoose');

const tasksRoutes = require('./routes/tasks-routes');
const usersRoutes = require("./routes/users-routes");
const cors = require('cors');
const { default: mongoose } = require('mongoose');


//STEP 2: to create absolute paths
const path = require('path');

const app = express(); 

//STEP 1 add a new MiddleWare that parses the data
//routes are read top to bottom
//first parse the body then reach the routes
//NOTE: bodyParser.JSON will parse any JSON data and desearlize into JavaScript
//then it will call NEXT and fall into the next middleware which is "/api/places" 
app.use(bodyParser.json());   


//STEP 1 - add a middleware function 
//the idea is that we do not send back a response but add certain headers to the response
app.use((req, res, next) => {

    //This allows us to controls with domains have access to these resources
    res.setHeader("Access-Control-Allow-Origin","*");
    
    //This controls within headers are allowed
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    //This basically controls which HTTP methods can be used on the frontend    
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE');



    //move to next middleware
    next();
});

app.use(cors());
app.use("/api/tasks", tasksRoutes); 
app.use("/api/users", usersRoutes);
app.use(express.static(path.join(__dirname, '../Frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "..", "Frontend", "build", 'index.html'), err => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});



app.use((error, req, res, next) => {
  if (res.headersSent) {
      return next(error);
  }
  // Ensure the status code is valid
  const statusCode = Number.isInteger(error.code) && error.code >= 100 && error.code <= 599
      ? error.code
      : 500;
  res.status(statusCode);  
  res.json({ message: error.message || 'An unknown error occurred' });
});

//STEP 2
//mongoose.connect().then().catch();
const url = 'mongodb+srv://crossg57:NovaBlade2001@thecluster.vsedgei.mongodb.net/?retryWrites=true&w=majority&appName=TheCluster';
const PORT = process.env.PORT || 5000;
mongoose
  .connect(
    url
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log(err);
  });


//app.listen(3001);