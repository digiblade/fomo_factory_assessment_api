const { default: mongoose } = require("mongoose");

const initDBConnection = () => {
  mongoose
    .connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
};
module.exports = initDBConnection;
