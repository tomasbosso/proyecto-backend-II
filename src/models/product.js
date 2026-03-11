const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  stock: Number,
  category: String,
  owner: { type: String, default: "admin" }
})

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema)
