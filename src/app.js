const express = require('express');
const app = express();

const expressSanitizer = require('express-sanitizer');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');

//mongoose.connect(process.env.DB_URI);

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(expressSanitizer());
app.use(cookieParser());

//const accessTokenSecret = process.env.ACCESS_SECRET;



