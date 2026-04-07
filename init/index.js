const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.remove({});
  initData.data = initData.data.map((obj) => ({ ...obj, owner : "67f930cfd0b615154425c415"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
