const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
  resetToken: String,
  resetTokenExpire: Date
})

module.exports = mongoose.models.User || mongoose.model("User", userSchema)