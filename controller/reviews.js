const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.createreview =async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newreview = new Review(req.body.review);
    newreview.author=req.user._id;
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${listing._id}`);
  };
  module.exports.deletereview=async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "New Review Deleted");
    res.redirect(`/listings/${id}`);
  };