const asyncHandler = require('../utils/asyncHandler')
const Listing = require("../models/Listing");
const { StatusCodes } = require("http-status-codes");
const User = require('../models/User.js')
const { cloudinary } = require('../utils/cloudinary'); 


const createListing = asyncHandler(async (req, res) => {
  const { title, description, address, city, rent, isVacant, image } = req.body;

  if (!title || !description || !address || !city || !rent) {
    res.status(400);
    throw new Error('Please provide title, description, address, city, and rent');
  }

  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error('Unauthorized: user not found');
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No images uploaded.' });
  }


  const images = req.files?.map(file => ({
    url: file.path,                          // This is the Cloudinary URL
    public_id: file.filename,               // `filename` is the `public_id` in multer-storage-cloudinary
  })) || [];


  const newListing = new Listing({
    title,
    description,
    address,
    city,
    rent,
    images,
    isVacant,
    postedBy: req.user._id,
  });

  const savedListing = await newListing.save();
  // console.log(savedListing);

  await savedListing.populate('postedBy', 'name email');

  // Push listing ID to the user's "listings" array
  await User.findByIdAndUpdate(req.user._id, {
    $push: { listings: savedListing._id },
  });

  res.status(201).json(savedListing);
});


const getAllListings = asyncHandler(async (req, res) => {
  const listings = await Listing.find({}).populate('postedBy', 'name email');
  res.status(StatusCodes.OK).json(listings)
});


const getListingById = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate('postedBy', 'name email');

  if (!listing) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Listing not found' });
  }

  res.status(StatusCodes.OK).json(listing);
});


// Learn new topic Regex
const searchListing = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) return res.status(400).json({ error: 'Query is required' });

  const regex = new RegExp(q, 'i');
  const listings = await Listing.find({
    $or: [
      { title: regex },
      { description: regex },
      { address: regex },
      { city: regex }
    ]
  });

  res.json({ results: listings });
});



const updateListing = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const listingId = req.params.id; 
  
  if (!listingId) {
    return res.status(400).json({ message: "Listing ID is required" });
  }

  const listing = await Listing.findById(listingId);
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  if (listing.postedBy.toString() !== userId.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const updatedListing = await Listing.findByIdAndUpdate(
    listingId,
    req.body,
    { new: true, runValidators: true }
  ).populate("postedBy", "name email");

  res.status(200).json(updatedListing);
});



const deleteListing = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const listingId = req.params.id;

  const listing = await Listing.findById(listingId);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });

  if (listing.postedBy.toString() !== userId.toString()) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  // Delete images from Cloudinary
  const imageDeletions = listing.images.map(async (img) => {
    try {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    } catch (err) {
      console.error(`Error deleting image ${img.public_id}:`, err);
    }
  });

  await Promise.all(imageDeletions);

  // Remove listing from DB
  await Listing.findByIdAndDelete(listingId);

  // Remove from user's listing array
  const user = await User.findById(userId);
  user.listings = user.listings.filter((id) => id.toString() !== listingId);
  await user.save();

  res.json({ message: 'Listing and images deleted successfully' });
});


module.exports = {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
  searchListing,
}

