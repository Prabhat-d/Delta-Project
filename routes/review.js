const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn , isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview)); //post route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview)); //destroy route

module.exports = router;