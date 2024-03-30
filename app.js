const express = require("express"); //require Express
const app = express();
const mongoose = require("mongoose");//require mongoose
const Listing = require("./models/listing.js") //require listing.js from models folder
const path = require("path"); //required path for the files
const methodOverride = require("method-override");//require method-override (npm i method-override)
const ejsMate = require("ejs-mate");//require ejs-mate >> help to create the layout the templete


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

// Index (Route)
app.get("/listings", async(req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

// New (Route) for add the new listing
app.get("/listings/new", (req,res) =>{
    res.render("listings/new.ejs");
});

// Show (Route)
app.get("/listings/:id", async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

// Create (Route) for the New (Route) we created at line 38.
app.post("/listings", async(req,res) => {
   //let {title,description,image,price,location,country}  = req.body;  >> like this is also good but too large code for short see below
   const newListing = new Listing(req.body.listing);
   await newListing.save();
   res.redirect("/listings");
}) 

// Edit (Route) to edit the created list data
app.get("/listings/:id/edit", async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing})
})

//Update (Route)
app.put("/listings/:id", async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});

// DELETE (Route)
app.delete("/listings/:id", async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});













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




//listenig on port 8080
app.listen(8080, () =>{
    console.log("Server is listening to Port 8080");
});