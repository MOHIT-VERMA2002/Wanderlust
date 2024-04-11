const express = require("express"); 
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
// const cookieParser = require("cookie-parser");
const session = require("express-session"); 
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// app.use(cookieParser("Seceretcode"));//we provide Seceretcode just cause of the signeed cookie

// app.get("/greet", (req,res) => {
//     let {name = "anoymous"} = req.cookies;
//     res.send(`Hii,${name}`);
// });

// // signedCookie
// app.get("/getsignedcookie", (req,res) => {
//     res.cookie("Made-in", "India", {signed: true});
//     res.send("Signed cookie send");
// });

// // Verify signedCookie
// app.get("/verify", (req,res) => {
//     console.log(req.signedCookies);
//     res.send("verified");
// })

// // Cookies
// app.get("/getcookies", (req,res) =>{
//     res.cookie("greet", "Hello");
//     res.cookie("Origin", "India");
//     res.cookie("color", "Yellow");
//     res.send("Sent you some cookies!!")
// });
 
// app.get("/", (req,res) => {
//     console.dir(req.cookies);
//     res.send("Hii I'm Server Root Route ")
// });

// app.use("/users", users);
// app.use("/posts", posts);


// Express Session
const sessionOptions = {
    secret: "mySuperSecretString", 
    resave: false, 
    saveUninitialized: true, 
};
//secret >>used to asign the session ID cookie.
//resave >>session to be saved back to the session store, even if the session was never modified during the request
//saveUninitialized >>session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified.

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})

// Register Route
app.get("/register", (req,res) => {
    let { name = "anonymous" } = req.query;
    // console.log(req.session);
    req.session.name = name;
    // console.log(req.session);
    // res.send(name);

    if(name === "anonymous") {
        req.flash("error", "User not Registered!!");
    }else {
        req.flash("success", "User Registered Successful!!");
    }
    res.redirect("/hello");
});

//Hello Route
app.get("/hello", (req,res) => {
    // res.send(`Hello, ${req.session.name}`);
    res.render("page.ejs", {name: req.session.name});
});

// // ReqCount Route
// app.get("/reqcount", (req,res) =>{
//     if(req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
    
//     res.send(`You sent a request ${req.session.count} times`)
// });

// //Test Route
// app.get("/test", (req,res) => {
//     res.send("Test Successful!!")
// });


app.listen(3000,() => {
    console.log("Server is listening on Port 3000")
});