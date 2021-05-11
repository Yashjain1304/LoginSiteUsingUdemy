const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = "thisisourlittlesecret.";
userSchema.plugin(encrypt, { secret: secret,  encryptedFields: ['password'] });

const UserModel = mongoose.model("userdb", userSchema);

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
    console.log(req.body);
    const temp = new UserModel({
        email: req.body.username,
        password: req.body.password
    });
    temp.save(function (err) {
        if (!err) {
            res.render("secrets");
        }
        else {
            console.log("error in register user");
        }
    })
});

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    UserModel.findOne({ email: username }, function (err, foundUser) {
        if (err) {
            console.log("error in login");
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                }
                else {
                    res.render("login");
                    // prompt("invalid password");
                }
            }
            else {
                res.render("login");
                // prompt("invalid account");
            }
        }
    });
    
});

app.listen(3000, function () {
    console.log("server active on port 3000");
})

