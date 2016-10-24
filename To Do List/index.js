/**
 * Created by chanhaokun on 2016-10-23.
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var Account = require('./model/account');
var http = require('http').Server(app);

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('statics'));

app.use(require('express-session')({
    secret: 'abc123',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost/toDoList');

var itemSchema = {
    name: String,
    date: String,
    color: String
};

itemSchema = mongoose.model('itemSchema', itemSchema, "items");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/", function (req, res) {
    console.log(rea.body);
    res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/login", function (req, res) {
    console.log("hello");
    res.render("login", {});
});

app.get("/api/signup", function (req, res) {
    res.render("signup", {});
});

app.post("/api/signup", function (req, res) {
    Account.register(new Account({username: req.body.username}), req.body.password, function(err, account) {

        if (err) {
            res.render('signup', {message: err});
        } else {
            console.log(account);
            res.redirect('/');
        }

    });
});

http.listen(3000, function(){
    console.log('Server listening on *:3000');
});