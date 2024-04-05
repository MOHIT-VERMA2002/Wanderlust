const express = require("express"); //require Express
const app = express();
const mongoose = require("mongoose");//require mongoose
const Listing = require("./models/listing.js") //require listing.js from models folder
const path = require("path"); //required path for the files
const methodOverride = require("method-override");//require method-override (npm i method-override)
const ejsMate = require("ejs-mate");//require ejs-mate >> help to create the layout the templete
const wrapAsync = require("./utils/wrapAsync.js"); //For the Error-Handling MiddleWare to be required
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");


//build the connections with mongoodb
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
};

//set up the views folder all (ejs) files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));// for the overMethod 
app.use(methodOverride("_method"));//use methodOverride
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));//use this code to access the css file from public folder
// and we don't need to add the code in different use in only (boilerplate.ejs) file so it use in all 



// Basic/Home (Route)
app.get("/", (req,res) =>{
    res.send("Hello I'm coding my 1st Project")
});

//Middle-ware Schema
const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body); 
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
} 


// Index (Route)
app.get("/listings", wrapAsync(async(req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

// New (Route) for add the new listing
app.get("/listings/new", (req,res) =>{
    res.render("listings/new.ejs");
});

// Show (Route)
app.get("/listings/:id", wrapAsync(async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));

// Create (Route) for the New (Route) we created at line 46.    //using wrapAsync for the Error-Handling Middle-ware
app.post(
    "/listings",
    validateListing,
    wrapAsync(async (req,res,next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");  
   })
);

// Edit (Route) to edit the created list data
app.get("/listings/:id/edit", wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing})
}));

//Update (Route)
app.put(
    "/listings/:id", 
    validateListing,
    wrapAsync(async (req,res) => {
        let {id} = req.params;
        await Listing.findByIdAndUpdate(id, {...req.body.listing});
        res.redirect(`/listings/${id}`);
    })
);

// DELETE (Route)
app.delete("/listings/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));


// testListing (Route)
// app.get("/testListing", async (req,res) => {
//     let sampleListiing = new Listing({
//         title: "My New Villa",
//         description: "By the Beach",
//         price: 1500,
//         location: "Calangute Beach, Goa",
//         country: "India",
//     });
//     await sampleListiing.save();
//     console.log("Sample was Saved");
//     res.send("Successful Testing");
// });


// When you visit an undefine Route
app.all("*", (req,res,next) => {
    next(new ExpressError(404, "Sorry Page Not Found!!"));
});

//For Handling-Error we define the Middle-ware
app.use((err,req,res,next) => {
    let { statusCode = 500, message = "Something went Wrong!! Page Not Found"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});


//listenig on port 8080
app.listen(8080, () =>{
    console.log("Server is listening to Port 8080");
});