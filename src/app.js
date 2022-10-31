const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');

const sessionOptions = { 
    secret: 'secret for signing session id', 
    saveUninitialized: false, 
    resave: false 
};

app.use(session(sessionOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) => {
	console.log("Method: " + req.method + "\n" + "Path: " + req.path + "\n" + JSON.stringify(req.query));
	next();
});

app.listen(3000);

