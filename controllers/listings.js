const Listing = require("../models/listing");

// Index (Route) call Back
module.exports.index= async(req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};


// New (Route) call back
module.exports.renderNewForm = (req,res) =>{
    // console.log(req.user);
    res.render("listings/new.ejs");
}

// Show (Route) call Back
module.exports.showListing = async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
        },
    })
        .populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
};

// Create (Route) call back
module.exports.createListing = async (req,res,next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!!");
    res.redirect("/listings");  
};


// Edit (Route) call Back
module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing})
};

// Update (Route)  call Back
module.exports.updateListing = async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!!");
    res.redirect(`/listings/${id}`);
};

// Delete (Route) call Back
module.exports.destroyListing = async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};