const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

const dataDB = async () => {
  await Listing.deleteMany({});


  const updatedData = data.data.map(obj => ({
    ...obj,
    owner: "6890c0bdf91a7df6367f8f21"
  }));

  await Listing.insertMany(updatedData);
  console.log("Data was initialised");
};

dataDB();
