const dotenv = require('dotenv');
dotenv.config();

const connect = require('./db/db'); // Ensure correct import syntax
connect();


const express = require('express');
const app = express();

const captainRoutes=require('./routes/captain.routes')
const cookieParser= require('cookie-parser');

const rabbbitMq = require('./service/rabbit')

rabbbitMq.connect();

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true}))



app.use('/', captainRoutes)

module.exports = app;