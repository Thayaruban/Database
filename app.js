const express = require("express");
const path=require("path");

const session = require("express-session");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const methodOverride = require('method-override');
const passport=require("passport");
const LocalStrategy = require('passport-local');
dotenv.config();

const app = express();//init app

const PORT = process.env.PORT;
/* Set view engine */
app.set("views",path.join(__dirname,"views"));
app.set('view engine', 'ejs');

/* Setup the middlewares & configs */
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(methodOverride('_method'));
app.use(bodyParser.json());


app.use(session({
    name:"session",
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

/* Define the static files and routes */
app.use(express.static(path.join(__dirname, './public')));
app.use(require('./routes'));

app.listen(PORT,()=>{
    console.log("Express server listening on ",PORT);
});

module.exports = app;

