const { default: mongoose } = require("mongoose");

// Define Mongoose schemas and models
const stockSchema = new mongoose.Schema({
  symbol: String,
  data: Object,
  timestamp: { type: Date, default: Date.now },
});

const cryptoSchema = new mongoose.Schema({
  symbol: String,
  data: Object,
  timestamp: { type: Date, default: Date.now },
});

const Stock = mongoose.model("Stock", stockSchema);
const Crypto = mongoose.model("Crypto", cryptoSchema);

module.exports = {
  Stock,
  Crypto,
};
