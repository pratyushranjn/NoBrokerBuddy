require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('../models/Listing'); 
const sampleListings = require('./sampleListing'); 

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(sampleListings);
    console.log("Listings seeded successfully!");
    process.exit();
  })
  .catch(err => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
