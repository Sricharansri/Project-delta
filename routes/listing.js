const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

// Validation middleware for listings
const validatelisting = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

// Index Route - List all listings
router.get("/", async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index", { listings });
});

// New Listing Route - Render the form for a new listing
router.get("/new", (req, res) => {
  res.render("listings/new");
});

// Create Listing Route - Handle form submission to create a new listing
router.post("/", validatelisting, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

// Edit Listing Route - Render the form to edit an existing listing
router.get("/:id/edit", wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    return next(new ExpressError(404, "Listing Not Found"));
  }
  res.render("listings/edit", { listing });
}));

// Update Listing Route - Handle form submission to update an existing listing
router.put("/:id", validatelisting, wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
  if (!updatedListing) {
    return next(new ExpressError(404, "Listing Not Found"));
  }
  res.redirect(`/listings/${updatedListing._id}`);
}));

// Delete Listing Route - Delete a listing and redirect to listings page
router.delete("/:id", wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  if (!deletedListing) {
    return next(new ExpressError(404, "Listing Not Found"));
  }
  res.redirect("/listings");
}));
router.get("/:id", wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews"); // Populate if there are related reviews
  if (!listing) {
    return next(new ExpressError(404, "Listing Not Found"));
  }
  res.render("listings/show", { listing });
}));


module.exports = router;
