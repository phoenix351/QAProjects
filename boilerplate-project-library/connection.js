require("dotenv").config();
const { mongoClient, MongoClient } = require("mongodb");

async function main(callback) {
  const URI = process.env.MONGO_URI;
  const client = new MongoClient(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    await callback(client);
  } catch (error) {
    console.error(error);
    throw new Error("Unable to Connect to Database");
  }
}

module.exports = main;
