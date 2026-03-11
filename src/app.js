const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()

const app = express()

// Routers
const authRouter = require("./routers/auth.router")
const productsRouter = require("./routers/products.router")
const cartsRouter = require("./routers/carts.router")

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Test route
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente")
})

// Conectar MongoDB
mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log("MongoDB conectado")
})
.catch((error) => {
  console.log("Error MongoDB:", error)
})

// Rutas
app.use("/api/auth", authRouter)
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

// Puerto
const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})