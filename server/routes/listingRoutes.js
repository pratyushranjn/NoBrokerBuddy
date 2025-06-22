const express = require("express");
const router = express.Router();
const { protect } = require('../utils/generateToken');

const { upload } = require('../utils/cloudinary');


const {
    getAllListings,
    getListingById,
    createListing,
    searchListing,
    updateListing,
    deleteListing,
} = require("../controllers/listingController");


// Get all listings
router.get("/", getAllListings);

// Search Listing
router.get("/search", searchListing);

// Get one listing by ID
router.get("/:id", getListingById);

// Accept images with form fields
router.post('/newlisting', protect, upload.array('images', 5), createListing);

// Update listing 
router.put("/updatelisting/:id", protect, upload.array('images', 5), updateListing);

// Delete listing
router.delete('/deletelisting/:id', protect, deleteListing);


module.exports = router;
