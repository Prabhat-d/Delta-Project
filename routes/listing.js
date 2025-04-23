const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig");
const upload = multer({ storage });

router.route("/")
.get(wrapAsync(listingController.index)) //index route 
.post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync (listingController.createNewListing)); // new listing

router.get("/new",isLoggedIn, listingController.renderNewListingForm); // new route

router.route("/:id")
.get(wrapAsync(listingController.showListings)) // show route
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing)) //update route
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing)); //destroy route

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editListingForm)); //edit route

module.exports = router;