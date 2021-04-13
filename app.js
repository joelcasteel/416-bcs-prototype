/**
 * app.js
 *  Server application for the BCS (SER416) project
 * 
 * @author Joel Casteel
 * @version April2021
 * @copyright Joel Casteel, April 2021 (MIT)
 */

const fs =require('fs');
const express = require('express');
const app = express();
const path = require('path');
const expressSanitizer = require('express-sanitizer');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const env = process.env;
const auth = require('./auth/token.js');


mongoose.connect(env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const User = require('./schema/user');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(expressSanitizer());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, './bcs-client/build')));

app.use('/api', require('./api'));

app.post('/login', async (req, res) => {
    if(!('username' in req.body) || !('password' in req.body)) {
        return res.status(400).send("Credentials Missing");
    }

    try {
        let user = await User.findOne({username: req.body.username});

        if(user != null) {
            if(await bcrypt.compare(req.body.password, user.password)) {
                
                let token = jwt.sign(
                    {
                        username: user.username,
                        role: user.role
                    },
                    env.SECRET, {expiresIn: 1800}
                );

                return res.status(201)
                    .set({'Content-Type':'application/json'})
                    .send(JSON.stringify({
                        'token':token
                    }));

            }

        }
        return res.status(401).send("Incorrect username/password.");

    } catch (error) {
        console.log(error);
        return res.status(500).send("Error checking password.");

    }
});

app.post('/register', async (req, res) => {
    if(!('username' in req.body) || !('password' in req.body) || !('fullName' in req.body)) {
        return res.status(400).send("Credentials Missing");
    }

    try {
        let user = await User.findOne({username: req.body.username}).exec();

        console.log(user);
        if(user != null) {
            return res.status(409).send("The submitted username is taken");
        }

        let newRole = 'User';
        if('role' in req.body) {
            newRole = req.body.role;
        }

        let salt = await bcrypt.genSalt(10);
        let pwd = await bcrypt.hash(req.body.password, salt);

        let newUser = await User.create({
            username: req.body.username,
            fullName: req.body.fullName,
            password: pwd,
            payment: [],
            role: newRole
        });

        let token = jwt.sign(
            {
                username: newUser.username,
                role: newUser.role
            },
            env.SECRET, {expiresIn: 1800}
        );


        return res.status(201).set({'Content-Type':'application/json'})
                .send(JSON.stringify({
                    'token': token
                }));


    } catch (err) {
        console.log(err);
        return res.status(500).send("An error occured while registering user");
    }

});

/**
 */
app.get('/', (req, res) => {
    try {
        res.set({'Content-Type':'text/html'}).sendFile(path.join(__dirname, './bcs-client/build/index.html'));
    } catch(error) {
        console.log(error);

    }
    
});

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Best Community Service server running at: http://localhost:${port}`);
});


