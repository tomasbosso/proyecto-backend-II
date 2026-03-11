const mongoose = require("mongoose")

const ticketSchema = new mongoose.Schema({
  code: String,
  amount: Number,
  purchaser: String,
  purchase_datetime: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema)