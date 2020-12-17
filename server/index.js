// Import packages
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
let bodyParser = require('body-parser')

// App

const app = express()

// Cors
app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static('public'));
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(require('./routes/index.routes'))

// Starting server
app.listen('3333')