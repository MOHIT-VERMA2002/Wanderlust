const express = require("express"); 
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js")


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


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));// for the overMethod 
app.use(methodOverride("_method"));//use methodOverride
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public"))); 


// Basic/Home (Route)
app.get("/", (req,res) =>{
    res.send("Hello I'm coding my 1st Project")
});

app.use("/listings", listings); //this is for all the Routes we created 
app.use("/listings/:id/reviews", reviews);//this is for all the Review we created/Deleted


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