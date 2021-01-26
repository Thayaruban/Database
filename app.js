const express = require("express");

const session = require("express-session");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config();

const app = express();

const PORT = process.env.PORT;
/* Set view engine */
app.set('view engine', 'ejs');

/* Setup the middlewares & configs */
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 10 * 24 * 60 * 60 * 1000 },//10 days
}));

/* Define the static files and routes */
app.use(express.static('./public'));
app.use(require('./routes'));

app.listen(PORT,()=>{
    console.log("Express server listening on ",PORT);
});

module.exports = app;

