const express = require("express")
const jwt = require("jsonwebtoken")

const router = express.Router()

const users = []

// REGISTER
router.post("/register", (req, res) => {

  const { first_name, last_name, email, password } = req.body

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: "Faltan datos" })
  }

  const user = {
    id: users.length + 1,
    first_name,
    last_name,
    email,
    password,
    role: "user"
  }

  users.push(user)

  res.json({
    message: "Usuario registrado",
    user
  })

})

// LOGIN
router.post("/login", (req, res) => {

  const { email, password } = req.body

  const user = users.find(u => u.email === email)

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Credenciales incorrectas" })
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || "secretjwt",
    { expiresIn: "1h" }
  )

  res.json({
    message: "Login correcto",
    token
  })

})

// CURRENT USER (DTO)
router.get("/current", (req, res) => {

  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: "Token requerido" })
  }

  const token = authHeader.split(" ")[1]

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secretjwt"
    )

    const user = users.find(u => u.id === decoded.id)

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    const userDTO = {
      id: user.id,
      email: user.email,
      role: user.role
    }

    res.json(userDTO)

  } catch (error) {
    res.status(401).json({ error: "Token inválido" })
  }

})

module.exports = router