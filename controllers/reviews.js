const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req,res) => { // post route
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyReview = async (req,res) => { //delete review route
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});    
    await Review.findByIdAndRemove(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
}