require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
const helmet = require('helmet')
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
const expressValidator = require('express-validator');
var passport = require("./services/passportconf");
var app = express();
const cors = require('cors');

app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, access-control-allow-origin");
    next();
});


const corsOptions = {
    origin: [
      'https://exam-portal-admin-tias.vercel.app', 
      'https://exam-portal-users.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001'
    ]
  }
app.use(cors(corsOptions));
app.use(expressValidator());

//database connection
require("./services/connection");

//import files
var publicRoutes = require("./routes/public");
var login = require("./routes/login");
var adminLogin = require('./routes/adminLogin');
var admin = require('./routes/admin');
var user = require('./routes/user');
var classRoute = require('./routes/class');


//configs
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret:'express-session secret', resave: false, saveUninitialized: false}))

//passport
app.use(passport.initialize());
app.use(passport.session());

//bind routes
app.use('/api/v1/public',publicRoutes);
app.use('/api/v1/login',login);
app.use('/api/v1/adminlogin',adminLogin);
app.use('/api/v1/admin',passport.authenticate('admin-token', {session:false}),admin);
app.use('/api/v1/user',passport.authenticate('user-token', {session:false}),user);
app.use('/api/v1/class',passport.authenticate('user-token', {session:false}),classRoute);

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/public/index.html'));
});

//error handlings
app.use(function(req, res, next) {
    next(createError(404,"Invalid API. Use the official documentation to get the list of valid APIS."));
});

app.use((err, req, res, next)=>{
    console.log(err);
    const status = err.status || 500;
    res.status(status).json({
        success : false,
        message : err.message || "Internal Server Error"
    });
});


module.exports = app;

