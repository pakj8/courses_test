//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser")
const ejs = require("ejs");
const mongoose = require("mongoose");
const ac = require("accesscontrol");
const { application } = require("express");


const app = express();

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://0.0.0.0:27017/usersDB", {useNewUrlParser: true})

const userSchema = {
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["userA", "userB", "userC", "userD"]
  }
}

const User = new mongoose.model("User", userSchema)

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login")
});



app.get("/logout", function(req, res) {
  res.render("home")
})

app.get("/courses", function(req, res) {
  res.render("next")  
})




app.post("/register", function(req, res) {
  const newUser = new User({

    email: req.body.username,
    password: req.body.password,
    role: req.body.role
  });
  newUser.save(function(err) {
    if(err) {
      console.log(err);
    }else {
      res.render("courses")
    }
  })
})








app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  User.findOne({email: username}, function(err, foundUser) {
    if(err) {
      console.log(err);
    }else {
      if(foundUser) {
        if(foundUser.password === password) {
          if(foundUser.role === role) {
            res.render("courses")
          }
        }
      }
    }
  })
});



app.listen(3000, function() {
  console.log("Server has been started");
})
