const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
const userModel = require(`./models/user`);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});
app.post("/create", async (req, res) => {
  let { name, lastname, email, age, date, password } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let createdUser = await userModel.create({
        name,
        lastname,
        email,
        age,
        date,
        password: hash,
      });
      let token = jwt.sign({ email }, "secret");
      res.cookie("token", token);
      res.send(createdUser);
    });
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return res.send("Something went wrong!");
  }
  bcrypt.compare(req.body.password, user.password, (err, result) => {
    console.log(result);
    if (result === true) {
      let token = jwt.sign({ email: user.email }, "secret");
      res.cookie("token", token);
      res.send("Yes, you have login!");
    } else res.send("Something is wrong with your account!");
  });
});
app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});

app.listen(3000);
