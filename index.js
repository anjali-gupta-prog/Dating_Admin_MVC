const express = require('express');
var app = express();
const path = require('path');
const bodyParser = require('body-parser');
var fs = require('fs');
var mysql = require('mysql');  
var multer= require('multer');
// var expressValidator  = require("express-validator");
app.use(express.static('public'));
const md5=require('md5');
var session = require('express-session');
var flash = require('connect-flash');

app.use(flash());

app.use(session({ 
  // It holds the secret key for session 
  secret: 'Your_Secret_Key', 
  // Forces the session to be saved 
  // back to the session store 
  resave: true, 
  // Forces a session that is "uninitialized" 
  // to be saved to the store 
  saveUninitialized: true
})) 

/** Express middleware - cors
 * enables cross-origin-resource-sharing for express apis
 */
const cors = require("cors");
// @ts-ignore
app.use(cors());


app.use(express.static(__dirname + '/public'));
// @ts-ignore
const biodataRouter = require("./routes/router_admin");


app.set('views',path.join(__dirname,'views'));		
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// @ts-ignore
// app.use(expressValidator());

app.use("/", biodataRouter)

/**
 * Response Handling
 */
app.use(require("./helpers/response.helper"));

/**
 * After your routes add a standard express error handler. This will be passed the Joi
 * error, plus an extra "type" field so we can tell what type of validation failed
 */
app.use(require("./helpers/error.helper").handleJoiErrors);

/**
 * Error Handling
 */
app.use(require("./helpers/error.helper").handleErrors);





app.listen(8080,() => console.log(`Listening on port 8080..`))