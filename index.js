const express = require("express");
const axios = require("axios");
require("dotenv").config();

const initDBConnection = require("./src/db-context/mongo-connect");
const { Stock, Crypto } = require("./src/model/stock-model");

const app = express();
const port = 3000;

const API_KEY = process.env.FINNHUB_API_KEY; // Replace with your actual Finnhub API key
const INTERVAL = 10000; // 5 seconds

const symbols = {
  stocks: ["GOOG", "AAPL", "TSLA", "AMZN", "MSFT"],
};

async function fetchStockQuote(symbol) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    return null;
  }
}

async function fetchCryptoQuote(symbol) {
  // /crypto/candle?symbol=BINANCE:BTCUSDT&resolution=D&from=1572651390&to=1575243390
  const url = `https://finnhub.io/api/v1/crypto/candle?symbol=${symbol}&token=${API_KEY}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching crypto data for ${symbol}:`, error);
    return null;
  }
}

async function pollData() {
  const stockPromises = symbols.stocks.map(async (symbol) => {
    const data = await fetchStockQuote(symbol);
    if (data) {
      const stock = new Stock({ symbol, data });
      await stock.save();
    }
  });

  await Promise.all([...stockPromises]);

  console.log("Data polled and saved to MongoDB");
}

setInterval(pollData, INTERVAL);

app.get("/stocks", async (req, res) => {
  const stocks = await Stock.find().sort({ timestamp: -1 }).limit(10); // Get the latest 10 entries
  res.json(stocks);
});

app.get("/cryptos", async (req, res) => {
  const cryptos = await Crypto.find().sort({ timestamp: -1 }).limit(10); // Get the latest 10 entries
  res.json(cryptos);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  initDBConnection();
});
