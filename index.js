
// =======================
// get required packages/libraries  ======
// =======================
// require express
var express     = require('express');
//require morgan. Would be used for logging to the console
var morgan      = require('morgan');
//require body parser so we can get info from POST and/or URL parameters
var bodyParser  = require('body-parser');
//require environment config, so we can pull out data
require('dotenv').config()
// require the working database connection. In this case, our database is redis. Set it to a variable called redis 
var client = require('./db');
//get the port if set or set to 8090
var port = process.env.APP_PORT || 8090;

// initilaize an instance of extress and set it to a variable called app
var app  = express();
//log the word connected to the db once database has been succesfully connected
client.on('connect', ()=> {
    console.log('connected');
});

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

//enable the app to allow cross origin requests by passing the headers as a middleware
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//require the routes which will serve our API
require('./Routes/index')(app);
// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
module.exports = app;