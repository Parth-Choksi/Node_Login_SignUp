const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const InitiateMongoServer = require('./config/config')
const router = require('./routes/route')

InitiateMongoServer();
const app = express();
// port
app.use(bodyParser.json());
const port = 4000;

app.use('/route',router)
// Write this to main page that display while you run program
app.get('/', (req, res) =>{
    res.json('Working Properly')
})

// That define running on port
app.listen(port, (req, res) =>{
    console.log('listening on port '+port);
})