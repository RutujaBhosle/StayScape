const Review = require("../models/review.js");
const Listing = require("../models/listing.js");



module.exports.createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "new Review created..")
    res.redirect(`/listings/${listing._id}`);
    //  console.log('new review saved');
    //  res.send("new review saved");
};


module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted..")
    res.redirect(`/listings/${id}`);
};