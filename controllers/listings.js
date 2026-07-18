const Listing = require("../models/listing.js");
const fetch = require("node-fetch");

module.exports.index = async (req, res) => {
  //index route
  const allListings = await Listing.find({});
  return res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewListingForm = (req, res) => {
  // new route
  return res.render("listings/new.ejs");
};

module.exports.createNewListing = async (req, res, next) => {
  //new listing
  try {
    let url = req.file.path;
    let filename = req.file.filename;
    let listing = req.body.listing;

    const location = listing.location;
    const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;

    let lat, lon;

    try {
      const response = await fetch(geoUrl, {
        headers: {
          "User-Agent": "roamly/1.0 (tiny@gmail.com)",
        },
      });

      const contentType = response.headers.get("content-type");
      if (
        response.ok &&
        contentType &&
        contentType.includes("application/json")
      ) {
        const data = await response.json();
        lat = data.length > 0 ? data[0].lat : undefined;
        lon = data.length > 0 ? data[0].lon : undefined;
      } else {
        console.log(
          "Geocoding service returned non-JSON response, skipping coordinates.",
        );
      }
    } catch (geoErr) {
      console.log("Geocoding failed:", geoErr.message);
      // lat/lon stay undefined — listing still gets created, just without map coordinates
    }

    const newListing = await new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = {
      type: "Point",
      coordinates: [lon, lat],
    };

    let savedListing = await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};
module.exports.showListings = async (req, res) => {
  //show route
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing Doesn't Exists");
    return res.redirect("/listings");
  }
  //console.log(listing.owner);
  return res.render("listings/show.ejs", { listing });
};

module.exports.editListingForm = async (req, res) => {
  //Edit route
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing Doesn't Exist");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_150,h_120");

  return res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res, next) => {
  // Update route
  try {
    let { id } = req.params;
    let existingListing = await Listing.findById(id);

    if (!existingListing) {
      req.flash("error", "Listing Doesn't Exist");
      return res.redirect("/listings");
    }

    const locationChanged =
      req.body.listing.location &&
      req.body.listing.location !== existingListing.location;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (locationChanged) {
      try {
        const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(req.body.listing.location)}`;
        const response = await fetch(geoUrl, {
          headers: { "User-Agent": "roamly/1.0 (tiny@gmail.com)" },
        });
        const contentType = response.headers.get("content-type");
        if (
          response.ok &&
          contentType &&
          contentType.includes("application/json")
        ) {
          const data = await response.json();
          if (data.length > 0) {
            listing.geometry = {
              type: "Point",
              coordinates: [data[0].lon, data[0].lat],
            };
          }
        }
      } catch (geoErr) {
        console.log("Geocoding failed on update:", geoErr.message);
        // keep old coordinates rather than wiping them
      }
    }

    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
    }

    await listing.save();
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
};
module.exports.destroyListing = async (req, res) => {
  // Destroy route
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndRemove(id);
  console.log(deletedListing);
  req.flash("success", "listing Deleted");
  res.redirect("/listings");
};
