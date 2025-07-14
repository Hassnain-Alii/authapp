const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/authenticApp");

const userSchema = mongoose.Schema({
  name: String,
  lastname: String,
  email: String,
  password: String,
  age: Number,
  date: Date,
});

module.exports = mongoose.model("user", userSchema);
