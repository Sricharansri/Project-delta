const Listing = require("../models/listing.js");
module.exports.index =async (req, res) => {
    const listings = await Listing.find({});
    res.render("listings/index.ejs", { listings });
  };
  module.exports.rendernewform=async (req, res) => {
  
    res.render("listings/new.ejs");
  };
  module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
  
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
  
    // Debugging: Log the listing object to check if 'image' is available
    console.log("Listing Object: ", listing);
    
    res.render("listings/show.ejs", { listing });
  };
  
  module.exports.createListing=async (req, res) => {
    const newlisting = new Listing({
      ...req.body.listing,
      owner: req.user._id,
       // Assign the owner to the current user
    });
    
    await newlisting.save();
    req.flash("success", "New List Created");
    res.redirect("/listings");
  };
  module.exports.editListing=async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return next(new ExpressError(404, "Listing Not Found"));
    }
    res.render("listings/edit.ejs", { listing });
  };
  module.exports.updateListing=async (req, res, next) => {
    let { id } = req.params;
  
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
    req.flash("success", "New List updated");
    if (!updatedListing) {
      return next(new ExpressError(404, "Listing Not Found"));
    }
    res.redirect(`/listings/${updatedListing._id}`);
  };
  module.exports.destory=async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "New List Deleted");
    res.redirect("/listings");
  };
  