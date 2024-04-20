if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express"); 
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// //build the connections with mongoodb
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Connection With MongoDB Atlas
const dburl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dburl);
};


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public"))); 


const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err)
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 *24 *60 *60 *1000,
        maxAge: 7 *24 *60 *60 *1000,
        httpOnly: true,
    },
};

// // Basic/Home (Route)
// app.get("/", (req,res) =>{
//     res.send("Hello I'm coding my 1st Project")
// });



app.use(session(sessionOptions));
app.use(flash());

// For the Passport implantation 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    // console.log(res.locals.success);
    res.locals.currUser = req.user;
    next();
});



app.use("/listings", listingRouter); //this is for all the Routes we created 
app.use("/listings/:id/reviews", reviewRouter);//this is for all the Review we created/Deleted
app.use("/", userRouter);



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