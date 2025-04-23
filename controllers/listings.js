const Listing = require("../models/listing.js");
const fetch = require("node-fetch");

module.exports.index = async (req,res) => { //index route
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

module.exports.renderNewListingForm = (req,res) => { // new route
    res.render("listings/new.ejs");
}

module.exports.createNewListing = async (req,res) => { //new listing
    let url = req.file.path;
    let filename = req.file.filename;
    let listing = req.body.listing;

    const location = listing.location;
    const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
    const response = await fetch(geoUrl, {
        headers : {
            "User-Agent" : "wanderlust/1.0(tiny@gmail.com)"
        }
    });
    const data = await response.json();
    const lat = data.length > 0? data[0].lat: undefined;
    const lon = data.length > 0? data[0].lon: undefined;

    const newListing = await new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = {
        type : "Point",
        coordinates : [lon,lat],
    };

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}

module.exports.showListings = async (req,res) => { //show route
    let {id} = req.params;
    let listing = await Listing.findById(id).populate(
        {
        path : "reviews", 
        populate : 
        { path : "author"}
        }
        ).populate("owner");
    if(!listing) {
        req.flash("error", "Listing Doesn't Exists");
        res.redirect("/listings");
    }
    //console.log(listing.owner);
    res.render("listings/show.ejs", {listing});
}

module.exports.editListingForm = async (req,res) => { //Edit route
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing Doesn't Exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_150,h_120");

    res.render("listings/edit.ejs", {listing, originalImageUrl});
}

module.exports.updateListing = async (req,res) => { // Update route
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res) => { // Destroy route
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndRemove(id);
    console.log(deletedListing);
    req.flash("success", "listing Deleted");
    res.redirect("/listings");
}