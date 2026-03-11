const router = require("express").Router()

const auth = require("../middlewares/auth.middleware")

const Cart = require("../models/cart")
const Product = require("../models/Product")
const Ticket = require("../models/ticket")

router.get("/:cid", auth(["user"]), async (req, res) => {

  try {

    const cart = await Cart.findById(req.params.cid).populate("products.product")

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" })
    }

    res.json(cart)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})


router.post("/", auth(["user"]), async (req, res) => {

  try {

    const cart = await Cart.create({
      products: []
    })

    res.json(cart)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }

})


router.post("/:cid/products/:pid", auth(["user"]), async (req, res) => {

  try {

    const cart = await Cart.findById(req.params.cid)

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" })
    }

    const product = await Product.findById(req.params.pid)

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" })
    }

    const existingProduct = cart.products.find(
      p => p.product.toString() === req.params.pid
    )

    if (existingProduct) {

      existingProduct.quantity += 1

    } else {

      cart.products.push({
        product: req.params.pid,
        quantity: 1
      })

    }

    await cart.save()

    res.json(cart)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }

})


router.post("/:cid/purchase", auth(["user"]), async (req, res) => {

  try {

    const cart = await Cart.findById(req.params.cid).populate("products.product")

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" })
    }

    let total = 0
    let productsNotPurchased = []

    for (const item of cart.products) {

      const product = item.product

      if (product.stock >= item.quantity) {

        product.stock -= item.quantity
        await product.save()

        total += product.price * item.quantity

      } else {

        productsNotPurchased.push(product._id)

      }

    }

    const ticket = await Ticket.create({

      code: Math.random().toString(36).substring(2),

      amount: total,

      purchaser: req.user.email

    })

    cart.products = []

    await cart.save()

    res.json({
      message: "Compra realizada",
      ticket,
      productsNotPurchased
    })

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

})

module.exports = router