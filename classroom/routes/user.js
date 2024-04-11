const express = require("express"); 
const router = express.Router();


// we change all [app. into router.] cause we already require it 

// [Users Routes]
//Index - for [Users]
router.get("/", (req,res) => {
    res.send("GET for Users");
});

//Show - for [Users]
router.get("/:id", (req,res) => {
    res.send("GET for User id");
});

//POST - for [Users]
router.post("/", (req,res) => {
    res.send("POST for User id");
});

//DELETE - for [Users]
router.delete("/:id", (req,res) => {
    res.send("DELETE for User id");
});


module.exports = router;